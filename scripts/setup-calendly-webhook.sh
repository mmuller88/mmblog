#!/usr/bin/env bash
# Register Calendly webhook → martinmueller.dev/api/calendly-webhook
# Requires: CALENDLY_PAT, CALENDLY_WEBHOOK_SIGNING_KEY
# Run AFTER /api/calendly-webhook is live + signing key is in Secrets Manager.

set -euo pipefail

: "${CALENDLY_PAT:?Set CALENDLY_PAT}"
: "${CALENDLY_WEBHOOK_SIGNING_KEY:?Set CALENDLY_WEBHOOK_SIGNING_KEY}"

WEBHOOK_URL="${WEBHOOK_URL:-https://martinmueller.dev/api/calendly-webhook}"
API="https://api.calendly.com"
AUTH="Authorization: Bearer ${CALENDLY_PAT}"

echo "Fetching Calendly user/org..."
ME=$(curl -sS "$API/users/me" -H "$AUTH")
if ! echo "$ME" | python3 -c "import sys,json; json.load(sys.stdin)['resource']['uri']" 2>/dev/null; then
 echo "users/me failed:"
 echo "$ME"
 exit 1
fi

USER_URI=$(echo "$ME" | python3 -c "import sys,json; print(json.load(sys.stdin)['resource']['uri'])")
ORG_URI=$(echo "$ME" | python3 -c "import sys,json; print(json.load(sys.stdin)['resource']['current_organization'])")

echo "Listing existing webhooks for org..."
LIST_URL="$API/webhook_subscriptions?organization=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$ORG_URI', safe=''))")&scope=user"
EXISTING=$(curl -sS "$LIST_URL" -H "$AUTH")
echo "$EXISTING" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for item in data.get('collection', []):
    r = item.get('resource', item)
    print(f\"  - {r.get('callback_url')} state={r.get('state')} events={r.get('events')}\")
" 2>/dev/null || echo "  (could not parse list: $EXISTING)"

if echo "$EXISTING" | grep -q "$WEBHOOK_URL"; then
 echo "Webhook already registered for $WEBHOOK_URL — skip create, test with a booking."
 exit 0
fi

PAYLOAD=$(WEBHOOK_URL="$WEBHOOK_URL" ORG_URI="$ORG_URI" USER_URI="$USER_URI" \
  CALENDLY_WEBHOOK_SIGNING_KEY="$CALENDLY_WEBHOOK_SIGNING_KEY" python3 -c "
import json, os
print(json.dumps({
  'url': os.environ['WEBHOOK_URL'],
  'events': ['invitee.created'],
  'organization': os.environ['ORG_URI'],
  'user': os.environ['USER_URI'],
  'scope': 'user',
  'signing_key': os.environ['CALENDLY_WEBHOOK_SIGNING_KEY'],
}))
")

echo "Creating webhook subscription → ${WEBHOOK_URL}"
RESP_FILE=$(mktemp)
HTTP_CODE=$(curl -sS -o "$RESP_FILE" -w "%{http_code}" -X POST "$API/webhook_subscriptions" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

BODY=$(cat "$RESP_FILE")
rm -f "$RESP_FILE"

echo "HTTP $HTTP_CODE"
if [ "$HTTP_CODE" = "201" ]; then
 echo "$BODY" | python3 -m json.tool
 echo "Done. Test with a real 30min booking."
elif [ "$HTTP_CODE" = "409" ]; then
 echo "Webhook URL already exists (409). Test with a booking or delete old subscription in Calendly API."
 echo "$BODY"
else
 echo "Failed:"
 echo "$BODY"
 exit 1
fi

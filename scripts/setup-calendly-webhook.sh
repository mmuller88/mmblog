#!/usr/bin/env bash
# Register Calendly webhook → martinmueller.dev/api/calendly-webhook
# Requires: CALENDLY_PAT, CALENDLY_WEBHOOK_SIGNING_KEY (same as Netlify env)
# Run AFTER Netlify deploy + env vars are set.

set -euo pipefail

: "${CALENDLY_PAT:?Set CALENDLY_PAT}"
: "${CALENDLY_WEBHOOK_SIGNING_KEY:?Set CALENDLY_WEBHOOK_SIGNING_KEY}"

WEBHOOK_URL="${WEBHOOK_URL:-https://martinmueller.dev/api/calendly-webhook}"

echo "Fetching Calendly user/org..."
ME=$(curl -sf "https://api.calendly.com/users/me" \
  -H "Authorization: Bearer ${CALENDLY_PAT}")

USER_URI=$(echo "$ME" | python3 -c "import sys,json; print(json.load(sys.stdin)['resource']['uri'])")
ORG_URI=$(echo "$ME" | python3 -c "import sys,json; print(json.load(sys.stdin)['resource']['current_organization'])")

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
curl -sf -X POST "https://api.calendly.com/webhook_subscriptions" \
  -H "Authorization: Bearer ${CALENDLY_PAT}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" | python3 -m json.tool

echo "Done. Test with a real 30min booking."

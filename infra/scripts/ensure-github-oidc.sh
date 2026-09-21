#!/usr/bin/env bash
set -euo pipefail
# Create GitHub Actions OIDC provider if missing. CDK imports it; does not create it.
EXISTING=$(aws iam list-open-id-connect-providers \
  --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" \
  --output text)
if [[ -n "${EXISTING}" && "${EXISTING}" != "None" ]]; then
  echo "OIDC provider exists: ${EXISTING}"
  exit 0
fi
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com
echo "Created GitHub OIDC provider"

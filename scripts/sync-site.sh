#!/usr/bin/env bash
set -euo pipefail
# Sync Gatsby public/ to S3 with cache headers, then invalidate CloudFront.
BUCKET="${1:?bucket}"
DIST="${2:?distribution id}"
PUBLIC="${3:-public}"

LONG="public,max-age=31536000,immutable"
SHORT="public,max-age=0,must-revalidate"

aws s3 sync "${PUBLIC}" "s3://${BUCKET}" --delete \
  --cache-control "${LONG}" \
  --exclude "*.html" \
  --exclude "sw.js" \
  --exclude "page-data/*" \
  --exclude "*.json" \
  --exclude "manifest.webmanifest"

aws s3 sync "${PUBLIC}" "s3://${BUCKET}" \
  --cache-control "${SHORT}" \
  --exclude "*" \
  --include "*.html" \
  --include "sw.js" \
  --include "page-data/*" \
  --include "*.json" \
  --include "manifest.webmanifest"

aws cloudfront create-invalidation --distribution-id "${DIST}" --paths "/*"

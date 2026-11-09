#!/bin/bash
# Rebuild the Trueworth Word templates (letter, invoice, receipt) into brand/templates.
# Each is written as a .docx and as a .dotx template, with the brand fonts embedded.
set -euo pipefail
cd "$(dirname "$0")/../.."
TMP=$(mktemp -d)
for doc in Letter Invoice Receipt; do
  lower=$(echo "$doc" | tr '[:upper:]' '[:lower:]')
  node "tools/letterhead/build-$lower.js" "$TMP/$lower.docx" >/dev/null
  python3 tools/letterhead/embed-fonts.py "$TMP/$lower.docx" "brand/templates/Trueworth-$doc.docx" --dotx "brand/templates/Trueworth-$doc-Template.dotx"
done
rm -rf "$TMP"

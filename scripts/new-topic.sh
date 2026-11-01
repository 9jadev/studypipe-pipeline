#!/usr/bin/env bash
# Create a new topic folder from the template.  Usage: bash scripts/new-topic.sh <slug>
set -euo pipefail
slug="${1:?usage: new-topic.sh <slug>  e.g. ss2-chem-acid-base-titration}"
dest="topics/$slug"
if [ -e "$dest" ]; then echo "Already exists: $dest"; exit 1; fi
cp -R topics/_template "$dest"
sed -i.bak "s/__SLUG__/$slug/g" "$dest/status.md" && rm -f "$dest/status.md.bak"
echo "Created $dest — put textbook pages, past questions and notes in $dest/sources/"

#!/usr/bin/env bash
# Create a new topic folder from the template.  Usage: bash scripts/new-topic.sh <slug> [theme-id]
set -euo pipefail
slug="${1:?usage: new-topic.sh <slug>  e.g. ss2-chem-acid-base-titration}"
dest="topics/$slug"
if [ -e "$dest" ]; then echo "Already exists: $dest"; exit 1; fi
cp -R topics/_template "$dest"
sed -i.bak "s/__SLUG__/$slug/g" "$dest/status.md" && rm -f "$dest/status.md.bak"
theme="${2:-}"
if [ -n "$theme" ]; then
  [ -f "themes/$theme/theme.json" ] || { echo "Unknown theme: $theme (see: node scripts/apply-theme.mjs --list)"; rm -rf "$dest"; exit 1; }
  sed -i.bak "s/^state: \(.*\)$/state: \1\ntheme: $theme/" "$dest/status.md" && rm -f "$dest/status.md.bak"
  grep -q "^theme: $theme" "$dest/status.md" || printf '%s\n' "theme: $theme" >> "$dest/status.md"
fi
echo "Created $dest — put textbook pages, past questions and notes in $dest/sources/"

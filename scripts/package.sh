#!/usr/bin/env bash
# Package a QA-passed lesson.  Usage: bash scripts/package.sh <slug>
set -euo pipefail
slug="${1:?usage: package.sh <slug>}"
src="topics/$slug/html"
[ -f "$src/index.html" ] || { echo "No lesson at $src"; exit 1; }
grep -q "verdict: PASS" "topics/$slug/05-qa-report.md" 2>/dev/null || { echo "QA has not passed for $slug"; exit 1; }

build="$(mktemp -d)/$slug"
mkdir -p "$build" exports
cp -R "$src/." "$build/"
node scripts/manifest.mjs "$slug" "$build"
( cd "$(dirname "$build")" && rm -f "$OLDPWD/exports/$slug.zip" && zip -qr "$OLDPWD/exports/$slug.zip" "$slug" )
echo "Packaged exports/$slug.zip ($(du -h "exports/$slug.zip" | cut -f1))"

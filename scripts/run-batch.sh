#!/usr/bin/env bash
# Headless overnight batch: works through queue.md with the Antigravity CLI (agy), then commits the results.
# Usage (on your Mac or a server):  bash scripts/run-batch.sh
# Schedule with cron, e.g.  0 23 * * *  cd ~/studypipe-studio && bash scripts/run-batch.sh >> batch.log 2>&1
# Check `agy --help` for the current flags of your agy version.
set -uo pipefail
cd "$(dirname "$0")/.."

grep -q "^- \[ \]" queue.md || { echo "Queue is empty."; exit 0; }

# agy may not be on PATH (default install: ~/.gemini/bin/agy).
AGY="$(command -v agy || echo "$HOME/.gemini/bin/agy")"
# The CLI ignores the model chosen in the Antigravity app. Pick one with AGY_MODEL (list: agy models).
MODEL_ARGS=(); [ -n "${AGY_MODEL:-}" ] && MODEL_ARGS=(--model "$AGY_MODEL")

# studio-director delegates each step to specialist subagents (.agents/agents/). Set STUDIO_SOLO=1 to use the single-agent run-topic flow.
if [ -z "${STUDIO_SOLO:-}" ] && [ -f .agents/agents/studio-director.md ]; then
  "$AGY" --agent studio-director ${MODEL_ARGS[@]+"${MODEL_ARGS[@]}"} -p "Run the queue in queue.md in batch mode. Do not ask questions; \
follow GEMINI.md and run-topic, record assumptions in each status.md, and append to run-log.md." \
    --mode accept-edits
else
  "$AGY" ${MODEL_ARGS[@]+"${MODEL_ARGS[@]}"} -p "Use the run-topic skill in batch mode: run the queue in queue.md. Do not ask questions; \
follow GEMINI.md, record assumptions in each status.md, and append to run-log.md." \
    --mode accept-edits
fi

node scripts/render-status.mjs --all

if [ -d .git ]; then
  git add -A && git commit -qm "batch: $(date '+%Y-%m-%d %H:%M')" && git push -q || true
fi

# Optional phone notification (https://ntfy.sh). Set NTFY_TOPIC in your environment.
if [ -n "${NTFY_TOPIC:-}" ]; then
  curl -s -d "StudyPipe batch finished: $(tail -n 5 run-log.md | tr '\n' ' ')" "https://ntfy.sh/$NTFY_TOPIC" >/dev/null
fi

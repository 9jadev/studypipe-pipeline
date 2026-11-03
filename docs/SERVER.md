# Running batches on a server (e.g. Hostinger VPS, Ubuntu, 8 GB)

Build and test on your Mac first. Move to a server only when single topics work well.

## Setup
```bash
# as root, once
adduser studio && usermod -aG sudo studio
ufw allow OpenSSH && ufw enable          # add 443 later if you host a review site
# as the studio user
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs git zip tmux
# install the Antigravity CLI (agy) per https://antigravity.google/docs/cli
git clone <your-private-repo> ~/studypipe-studio && cd ~/studypipe-studio
npm install && npx playwright install --with-deps chromium
agy               # first run: sign in with the prompts it shows, then /exit
```
Source PDFs are not in Git. Copy them over with `scp` or `rsync`, e.g.
`rsync -av topics/*/sources server:~/studypipe-studio/topics/`.

## Run
- **Watch live:** `tmux new -s studio`, run `agy`, say "run the queue in batch mode",
  then detach with `Ctrl-b d`. Reattach later with `tmux attach -t studio` (Termius works on a phone).
- **Nightly, automatic:** `crontab -e` and add
  `0 23 * * * cd ~/studypipe-studio && bash scripts/run-batch.sh >> batch.log 2>&1`
- **Phone alert:** install the ntfy app, choose a secret topic name, and add
  `NTFY_TOPIC=<name>` at the top of the crontab.

## Review in the morning
- `git pull` on your Mac and open `topics/<slug>/html/index.html`, **or**
- serve the topics folder behind a password with Caddy (`basicauth`) and review on your phone.

## Notes
- Plan usage limits apply. A long batch may pause until your limit resets.
- Never run the agent as root. Use `agy --sandbox` if you want shell commands isolated.

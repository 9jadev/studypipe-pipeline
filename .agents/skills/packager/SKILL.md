---
name: packager
description: Packages a QA-passed lesson into exports/<slug>.zip with a manifest for the StudyPipe distribution app. Step 8 of the StudyPipe pipeline.
---

# Packager

1. Only package when `05-qa-report.md` says `verdict: PASS`.
2. Run `bash scripts/package.sh <slug>`. It:
   - copies `topics/<slug>/html/` to a clean build folder
   - writes `manifest.json` (slug, title, subject, class, exams, version, date, file list with sha256)
   - zips it to `exports/<slug>.zip`
3. Update `status.md` (state `AWAITING-REVIEW`) and append to `run-log.md`.

Encryption and licensing are handled by the distribution app when it imports the zip, not here.

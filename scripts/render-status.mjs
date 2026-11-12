#!/usr/bin/env node
/**
 * render-status.mjs
 * Generates an offline, interactive HTML status dashboard for a topic (topics/<slug>/status.html)
 * and an overall studio index (status.html).
 * 
 * Usage:
 *   node scripts/render-status.mjs topics/ss2-bio-heart-circulation
 *   node scripts/render-status.mjs --all
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function parseStatusMd(content) {
  const lines = content.split('\n');
  let slug = '';
  const meta = {};
  const steps = [];
  let inTable = false;
  let section = '';
  const sections = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!slug && trimmed.startsWith('# ')) {
      slug = trimmed.replace('# ', '').trim();
      continue;
    }
    if (!inTable && trimmed.includes(':') && !trimmed.startsWith('|') && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf(':');
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).split('#')[0].trim();
      meta[k] = v;
      continue;
    }
    if (trimmed.startsWith('| step |')) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (trimmed.startsWith('|---')) continue;
      if (trimmed.startsWith('|')) {
        const parts = trimmed.split('|').map(p => p.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (parts.length >= 3) {
          steps.push({
            step: parts[0] || '',
            state: (parts[1] || '').toLowerCase(),
            updated: parts[2] || '',
            note: parts[3] || ''
          });
        }
      } else {
        inTable = false;
      }
    }
    if (trimmed.startsWith('## ')) {
      section = trimmed.replace('## ', '').trim();
      sections[section] = [];
      continue;
    }
    if (section && trimmed) {
      sections[section].push(trimmed);
    }
  }

  return { slug, meta, steps, sections };
}

function getFileSize(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const bytes = fs.statSync(filePath).size;
      if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      return Math.round(bytes / 1024) + ' KB';
    }
  } catch {}
  return null;
}

function renderTopicStatusHtml(topicDir) {
  const slug = path.basename(topicDir);
  const statusMdPath = path.join(topicDir, 'status.md');
  if (!fs.existsSync(statusMdPath)) return null;

  const parsed = parseStatusMd(fs.readFileSync(statusMdPath, 'utf8'));
  const state = (parsed.meta.state || 'IN-PROGRESS').toUpperCase();
  const theme = parsed.meta.theme || 'editorial-ink';
  const videos = parsed.meta.videos || 'auto';

  // Check review status (04-review.md)
  let reviewVerdict = 'NOT-STARTED';
  const reviewPath = path.join(topicDir, '04-review.md');
  if (fs.existsSync(reviewPath)) {
    const revContent = fs.readFileSync(reviewPath, 'utf8');
    if (/verdict:\s*PASS/i.test(revContent)) reviewVerdict = 'PASS';
    else if (/verdict:\s*FIX/i.test(revContent)) reviewVerdict = 'FIX';
  }

  // Check QA report (05-qa-report.md)
  let qaVerdict = 'PENDING';
  const qaPath = path.join(topicDir, '05-qa-report.md');
  if (fs.existsSync(qaPath)) {
    const qaContent = fs.readFileSync(qaPath, 'utf8');
    if (/verdict:\s*PASS/i.test(qaContent)) qaVerdict = 'PASS';
    else if (/verdict:\s*FAIL/i.test(qaContent)) qaVerdict = 'FAIL';
  }

  // Check export zip
  const zipPath = path.join(ROOT, 'exports', `${slug}.zip`);
  const zipSize = getFileSize(zipPath);

  // Check previewable HTML
  const hasHtml = fs.existsSync(path.join(topicDir, 'html', 'index.html'));

  // Collect QA screenshots
  const qaDir = path.join(topicDir, 'qa');
  const screenshots = [];
  if (fs.existsSync(qaDir)) {
    const files = fs.readdirSync(qaDir).filter(f => f.endsWith('.png'));
    for (const f of files) {
      screenshots.push({ name: f, relPath: `qa/${f}` });
    }
  }

  // Determine Notification Alert Banner
  let bannerClass = 'banner-info';
  let bannerIcon = 'ℹ️';
  let bannerTitle = 'Pipeline In Progress';
  let bannerMessage = 'Specialist agents are building and validating the topic components.';

  const isStep4Done = parsed.steps.some(s => s.step.includes('4') && s.state === 'done');
  const isStep5Done = parsed.steps.some(s => s.step.includes('5') && s.state === 'done');

  if (state === 'NEEDS-HUMAN' || reviewVerdict === 'FIX') {
    bannerClass = 'banner-danger';
    bannerIcon = '⚠️';
    bannerTitle = 'Action Needed: Blocking Issues Detected';
    bannerMessage = 'A step failed validation or the accuracy reviewer requested fixes. Inspect 04-review.md or status.md.';
  } else if (isStep4Done && !isStep5Done) {
    bannerClass = 'banner-warning';
    bannerIcon = '✋';
    bannerTitle = 'Human Review Required (Gate 4 Approval)';
    bannerMessage = `Accuracy reviewer gave verdict: <strong>${reviewVerdict}</strong>. Please review 02-lesson.md and approve it to trigger Step 5 (HTML rendering).`;
  } else if (state === 'AWAITING-REVIEW') {
    bannerClass = 'banner-review';
    bannerIcon = '📱';
    bannerTitle = 'Packaged & Awaiting Your Mobile Review';
    bannerMessage = 'All 8 stages finished with QA PASS. Open the Welcome Hub below on phone view to test the live lessons.';
  } else if (state === 'DONE') {
    bannerClass = 'banner-success';
    bannerIcon = '✓';
    bannerTitle = 'Topic Shipped & Approved';
    bannerMessage = `Production complete. Distribution package: exports/${slug}.zip (${zipSize || 'built'}).`;
  }

  const isRunning = state === 'IN-PROGRESS';
  const autoRefreshMeta = isRunning ? '<meta http-equiv="refresh" content="5">' : '';

  // Calculate Progress %
  const totalSteps = parsed.steps.length || 8;
  const doneSteps = parsed.steps.filter(s => s.state === 'done').length;
  const progressPct = Math.round((doneSteps / totalSteps) * 100);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${autoRefreshMeta}
  <title>${slug} — Live Status Dashboard</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card: #111827;
      --card-subtle: #162032;
      --border: rgba(255, 255, 255, 0.08);
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
      --primary: #6366f1;
      --accent: #06b6d4;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-main);
      padding: 24px;
      line-height: 1.5;
      min-height: 100vh;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
    }
    .topic-meta-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .badge {
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-state {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.4);
    }
    .badge-state.done { background: rgba(16, 185, 129, 0.2); color: var(--success); border-color: rgba(16, 185, 129, 0.4); }
    .badge-state.awaiting-review { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); }
    .badge-state.needs-human { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.4); }

    /* Alert Banner */
    .banner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px solid;
    }
    .banner-icon { font-size: 28px; }
    .banner h2 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
    .banner p { font-size: 13px; opacity: 0.9; }

    .banner-danger { background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.4); color: #fca5a5; }
    .banner-warning { background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.4); color: #fde68a; }
    .banner-review { background: rgba(6, 182, 212, 0.12); border-color: rgba(6, 182, 212, 0.4); color: #a5f3fc; }
    .banner-success { background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.4); color: #6ee7b7; }
    .banner-info { background: rgba(99, 102, 241, 0.12); border-color: rgba(99, 102, 241, 0.4); color: #c7d2fe; }

    /* Action Buttons */
    .action-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
    }
    .btn:hover { background: #1f2937; border-color: rgba(255, 255, 255, 0.2); transform: translateY(-1px); }
    .btn-primary { background: var(--primary); color: #fff; border-color: var(--primary); }
    .btn-primary:hover { background: #4f46e5; }
    .btn-accent { background: rgba(6, 182, 212, 0.15); color: #67e8f9; border-color: rgba(6, 182, 212, 0.3); }

    /* Progress & Stepper */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      width: ${progressPct}%;
      transition: width 0.3s ease;
    }

    /* Steps Table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      text-align: left;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--text-dim);
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .step-tag {
      font-weight: 700;
      font-family: var(--font-mono);
      font-size: 12px;
    }
    .step-status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      font-family: var(--font-mono);
      text-transform: uppercase;
    }
    .step-status.done { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .step-status.todo { background: rgba(255, 255, 255, 0.05); color: var(--text-dim); }
    .step-status.in-progress { background: rgba(245, 158, 11, 0.15); color: #fbbf24; animation: pulse 1.5s infinite; }

    @keyframes pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }

    /* Screenshots Grid */
    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 10px;
    }
    .shot-card {
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.15s ease;
      text-decoration: none;
      color: inherit;
    }
    .shot-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .shot-img {
      width: 100%;
      height: 240px;
      object-fit: cover;
      background: #000;
      display: block;
    }
    .shot-name {
      padding: 8px 10px;
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="logo-badge">⚡</div>
        <div>
          <h1 style="font-size: 18px; font-weight: 700;">${slug}</h1>
          <div class="topic-meta-row">
            <span class="badge badge-state ${state.toLowerCase()}">${state}</span>
            <span>🎨 Theme: <strong>${theme}</strong></span>
            <span>🎬 Videos: <strong>${videos}</strong></span>
            ${isRunning ? '<span style="color: #fbbf24;">● Auto-refreshing every 5s</span>' : ''}
          </div>
        </div>
      </div>
      <div>
        <a href="../../status.html" class="btn" style="font-size: 12px;">← All Topics</a>
      </div>
    </header>

    <!-- Prominent Action / Status Banner -->
    <div class="banner ${bannerClass}">
      <div class="banner-icon">${bannerIcon}</div>
      <div>
        <h2>${bannerTitle}</h2>
        <p>${bannerMessage}</p>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="action-bar">
      ${hasHtml ? `<a href="html/index.html" class="btn btn-primary" target="_blank">📱 Preview Welcome Hub</a>` : ''}
      <a href="02-lesson.md" class="btn" target="_blank">📄 02-lesson.md</a>
      <a href="03-questions.md" class="btn" target="_blank">📝 03-questions.md</a>
      <a href="04-review.md" class="btn" target="_blank">🛡️ 04-review.md (${reviewVerdict})</a>
      <a href="05-qa-report.md" class="btn" target="_blank">🧪 05-qa-report.md (${qaVerdict})</a>
      ${zipSize ? `<a href="../../exports/${slug}.zip" class="btn btn-accent" download>📦 Download ZIP (${zipSize})</a>` : ''}
    </div>

    <!-- 8-Step Pipeline Progress -->
    <div class="card">
      <div class="card-title">
        <span>Pipeline Progress</span>
        <span style="font-family: var(--font-mono); color: var(--accent);">${progressPct}% (${doneSteps}/${totalSteps})</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Notes &amp; Agent Activities</th>
          </tr>
        </thead>
        <tbody>
          ${parsed.steps.map(s => `
            <tr>
              <td class="step-tag">${s.step}</td>
              <td><span class="step-status ${s.state}">${s.state}</span></td>
              <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);">${s.updated || '—'}</td>
              <td style="color: var(--text-muted);">${s.note || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- QA Mobile Screenshots -->
    ${screenshots.length > 0 ? `
      <div class="card">
        <div class="card-title">
          <span>Mobile Phone QA Captures (${screenshots.length})</span>
          <span style="font-size: 11px; color: var(--text-dim);">360 × 740 Viewport</span>
        </div>
        <div class="screenshots-grid">
          ${screenshots.slice(0, 8).map(shot => `
            <a href="${shot.relPath}" class="shot-card" target="_blank">
              <img src="${shot.relPath}" class="shot-img" alt="${shot.name}" loading="lazy">
              <div class="shot-name">${shot.name}</div>
            </a>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Human Feedback Log -->
    ${parsed.sections['Human feedback log'] && parsed.sections['Human feedback log'].length > 0 ? `
      <div class="card">
        <div class="card-title">Human Feedback &amp; Iteration Log</div>
        <ul style="padding-left: 20px; font-size: 13px; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px;">
          ${parsed.sections['Human feedback log'].map(item => `<li>${item.replace(/^- /, '')}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  </div>
</body>
</html>`;

  const outPath = path.join(topicDir, 'status.html');
  fs.writeFileSync(outPath, html, 'utf8');
  return { slug, state, progressPct, outPath, zipSize, hasHtml };
}

function renderStudioIndexHtml(topicResults) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyPipe Studio — Global Topics Dashboard</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card: #111827;
      --border: rgba(255, 255, 255, 0.08);
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
      --primary: #6366f1;
      --accent: #06b6d4;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-main);
      padding: 32px 20px;
      line-height: 1.5;
    }
    .container {
      max-width: 1080px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    h1 { font-size: 22px; font-weight: 700; color: #fff; }
    p.sub { font-size: 13px; color: var(--text-dim); }
    .table-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 12px 16px;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--text-dim);
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .slug-link {
      font-weight: 700;
      color: #fff;
      text-decoration: none;
      font-family: var(--font-mono);
      font-size: 13px;
    }
    .slug-link:hover { color: var(--accent); }
    .badge {
      font-size: 10px;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge.done { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .badge.awaiting-review { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .badge.in-progress { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }
    .badge.needs-human { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .btn-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 12px;
    }
    .btn-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>StudyPipe Studio — Topics Control Deck</h1>
        <p class="sub">Offline 3D Phenomenon-Based Learning Pipeline</p>
      </div>
      <div>
        <span style="font-family: var(--font-mono); font-size: 12px; color: var(--accent);">${topicResults.length} Units Tracked</span>
      </div>
    </header>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>Topic Slug</th>
            <th>Pipeline State</th>
            <th>Progress</th>
            <th>Outputs &amp; Status Page</th>
          </tr>
        </thead>
        <tbody>
          ${topicResults.map(t => `
            <tr>
              <td>
                <a href="topics/${t.slug}/status.html" class="slug-link">${t.slug}</a>
              </td>
              <td>
                <span class="badge ${t.state.toLowerCase()}">${t.state}</span>
              </td>
              <td>
                <span style="font-family: var(--font-mono); font-weight: 700; color: ${t.progressPct === 100 ? 'var(--success)' : 'var(--text-muted)'};">
                  ${t.progressPct}%
                </span>
              </td>
              <td>
                <a href="topics/${t.slug}/status.html" class="btn-link">📊 Status HUD</a>
                ${t.hasHtml ? ` · <a href="topics/${t.slug}/html/index.html" class="btn-link" target="_blank">📱 Preview</a>` : ''}
                ${t.zipSize ? ` · <a href="exports/${t.slug}.zip" class="btn-link">📦 Zip (${t.zipSize})</a>` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT, 'status.html'), html, 'utf8');
}

// Main execution
const target = process.argv[2];
const topicsDir = path.join(ROOT, 'topics');

if (!target || target === '--all') {
  const dirs = fs.readdirSync(topicsDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(topicsDir, d)).isDirectory());
  const results = [];
  for (const d of dirs) {
    const res = renderTopicStatusHtml(path.join(topicsDir, d));
    if (res) results.push(res);
  }
  renderStudioIndexHtml(results);
  console.log(`✓ Rendered status.html for ${results.length} topics + root status.html`);
} else {
  const topicPath = path.resolve(process.cwd(), target);
  const res = renderTopicStatusHtml(topicPath);
  if (res) {
    console.log(`✓ Rendered ${res.outPath}`);
  } else {
    console.error(`Error: Could not render status for ${target}`);
  }
}

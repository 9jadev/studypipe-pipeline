#!/usr/bin/env node
// Renders a plan back into a readable direction script (markdown) so reviewers can confirm the plan
// matches what they approved. Usage: node scripts/plan-to-script.cjs <plan.cjs> [--out script.md]
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), file = path.resolve(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out') || '');
const plan = require(file), m = plan.meta || {};
const plain = tex => (tex || '').replace(/\\htmlClass\{[^}]*\}\{/g, '{').replace(/\\(text|textit|mathrm)\{([^}]*)\}/g, '$2')
  .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/\\tfrac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2')
  .replace(/\\left|\\right|\\[,;! ]|\\quad|\\qquad/g, ' ').replace(/\\pm/g, '±').replace(/\\times/g, '×').replace(/\\sqrt/g, '√')
  .replace(/\\implies/g, '⇒').replace(/\\checkmark/g, '✓').replace(/\\Omega/g, 'Ω').replace(/\\approx/g, '≈').replace(/\\ge/g, '≥')
  .replace(/\\to/g, '→').replace(/\\square/g, '☐').replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
const panelText = o => {
  if (o.panel === null) return 'panel off';
  const s = o.s || {}, keys = Object.entries(s).filter(([k]) => k !== 'spec').map(([k, v]) => `${k}=${Array.isArray(v) ? v.join('+') : v}`);
  return `${o.panel}${s.spec ? ` [${s.spec.id}]` : ''}${keys.length ? ': ' + keys.join(', ') : ''}`;
};
let out = `# Direction Script: ${m.title}\n\n${m.subtitle || ''}\n\n| Item | Decision |\n| --- | --- |\n| Level | ${m.subject || ''} ${m.level || ''} |\n| Theme | ${m.theme || 'safari'} |\n`;
if (m.roles) out += `\n**Colour roles:** ${Object.entries(m.roles).map(([k, v]) => `${k} = ${v.name || ''} (${v.color})`).join(' · ')}\n`;
let words = 0;
plan.chapters.forEach((ch, ci) => {
  out += `\n## Chapter ${ci + 1}: ${ch.title}\n\n| # | Narration | On screen |\n| --- | --- | --- |\n`;
  ch.cues.forEach((c, k) => {
    words += c.say.split(/\s+/).length;
    const scr = (c.ops || []).map(o => 'clear' in o ? `New board: "${o.clear}"` : o.write ? `Board: ${plain(o.tex)}${o.note ? ` (note: ${o.note})` : ''}` : o.box ? `Box ${o.box}` : o.hl ? `Highlight ${o.hl.join(', ')}` : 'panel' in o ? `Kit ${panelText(o)}` : '').filter(Boolean);
    if (c.hold) scr.push(`Pause-and-try countdown ${c.hold} s`);
    out += `| ${ci + 1}.${k + 1} | ${c.say.replace(/\|/g, '/')} | ${scr.join('<br>').replace(/\|/g, '/') || '—'} |\n`;
  });
});
out += `\n## Checks\n\n${(plan.checks || []).map(c => Array.isArray(c) ? `- ${c[0]}: expected ${c[2]}` : `- ${c.name}`).join('\n')}\n\nAbout ${Math.round(words / 2.4 / 60)} minutes of narration (${words} words).\n`;
const dest = args.includes('--out') ? args[args.indexOf('--out') + 1] : file.replace(/\.plan\.c?js$/, '') + '-direction-script.md';
fs.writeFileSync(dest, out); console.log('Wrote ' + dest);

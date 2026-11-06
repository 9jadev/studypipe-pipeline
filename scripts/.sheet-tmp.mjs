import { chromium } from "playwright"; import path from "node:path"; import { pathToFileURL } from "node:url"; import fs from "node:fs";
const out = process.argv[2]; const shots = process.argv[3].split(",");
const themes = ["editorial-ink","exam-classic","green-lab","junior-play"];
const html = `<body style="margin:0;background:#888;display:grid;grid-template-columns:repeat(${shots.length},1fr);gap:6px;padding:6px">` + themes.map(t=>shots.map(s=>`<img style="width:100%" src="${pathToFileURL(path.resolve("themes",t,"preview",s+".png")).href}">`).join("")).join("") + "</body>";
fs.writeFileSync(out+".html", html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 180*shots.length+40, height: 400 } });
await p.goto(pathToFileURL(out+".html").href); await p.waitForTimeout(500); await p.screenshot({ path: out, fullPage: true }); await b.close();

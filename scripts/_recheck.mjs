import { chromium } from "playwright";
const base="file:///Users/mac/Desktop/StudyContent/studypipe-studio/topics/ss2-bio-heart-circulation/html/";
const out="/private/tmp/claude-501/-Users-mac-Desktop-StudyContent-studypipe-studio-topics-ss2-bio-heart-circulation/ee47506a-97f5-43a9-8dec-eb811768e76f/scratchpad/v2/";
const b = await chromium.launch({ args: ["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const hide = () => { for (const el of document.querySelectorAll("body *")) { const s = getComputedStyle(el).position; if ((s === "fixed" || s === "sticky") && !el.closest(".stage-frame,.stage")) el.style.visibility = "hidden"; } };
async function shot(p, sel, name){ const el=await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1800); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await el.screenshot({path: out+name+".png"}); }
const plan = {
 welcome: ["index.html", [["#lab","default",null],["#lab","sprint","#btn-water"],["#lab","walls","#btn-salt"]]],
 l01: ["lessons/lesson-01/index.html", [["#story-stage","story",null],["#zoom-stage","zoom-both",null],["#zoom-stage","zoom-toad","#zoom-add"],["#zoom-stage","zoom-fish","#zoom-stage [data-mode='acid']"]]],
 l02: ["lessons/lesson-02/index.html", [["#story-stage","story",null],["#bench-stage","bench-lv","#bench-trials [data-trial='4']"],["#zoom-stage","zoom-tri","#zoom-add"],["#zoom-stage","zoom-sys","#zoom-stage [data-mode='base']"]]],
 l03: ["lessons/lesson-03/index.html", [["#story-stage","story",null],["#bench-stage","bench",null],["#zoom-stage","zoom-atrial","#zoom-stage [data-mode='acid']"]]],
 l04: ["lessons/lesson-04/index.html", [["#story-stage","story",null],["#zoom-stage","zoom-filaria","#zoom-add"],["#zoom-stage","zoom-vessels","#zoom-stage [data-mode='acid']"]]],
 l05: ["lessons/lesson-05/index.html", [["#bench-stage","bench-clot","#bench-cond [data-cond='heavy']"],["#zoom-stage","zoom-both",null],["#zoom-stage","zoom-specimen","#zoom-stage [data-mode='base']"]]],
};
for (const [n,[f,steps]] of Object.entries(plan)){
  const p=await ctx.newPage(); let errs=[];
  p.on("pageerror",e=>errs.push(e.message)); p.on("console",m=>{if(m.type()==="error")errs.push(m.text())});
  await p.goto(base+f); await p.waitForTimeout(900); await p.evaluate(hide);
  for (const [sel,name,click] of steps){ if(click){ const c=await p.$(click); await c.scrollIntoViewIfNeeded(); await c.click(); } await shot(p,sel,n+"-"+name); }
  // click every control afterwards
  for (const s of ["#btn-water","#btn-salt","#btn-outside","#btn-reset","#bench-cond [data-cond]","#bench-trials [data-trial]","#bench-reset","#zoom-stage .seg [data-mode]","#zoom-add","#zoom-reset"]) for (const el of await p.$$(s)) { await el.scrollIntoViewIfNeeded(); await el.click(); await p.waitForTimeout(150); }
  await p.waitForTimeout(500);
  console.log(n, "errors:", errs.length, errs.slice(0,3).join(" | "));
  await p.close();
}
await b.close();

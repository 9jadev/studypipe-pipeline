/* =========================================================
   StudyPipe · Notation — show physics symbols the way textbooks write them.
   Turns plain-text shorthand such as "I_g", "R_eq", "V_AJ" into real subscripts
   (I<sub>g</sub>, R<sub>eq</sub>, V<sub>AJ</sub>) everywhere text appears on the page,
   including text that scripts write later (readouts, feedback, toasts, captions).
   Also exposes Notation.speak(text) so the narrator reads "I g", not "I underscore g".
   ========================================================= */
(function () {
  "use strict";
  var RE = /([A-Za-zηρΔ])_(\{([^}]+)\}|[A-Za-z0-9]+)/g;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, NOSCRIPT: 1, CANVAS: 1 };
  var SPOKEN = { eq: "equivalent", g: "g", m: "m", s: "s", x: "x", tot: "total" };

  function skipped(node) {
    for (var p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP[p.nodeName] || p.isContentEditable) return true;
    }
    return false;
  }

  function fixText(node) {
    var text = node.nodeValue;
    if (!text || text.indexOf("_") < 0) return;
    RE.lastIndex = 0;
    if (!RE.test(text) || skipped(node)) return;
    RE.lastIndex = 0;
    var frag = document.createDocumentFragment(), last = 0, m;
    while ((m = RE.exec(text))) {
      frag.appendChild(document.createTextNode(text.slice(last, m.index) + m[1]));
      // inside SVG (graph labels) an HTML <sub> doesn't render: use a shifted <tspan>
      var inSvg = node.parentNode && node.parentNode.namespaceURI === "http://www.w3.org/2000/svg";
      var sub = inSvg ? document.createElementNS("http://www.w3.org/2000/svg", "tspan") : document.createElement("sub");
      if (inSvg) { sub.setAttribute("baseline-shift", "sub"); sub.setAttribute("font-size", "75%"); }
      sub.textContent = m[3] || m[2];
      frag.appendChild(sub);
      last = m.index + m[0].length;
    }
    frag.appendChild(document.createTextNode(text.slice(last)));
    if (node.parentNode) node.parentNode.replaceChild(frag, node);
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { fixText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [], n;
    while ((n = tw.nextNode())) if (n.nodeValue.indexOf("_") >= 0) list.push(n);
    list.forEach(fixText);
  }

  function start() {
    walk(document.body);
    new MutationObserver(function (muts) {
      muts.forEach(function (mu) {
        if (mu.type === "characterData") fixText(mu.target);
        else for (var i = 0; i < mu.addedNodes.length; i++) walk(mu.addedNodes[i]);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.Notation = {
    html: function (s) { return String(s).replace(RE, function (a, b, c, d) { return b + "<sub>" + (d || c) + "</sub>"; }); },
    speak: function (s) {
      return String(s).replace(RE, function (a, b, c, d) { var k = d || c; return b + " " + (SPOKEN[k] || (/^[a-z]{3,}$/.test(k) ? k : k.split("").join(" "))) + " "; });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

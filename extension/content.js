(() => {
  // detect global export that bundlers usually create
  const blinder =
    window.colorBlind || window.colorblind || window.blinder || null;
  if (!blinder) {
    console.warn(
      "color-blind library not found on window (expected window.colorBlind or window.blinder).",
    );
    return;
  }

  // Supported CSS properties to modify
  const PROPS = [
    "color",
    "background-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "outline-color",
  ];

  // Parse simple rgb/rgba and hex (#rrggbb/#rgb). (HSL omitted for brevity; can add if needed.)
  function parseColor(str) {
    if (!str) return null;
    str = str.trim().toLowerCase();
    // hex
    let m = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
    if (m) {
      let hex = "#" + m[1];
      if (hex.length === 4)
        hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      return { hex, alpha: 1 };
    }
    // rgb(a)
    m = str.match(
      /^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/,
    );
    if (m) {
      const r = Math.round(Number(m[1])),
        g = Math.round(Number(m[2])),
        b = Math.round(Number(m[3]));
      const a = m[4] !== undefined ? Number(m[4]) : 1;
      const hex = rgbToHex(r, g, b);
      return { hex, alpha: a };
    }
    return null;
  }

  function rgbToHex(r, g, b) {
    const toHex = (n) => {
      const s = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return s.length === 1 ? "0" + s : s;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }

  function hexToCssWithAlpha(hex, alpha) {
    if (!/^#/.test(hex)) hex = "#" + hex;
    if (alpha === undefined || alpha === 1) return hex;
    // convert to rgba
    const num = parseInt(hex.slice(1), 16);
    const r = (num >> 16) & 255,
      g = (num >> 8) & 255,
      b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Try common call patterns for the blinder function (hex with # or without)
  function callBlinder(fnName, hex) {
    const fn = blinder[fnName] || blinder[fnName.toLowerCase()];
    if (typeof fn !== "function") return null;
    try {
      // try hex with '#'
      let out = fn(hex);
      if (out) return out;
    } catch (e) {}
    try {
      // try hex without '#'
      let out2 = fn(hex.replace("#", ""));
      if (out2) return out2;
    } catch (e) {}
    return null;
  }

  // Replace color on single element property
  function transformProp(el, prop, fnName) {
    const cs = getComputedStyle(el);
    const val = cs.getPropertyValue(prop);
    const parsed = parseColor(val);
    if (!parsed) return;
    if (parsed.alpha === 0) return;
    const mapped = callBlinder(fnName, parsed.hex);
    if (!mapped) return;
    el.style[prop.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] =
      hexToCssWithAlpha(mapped, parsed.alpha);
  }

  function applyTypeToDocument(typeName) {
    if (!typeName || typeName === "none") return;
    // walk limited set for performance
    const nodes = document.querySelectorAll("*");
    let count = 0;
    for (const el of nodes) {
      if (++count > 3000) break; // safety limit
      // skip tags we don't want to touch
      const tag = el.tagName && el.tagName.toLowerCase();
      if (["script", "style", "noscript", "iframe"].includes(tag)) continue;
      for (const p of PROPS) transformProp(el, p, typeName);
      // SVG attributes: fill/stroke
      if (el instanceof SVGElement) {
        if (el.hasAttribute("fill")) {
          const px = parseColor(el.getAttribute("fill"));
          if (px && px.alpha !== 0) {
            const m = callBlinder(typeName, px.hex);
            if (m) el.setAttribute("fill", hexToCssWithAlpha(m, px.alpha));
          }
        }
        if (el.hasAttribute("stroke")) {
          const px = parseColor(el.getAttribute("stroke"));
          if (px && px.alpha !== 0) {
            const m = callBlinder(typeName, px.hex);
            if (m) el.setAttribute("stroke", hexToCssWithAlpha(m, px.alpha));
          }
        }
      }
    }
  }

  // Init: get stored preference and apply
  chrome.storage &&
    chrome.storage.sync &&
    chrome.storage.sync.get({ cbType: "none" }, (items) => {
      const t = items.cbType || "none";
      if (t !== "none") applyTypeToDocument(t);
    });

  // Listen for runtime messages from popup to reapply immediately
  chrome.runtime &&
    chrome.runtime.onMessage &&
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg && msg.action === "applyType") {
        if (msg.type && msg.type !== "none") applyTypeToDocument(msg.type);
        sendResponse({ ok: true });
      }
    });
})();

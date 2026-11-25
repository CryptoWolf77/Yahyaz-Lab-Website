// Nebula · shared foundation: environment flags, language, copy and text helpers.
import { studio, worlds, apps, games, ui, initialLanguage, rememberLanguage } from "./content.js";

window.__nebulaBooted = true;

export const root = document.documentElement;
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const pad2 = (n) => String(n).padStart(2, "0");

export const env = {
  reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
  saveData: navigator.connection?.saveData === true,
  // ?nowebgl previews the designed fallback without disabling the GPU
  forceFallback: new URLSearchParams(location.search).has("nowebgl"),
  finePointer: matchMedia("(hover: hover) and (pointer: fine)").matches,
  stageMQ: matchMedia("(min-width: 1024px) and (min-aspect-ratio: 6/5) and (min-height: 620px)"),
  smallDevice: Math.min(screen.width, screen.height) < 768 || matchMedia("(pointer: coarse)").matches,
  lowPower: (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4,
};

// Routes of the site (production paths, no trailing slash, as published).
export const ROUTES = {
  home: "/",
  apps: "/apps",
  games: "/games",
  reel: "/games#reel",
  about: "/#about",
  contact: "/#contact",
  privacy: {
    "white-ninja": "/privacy/white-ninja",
    "puzzle-vs-zombie": "/privacy/puzzle-vs-zombie",
  },
};
// Links shared from the previous site keep working: /#games and /#showreel moved to the
// Games page, #studio became #about, and the games list/showreel ids were renamed.
export const pagePath = (p = location.pathname) => p.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
(function mapLegacyAnchors() {
  const path = pagePath();
  const hash = location.hash;
  if (path === "/" && (hash === "#games" || hash === "#showreel")) {
    location.replace(`/games${location.search}${hash === "#showreel" ? "#reel" : ""}`);
    return;
  }
  const alias = { "/": { "#studio": "#about" }, "/games": { "#showreel": "#reel", "#games": "#stations" } }[path]?.[hash];
  if (alias) {
    history.replaceState(history.state, "", `${location.pathname}${location.search}${alias}`);
    requestAnimationFrame(() => document.getElementById(alias.slice(1))?.scrollIntoView({ block: "start" }));
  }
})();
export const privacyRoute = (href) => ROUTES.privacy[href.split("/").filter(Boolean).pop()] || href;

// ------------------------------------------------------------------
// Interface copy (UI only, no product claims)
// ------------------------------------------------------------------
export const COPY = {
  title: { en: "YahyazLab | Apps & Games by an Independent Developer", ar: "YahyazLab | تطبيقات وألعاب من مطوّر مستقل" },
  description: {
    en: "I build useful applications and engaging games at YahyazLab. Explore ApexLoad, QuranHaven, White Ninja, Puzzle VS Zombie and Ball Crusher.",
    ar: "أبني تطبيقات مفيدة وألعابًا ممتعة في YahyazLab. استكشف ApexLoad وQuranHaven وWhite Ninja وPuzzle VS Zombie وBall Crusher.",
  },
  appsPageTitle: { en: "Apps I Build | YahyazLab", ar: "تطبيقات أبنيها | YahyazLab" },
  appsPageDescription: {
    en: "Explore ApexLoad and QuranHaven: thoughtfully built applications for everyday use, independently developed at YahyazLab.",
    ar: "استكشف ApexLoad وQuranHaven: تطبيقات مدروسة للاستخدام اليومي، طُوّرت باستقلالية في YahyazLab.",
  },
  gamesPageTitle: { en: "Games I Build | YahyazLab", ar: "ألعاب أبنيها | YahyazLab" },
  gamesPageDescription: {
    en: "Explore White Ninja, Puzzle VS Zombie and Ball Crusher, game projects by YahyazLab.",
    ar: "استكشف White Ninja وPuzzle VS Zombie وBall Crusher، مشاريع ألعاب من YahyazLab.",
  },
  appsH1: { en: "Apps I Build", ar: "تطبيقات أبنيها" },
  gamesH1: { en: "Games I Build", ar: "ألعاب أبنيها" },
  appsSignal: { en: "Signal 01 · Apps", ar: "الإشارة 01 · التطبيقات" },
  gamesSignal: { en: "Signal 02 · Games", ar: "الإشارة 02 · الألعاب" },
  stationsIndex: { en: "Stations on this flight", ar: "محطات هذه الرحلة" },
  diveCue: { en: "Scroll to dive in", ar: "مرّر لتبدأ الغوص" },
  nextTransmission: { en: "Next transmission", ar: "البث التالي" },
  appsCross: { en: "From everyday tools to interactive worlds", ar: "من أدوات الحياة اليومية إلى عوالم تفاعلية" },
  gamesCross: { en: "There's another side to the lab", ar: "للمختبر جانب آخر" },
  loader: { en: "Acquiring signal", ar: "جارٍ التقاط الإشارة" },
  homeLabel: { en: "YahyazLab, back to the start", ar: "YahyazLab، العودة إلى البداية" },
  primaryNav: { en: "Primary", ar: "التنقل الرئيسي" },
  navHome: { en: "Home", ar: "الرئيسية" },
  langSwitch: { en: "عربي", ar: "EN" },
  langSwitchLong: { en: "العربية", ar: "English" },
  langAria: { en: "Language: switch to Arabic", ar: "اللغة: التبديل إلى الإنجليزية" },
  openMenu: { en: "Open menu", ar: "فتح القائمة" },
  menuLabel: { en: "Menu", ar: "القائمة" },
  menuTitle: { en: "Flight plan", ar: "خطة الرحلة" },
  timelineLabel: { en: "Mission timeline", ar: "خط الرحلة" },
  chLab: { en: "Lab", ar: "المختبر" },
  reel: { en: "Reel", ar: "العرض" },
  hudDepth: { en: "Depth", ar: "العمق" },
  hudParticles: { en: "Particles", ar: "الجسيمات" },
  heroSignal: { en: "Signal 00 · The lab", ar: "الإشارة 00 · المختبر" },
  scrollCue: { en: "Scroll to begin the flight", ar: "مرّر لتبدأ الرحلة" },
  worldsKicker: { en: "Chapter 00 · Two worlds", ar: "الفصل 00 · عالمان" },
  appsKicker: { en: "Chapter 01 · Apps", ar: "الفصل 01 · التطبيقات" },
  gamesKicker: { en: "Chapter 02 · Games", ar: "الفصل 02 · الألعاب" },
  reelKicker: { en: "Transmission 03 · Reel", ar: "البث 03 · العرض" },
  aboutKicker: { en: "Log 04 · About", ar: "السجل 04 · عني" },
  contactKicker: { en: "Channel 05 · Open channel", ar: "القناة 05 · قناة مفتوحة" },
  reelBody: { en: "A short signal from the lab: the YahyazLab mark, in motion.", ar: "إشارة قصيرة من المختبر: شعار YahyazLab في حركة." },
  playReel: { en: "Play reel", ar: "تشغيل العرض" },
  pauseReel: { en: "Pause reel", ar: "إيقاف العرض" },
  soundOn: { en: "Sound on", ar: "تشغيل الصوت" },
  soundOff: { en: "Sound off", ar: "كتم الصوت" },
  writeTo: { en: "Write to", ar: "راسلني على" },
  emailLabel: { en: "Email", ar: "البريد" },
  privacy: { en: "Privacy", ar: "الخصوصية" },
  explore: { en: "Explore", ar: "استكشف" },
  signal: { en: "Signal", ar: "الإشارة" },
  openShot: { en: "Open screenshot {n} of {t}", ar: "فتح لقطة الشاشة {n} من {t}" },
  moreShots: { en: "Open all {t} screenshots", ar: "فتح كل لقطات الشاشة ({t})" },
  screenshotN: { en: "Screenshot {n}", ar: "لقطة {n}" },
  availableOn: { en: "Available on", ar: "متوفر على" },
  details: { en: "Details", ar: "التفاصيل" },
  dossier: { en: "Dossier", ar: "ملف اللعبة" },
  features: { en: "Features", ar: "المزايا" },
  trailer: { en: "Trailer", ar: "العرض التشويقي" },
  trailerMeta: { en: "{s} MB · loads on play", ar: "{s} ميغابايت · يُحمّل عند التشغيل" },
  privacyPolicy: { en: "Privacy policy", ar: "سياسة الخصوصية" },
};

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
export const R = { studio, worlds, ui, c: COPY, apps: byId(apps), games: byId(games) };

// ------------------------------------------------------------------
// Language state
// ------------------------------------------------------------------
export const L = { lang: "en", fixed: false };
export const dirSign = () => (L.lang === "ar" ? -1 : 1);
export const tr = (v) => (v && typeof v === "object" && "en" in v ? v[L.lang] : v);
export const fmt = (v, vars) => tr(v).replace(/\{(\w+)\}/g, (_, k) => vars[k]);

export function resolve(path) {
  let node = R;
  for (const key of path.split(".")) {
    if (node && typeof node === "object" && "en" in node && "ar" in node && key !== "en" && key !== "ar") node = node[L.lang];
    node = node?.[key];
  }
  return tr(node) ?? "";
}

// Latin runs inside Arabic text are isolated with <bdi>.
const LATIN = /[A-Za-z][A-Za-z0-9]*(?:[ .&'’-]+[A-Za-z0-9]+)*/g;
export function fillText(el, text) {
  el.textContent = "";
  if (L.lang !== "ar") {
    el.textContent = text;
    return;
  }
  let last = 0;
  for (const m of text.matchAll(LATIN)) {
    if (m.index > last) el.append(text.slice(last, m.index));
    const b = document.createElement("bdi");
    b.textContent = m[0];
    el.append(b);
    last = m.index + m[0].length;
  }
  if (last < text.length) el.append(text.slice(last));
}

// Word split for line reveals. Arabic stays whole per word (shaping preserved);
// Latin runs inside Arabic stay one token so their order never flips.
export function splitText(el, text) {
  el.textContent = "";
  const tokens = [];
  const pushWords = (s) => s.split(/\s+/).filter(Boolean).forEach((t) => tokens.push({ t, latin: false }));
  if (L.lang === "ar") {
    let last = 0;
    for (const m of text.matchAll(LATIN)) {
      pushWords(text.slice(last, m.index));
      tokens.push({ t: m[0], latin: true });
      last = m.index + m[0].length;
    }
    pushWords(text.slice(last));
  } else pushWords(text);
  tokens.forEach((tok, i) => {
    const s = document.createElement("span");
    s.className = "w";
    if (tok.latin) {
      const b = document.createElement("bdi");
      b.textContent = tok.t;
      s.append(b);
    } else s.textContent = tok.t;
    el.append(s);
    if (i < tokens.length - 1) el.append(" ");
  });
  requestAnimationFrame(() => lineDelays(el));
}
export function lineDelays(el) {
  const words = $$(".w", el);
  let line = -1;
  let lastTop = null;
  let inLine = 0;
  const base = parseFloat(el.dataset.delay || "0");
  for (const w of words) {
    const top = w.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) > 4) {
      line++;
      inLine = 0;
      lastTop = top;
    }
    w.style.setProperty("--d", `${(base + line * 0.13 + inLine * 0.025).toFixed(3)}s`);
    inLine++;
  }
}

const binders = [];
export const bind = (el, fn) => binders.push({ el, fn });
export const bindAttr = (el, attr, fn) => binders.push({ el, attr, fn });
const langHooks = [];
/** Run fn on every language change (and once at init). */
export const onLang = (fn) => langHooks.push(fn);

function runBinders() {
  for (const b of binders) {
    if (!b.el.isConnected && !b.keep) continue;
    const v = b.fn();
    if (b.attr) b.el.setAttribute(b.attr, v);
    else if (b.el.hasAttribute("data-split")) splitText(b.el, v);
    else fillText(b.el, v);
  }
}

// tiny element helper
export function h(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k === "html") el.innerHTML = v;
    else if (k === "style") el.setAttribute("style", v);
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of [].concat(children)) if (c !== null && c !== undefined) el.append(c);
  return el;
}

let pageMeta = { title: COPY.title, description: COPY.description };

/** Bind every [data-t] / [data-t-aria] currently in the document. */
export function bindStatic(scope = document) {
  for (const el of $$("[data-t]", scope)) bind(el, () => resolve(el.dataset.t));
  for (const el of $$("[data-t-aria]", scope)) bindAttr(el, "aria-label", () => resolve(el.dataset.tAria));
}

export function applyLang(next, initial = false) {
  L.lang = L.fixed ? "en" : next;
  if (!initial && !L.fixed) rememberLanguage(L.lang);
  root.lang = L.lang;
  root.dir = L.lang === "ar" ? "rtl" : "ltr";
  if (pageMeta.title) document.title = tr(pageMeta.title);
  if (pageMeta.description) $('meta[name="description"]')?.setAttribute("content", tr(pageMeta.description));
  const url = new URL(location.href);
  if (!L.fixed && url.searchParams.has("lang") && url.searchParams.get("lang") !== L.lang) {
    url.searchParams.set("lang", L.lang);
    history.replaceState(history.state, "", url);
  }
  runBinders();
  for (const el of $$(".lang-label")) el.setAttribute("lang", L.lang === "en" ? "ar" : "en");
  for (const fn of langHooks) fn(initial);
}

/**
 * Start language handling for a page.
 * fixed: true keeps the page English/LTR and never touches the stored preference.
 */
export function initLang({ title, description, fixed = false } = {}) {
  pageMeta = { title, description };
  L.fixed = fixed;
  L.lang = fixed ? "en" : initialLanguage();
  // a ?lang= deep link becomes the preference, so it carries to the next page
  if (!fixed && new URLSearchParams(location.search).has("lang")) rememberLanguage(L.lang);
  for (const b of $$("[data-lang-toggle]")) {
    bindAttr(b, "aria-label", () => tr(COPY.langAria));
    b.addEventListener("click", () => applyLang(L.lang === "en" ? "ar" : "en"));
  }
}

export { studio, worlds, apps, games, ui };

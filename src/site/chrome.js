// Nebula · shared chrome: header, mobile menu, footer, dialogs,
// mission timeline, progress line and HUD. Every page mounts the same parts.
import { $, $$, h, root, clamp01, ROUTES, tr, bind } from "./core.js";
import { privacyLinks, studio } from "./content.js";

const LOGO = studio.logo;

const NAV = [
  { key: "home", code: "00", href: ROUTES.home, t: "c.navHome" },
  { key: "apps", code: "01", href: ROUTES.apps, t: "ui.nav.apps" },
  { key: "games", code: "02", href: ROUTES.games, t: "ui.nav.games" },
  { key: "reel", code: "03", href: ROUTES.reel, t: "c.reel" },
  { key: "about", code: "04", href: ROUTES.about, t: "ui.nav.about" },
  { key: "contact", code: "05", href: ROUTES.contact, t: "ui.nav.contact" },
];

// Items that live on the current page use plain fragments, so they never reload it.
const LOCAL = {
  home: { home: "#top", about: "#about", contact: "#contact" },
  apps: { apps: "#top" },
  games: { games: "#top", reel: "#reel" },
};
const hrefFor = (item, page) => LOCAL[page]?.[item.key] ?? item.href;

function navLink(item, page, cls = "") {
  const label = h("span", { "data-t": item.t });
  const a = h("a", { href: hrefFor(item, page), class: cls }, [h("span", { class: cls ? "mono" : "nav-code", text: item.code }), label]);
  if (item.key === page) a.setAttribute("aria-current", "page");
  return a;
}

function header(page, { langToggle = true } = {}) {
  const nav = h("nav", { class: "nav", "data-t-aria": "c.primaryNav", "aria-label": "Primary" }, h("ul", {}, NAV.map((n) => h("li", {}, navLink(n, page)))));
  const tools = h("div", { class: "masthead-tools" }, [
    langToggle ? h("button", { class: "lang-toggle", type: "button", "data-lang-toggle": "" }, h("span", { class: "lang-label", "data-t": "c.langSwitch" }, "عربي")) : null,
    h("button", { class: "menu-btn", type: "button", "aria-haspopup": "dialog", "aria-controls": "menu", "data-t-aria": "c.openMenu", "aria-label": "Open menu" }, h("span", { class: "menu-lines", "aria-hidden": "true" }, [h("span"), h("span")])),
  ]);
  return h("header", { class: "masthead", id: "masthead" }, [
    h("a", { class: "brand", href: page === "home" ? "#top" : ROUTES.home, "data-t-aria": "c.homeLabel", "aria-label": "YahyazLab, back to the start" }, h("img", { src: LOGO.src, width: LOGO.width, height: LOGO.height, alt: "" })),
    nav,
    tools,
  ]);
}

function closeBtn() {
  return h("button", { class: "icon-btn", type: "button", "data-close": "", "data-t-aria": "ui.close", "aria-label": "Close" }, h("span", { class: "x", "aria-hidden": "true" }));
}

function menu(page, { langToggle = true } = {}) {
  return h("dialog", { class: "dlg menu", id: "menu", "data-t-aria": "c.menuLabel", "aria-label": "Menu" }, h("div", { class: "menu-shell" }, [
    h("header", { class: "dlg-bar" }, [h("p", { class: "mono", "data-t": "c.menuTitle" }, "Flight plan"), closeBtn()]),
    h("nav", { "data-t-aria": "c.primaryNav", "aria-label": "Primary" }, h("ol", { class: "menu-list" }, NAV.map((n) => h("li", {}, navLink(n, page, "menu-link"))))),
    h("div", { class: "menu-foot" }, [
      langToggle ? h("button", { class: "btn", type: "button", "data-lang-toggle": "" }, h("span", { "data-t": "c.langSwitchLong" }, "العربية")) : null,
      h("a", { class: "footer-link", href: `mailto:${studio.email}`, dir: "ltr", text: studio.email }),
    ]),
  ]));
}

function footer(page) {
  const privacy = h("ul", { class: "footer-list", id: "privacy-links" }, privacyLinks.map((p) => {
    const a = h("a", { href: ROUTES.privacy[p.href.split("/").pop()] });
    bind(a, () => tr(p.label));
    return h("li", {}, a);
  }));
  return h("footer", { class: "footer" }, [
    h("div", { class: "grid footer-grid" }, [
      h("a", { class: "footer-brand", href: page === "home" ? "#top" : ROUTES.home, "data-t-aria": "c.homeLabel", "aria-label": "YahyazLab, back to the start" }, h("img", { src: LOGO.src, width: LOGO.width, height: LOGO.height, alt: "YahyazLab", loading: "lazy" })),
      h("div", { class: "footer-col" }, [h("p", { class: "mono footer-label", "data-t": "c.emailLabel" }, "Email"), h("a", { class: "footer-link", href: `mailto:${studio.email}`, dir: "ltr", text: studio.email })]),
      h("div", { class: "footer-col" }, [h("p", { class: "mono footer-label", "data-t": "c.privacy" }, "Privacy"), privacy]),
      h("div", { class: "footer-col footer-end" }, h("a", { class: "btn btn-ghost back-top", href: "#top" }, [h("span", { "data-t": "ui.backToTop" }, "Back to top"), h("span", { class: "up-glyph", "aria-hidden": "true" })])),
    ]),
    h("p", { class: "footer-legal mono" }, [
      h("span", {}, ["© YahyazLab · ", h("span", { "data-t": "ui.since" }, "Since"), " 2021"]),
    ]),
  ]);
}

function dialogs() {
  return [
    h("dialog", { class: "dlg lightbox", id: "lightbox", "aria-labelledby": "lb-title" }, h("div", { class: "dlg-shell" }, [
      h("header", { class: "dlg-bar" }, [h("p", { class: "mono", id: "lb-title" }, "Screenshots"), h("p", { class: "mono dlg-count", id: "lb-count", dir: "ltr", "aria-live": "polite" }), closeBtn()]),
      h("figure", { class: "lb-figure" }, [h("img", { id: "lb-img", alt: "" }), h("figcaption", { id: "lb-cap", class: "mono" })]),
      h("div", { class: "lb-nav" }, [
        h("button", { class: "icon-btn lb-prev", type: "button", "data-t-aria": "ui.previous", "aria-label": "Previous" }, h("span", { class: "chev", "aria-hidden": "true" })),
        h("button", { class: "icon-btn lb-next", type: "button", "data-t-aria": "ui.next", "aria-label": "Next" }, h("span", { class: "chev", "aria-hidden": "true" })),
      ]),
    ])),
    h("dialog", { class: "dlg trailer", id: "trailer", "aria-labelledby": "tr-title" }, h("div", { class: "dlg-shell" }, [
      h("header", { class: "dlg-bar" }, [h("p", { class: "mono", id: "tr-title" }, "Trailer"), h("p", { class: "mono dlg-count", id: "tr-size", dir: "ltr" }), closeBtn()]),
      h("div", { class: "trailer-frame" }, h("video", { id: "trailer-video", controls: true, playsinline: true, preload: "none" })),
    ])),
    h("dialog", { class: "dlg details", id: "details", "aria-labelledby": "dt-title" }, h("div", { class: "dlg-shell" }, [
      h("header", { class: "dlg-bar" }, [h("p", { class: "mono", id: "dt-kicker" }, "Dossier"), closeBtn()]),
      h("div", { class: "details-body", id: "details-body" }),
    ])),
  ];
}

function timeline(chapters) {
  return h("nav", { class: "timeline", "data-t-aria": "c.timelineLabel", "aria-label": "Mission timeline" }, [
    h("span", { class: "timeline-rail", "aria-hidden": "true" }, [h("span", { class: "timeline-fill" }), h("span", { class: "timeline-dot" })]),
    h("ol", {}, chapters.map((c) => {
      const name = h("span", { class: "tl-name" });
      if (c.t) name.setAttribute("data-t", c.t);
      else name.textContent = c.label;
      return h("li", { "data-chapter": c.id }, h("a", { href: `#${c.id}` }, [h("span", { class: "tl-code", text: c.code }), name]));
    })),
  ]);
}

function hud() {
  return h("div", { class: "hud", "aria-hidden": "true" }, [
    h("span", { class: "hud-row" }, [h("span", { "data-t": "c.hudDepth" }, "Depth"), " ", h("b", { id: "hud-depth", dir: "ltr", text: "0000" })]),
    h("span", { class: "hud-row" }, [h("span", { "data-t": "c.hudParticles" }, "Particles"), " ", h("b", { id: "hud-count", dir: "ltr", text: "—" })]),
  ]);
}

/**
 * Mount the shared chrome.
 * page: "home" | "apps" | "games" | "privacy"
 */
export function mountChrome({ page, chapters = null, hudOn = true, loader = true, withDialogs = true, langToggle = true, skipLabel = null } = {}) {
  const body = document.body;
  const first = body.firstChild;
  const skip = h("a", { class: "skip", href: "#main" }, skipLabel ? skipLabel : [h("span", { "data-t": "ui.skip" }, "Skip to content")]);
  const top = [skip, header(page, { langToggle })];
  if (loader) top.push(h("div", { class: "loader", "aria-hidden": "true" }, [h("span", { class: "loader-label", "data-t": "c.loader" }, "Acquiring signal"), h("span", { class: "loader-line" }, h("span"))]));
  if (chapters) top.push(timeline(chapters), h("div", { class: "progress", "aria-hidden": "true" }, h("span")));
  if (hudOn) top.push(hud());
  for (const el of top) body.insertBefore(el, first);
  const main = $("main");
  main.after(footer(page));
  const tail = [menu(page, { langToggle })];
  if (withDialogs) tail.push(...dialogs());
  body.append(...tail);
}

// ------------------------------------------------------------------
// Scroll-linked chrome: header state, progress line, timeline, hero exit
// ------------------------------------------------------------------
let chapterTops = [];
let maxScroll = 1;
let vh = innerHeight;
let lastActive = -1;

export function measureChrome() {
  vh = innerHeight;
  const foot = $(".footer");
  if (foot) root.style.setProperty("--footer-h", `${foot.offsetHeight}px`);
  maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
  const items = $$(".timeline li[data-chapter]");
  chapterTops = items.map((li) => {
    const el = document.getElementById(li.dataset.chapter);
    return el ? Math.min(el.getBoundingClientRect().top + scrollY, maxScroll) : 0;
  });
  // ticks are evenly spaced; the marker maps scroll piecewise between them
  items.forEach((li, i) => li.style.setProperty("--at", (i / Math.max(1, items.length - 1)).toFixed(4)));
  lastActive = -1;
  updateChrome();
}

function timelinePos(y) {
  const n = chapterTops.length;
  if (!n) return 0;
  for (let i = 0; i < n - 1; i++) {
    const a = chapterTops[i];
    const b = chapterTops[i + 1];
    if (y < b) return (i + clamp01((y - a) / Math.max(1, b - a))) / (n - 1);
  }
  return 1;
}

export function updateChrome() {
  const y = scrollY;
  const tl = $(".timeline");
  if (tl) tl.style.setProperty("--tp", timelinePos(y).toFixed(4));
  $(".progress")?.style.setProperty("--tp", clamp01(y / maxScroll).toFixed(4));
  root.classList.toggle("scrolled", y > 40);
  const hero = $(".hero");
  if (hero) hero.style.setProperty("--exit", clamp01(y / (Math.max(hero.offsetHeight - vh, 1) * 0.75)).toFixed(3));
  if (chapterTops.length) {
    let active = 0;
    for (let i = 0; i < chapterTops.length; i++) if (y + vh * 0.45 >= chapterTops[i]) active = i;
    if (active !== lastActive) {
      lastActive = active;
      $$(".timeline li").forEach((li, i) => li.classList.toggle("active", i === active));
    }
  }
}

let ticking = false;
addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateChrome();
    });
  },
  { passive: true },
);

// YahyazLab · Nebula — privacy policy pages.
// Reading-first: quiet static starfield (no WebGL), English/LTR, sticky contents.
// The stored language preference is never touched here.
import { $, $$, root, env, initLang, applyLang, bindStatic, L } from "./core.js";
import { mountChrome, measureChrome } from "./chrome.js";
import { initDialogs } from "./ui.js";
import { drawSky } from "./sky.js";

mountChrome({ page: "privacy", hudOn: false, loader: false, withDialogs: false, langToggle: false, skipLabel: document.body.dataset.skip });
initLang({ fixed: true });
bindStatic();
initDialogs();
applyLang(L.lang, true);

root.classList.add("fallback", "reading");
drawSky();

// ---- contents: open + sticky on desktop, collapsible on small screens ----
const toc = $("#p-toc");
const wide = matchMedia("(min-width: 1024px)");
const syncToc = () => {
  if (wide.matches) toc.open = true;
  else toc.open = false;
};
syncToc();
wide.addEventListener("change", syncToc);
$(".p-toc-summary").addEventListener("click", (e) => {
  if (wide.matches) e.preventDefault();
});

const links = $$(".p-toc-list a");
for (const a of links) {
  a.addEventListener("click", () => {
    if (!wide.matches) toc.open = false;
    const target = document.getElementById(a.hash.slice(1));
    const heading = target?.querySelector("h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  });
}

// ---- active section ----
const sections = $$(".psec");
const rail = $(".p-toc-list");
let current = null;
function setActive(id) {
  if (id === current) return;
  current = id;
  links.forEach((a, i) => {
    const on = a.hash === `#${id}`;
    if (on) {
      a.setAttribute("aria-current", "true");
      rail.style.setProperty("--tp", (i / Math.max(1, links.length - 1)).toFixed(4));
    } else a.removeAttribute("aria-current");
  });
}
// The section being read is the last one whose heading has crossed a reading
// line ~40% down the viewport (at the very end, the last section).
let ticking = false;
function readingSection() {
  ticking = false;
  const line = innerHeight * 0.42;
  let id = sections[0]?.id;
  for (const s of sections) {
    const head = s.querySelector("h2") || s;
    if (head.getBoundingClientRect().top <= line) id = s.id;
    else break;
  }
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) id = sections[sections.length - 1]?.id;
  setActive(id);
}
addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(readingSection);
    }
  },
  { passive: true },
);
readingSection();

measureChrome();
let t = 0;
addEventListener("resize", () => {
  clearTimeout(t);
  t = setTimeout(() => {
    drawSky();
    measureChrome();
  }, 140);
});
if (env.reduced) root.style.scrollBehavior = "auto";

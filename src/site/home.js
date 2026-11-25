// YahyazLab · Nebula — home page entry.
// Shared chrome, language, dialogs and the flight engine live in sibling modules.
import { $, $$, h, bind, tr, smooth, root, initLang, applyLang, bindStatic, L, COPY, studio, apps, games } from "./core.js";
import { mountChrome } from "./chrome.js";
import { initDialogs, initReel, initReveals, initMagnetic, revealSequence, countUp } from "./ui.js";
import { renderApp, renderGame, renderManifest } from "./stations.js";
import { createFlight } from "./flight.js";

// ---- content ----
renderManifest(apps, $("#apps-manifest"));
renderManifest(games, $("#games-manifest"));
apps.forEach((a) => $("#apps-stations").append(renderApp(a)));
games.forEach((g) => $("#games-stations").append(renderGame(g)));
for (const m of studio.metrics) {
  const dt = h("dt");
  bind(dt, () => tr(m.label));
  $("#metrics").append(h("div", { class: "metric" }, [dt, h("dd", { "data-value": m.value, dir: "ltr" }, m.value)]));
}

// ---- chrome + language ----
mountChrome({
  page: "home",
  chapters: [
    { id: "top", code: "00", t: "c.chLab" },
    { id: "apps", code: "01", t: "ui.nav.apps" },
    { id: "games", code: "02", t: "ui.nav.games" },
    { id: "reel", code: "03", t: "c.reel" },
    { id: "about", code: "04", t: "ui.nav.about" },
    { id: "contact", code: "05", t: "ui.nav.contact" },
  ],
});
initLang({ title: COPY.title, description: COPY.description });
bindStatic();
initDialogs();
initReel();
initMagnetic();
initReveals("#top");
applyLang(L.lang, true);

new IntersectionObserver(
  (entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      $$("dd", e.target).forEach((dd, i) => setTimeout(() => countUp(dd), i * 160));
      obs.disconnect();
    }
  },
  { threshold: 0.5 },
).observe($("#metrics"));

let heroShown = false;
function revealHero(fast = false) {
  if (heroShown) return;
  heroShown = true;
  revealSequence(["#top .telemetry", "#top [data-split]", "#top .lede", "#top .cta-row", "#top .since", "#top .hero-foot"].map((s) => $(s)), fast);
}

// ---- flight ----
const heroLogo = $("#hero-logo");
const contactLogo = $("#contact-logo");
const planetA = $("#planet-a");
const planetB = $("#planet-b");
const worldsSection = $("#worlds");
const contactSection = $("#contact");

createFlight({
  seq: [0, 1, 2, 3, 4, 2, 5],
  stationIds: ["apexload", "quranhaven", "white-ninja", "puzzle-vs-zombie", "ball-crusher"],
  intro: { duration: 2.3, reveal: revealHero },
  buildKeys(K, { top, vh, stage, d, maxScroll, stationKeys }) {
    const hero = $("#top");
    const worldsEl = $("#worlds");
    const heroPin = Math.max(hero.offsetHeight - vh, vh * 0.3);
    K(heroPin * 0.1, { m: 1 });
    K(heroPin * 0.95, { m: 2, camZ: 14.5, camY: 1.4, parallax: 0.42 });

    const wt = top(worldsEl);
    const wl = Math.max(worldsEl.offsetHeight - vh, vh * 0.5);
    K(wt + wl * 0.12, { m: 2, camZ: 14.5, camY: 1.4, tilt: 0.78 });
    K(wt + wl * 0.5, { camZ: 12, camY: 0, parallax: 0.3 });
    K(wt + wl * 0.55, { m: 3 });
    K(wt + wl + vh * 0.2, { m: 3 });

    const at = top($("#apps .chapter-head"));
    K(at - vh * 0.55, { camZ: 12, roll: 0 });
    K(at + vh * 0.15, { m: 4, parallax: 0.5 });
    const { arrives, leaves, zEnd } = stationKeys(at - vh * 0.55);

    // every stop has its own field: cyan, QuranHaven green, lilac, magenta, gold
    K(arrives[1] - vh * 0.55, { green: 0 });
    K(arrives[1], { green: 1 });
    K(leaves[1], { green: 1 });
    K(leaves[1] + vh * 0.45, { green: 0 });
    const gt = top($("#games .chapter-head"));
    K(gt - vh * 0.7, { hue: 0 });
    K(gt + vh * 0.25, { hue: 0.62 });
    K(leaves[2], { hue: 0.62 });
    K(arrives[3], { hue: 1 });
    K(leaves[3], { hue: 1 });
    K(arrives[4], { hue: 2 });

    const st0 = arrives[0];
    K(st0 + vh * 0.1, { anchorZ: 0 });
    K(st0 + vh * 0.5, { anchorZ: zEnd - 12 });

    const rt = top($("#reel"));
    const soft = stage ? 1 : 0.6;
    // reel: the galaxy is seen edge-on, a luminous band under the projected reel
    K(rt - vh * 0.8, { m: 4, galaxyX: 0, galaxyY: 0, galaxyR: 6.6, tilt: 0.78, hue: 2, dim: 1, groll: -0.32 });
    K(rt + vh * 0.05, { m: 5, camZ: zEnd, galaxyX: d * 0.22, galaxyY: -0.22, galaxyR: 8.2, tilt: 0.12, roll: 0, dim: 0.62 * soft, groll: d * 0.24 });
    K(rt + vh * 0.4, { hue: 0.4 });

    // about: the camera rises while the disc turns face-on behind "Since 2021"
    const ab = top($("#about"));
    K(ab - vh * 0.45, { tilt: 0.12, galaxyX: d * 0.22, galaxyY: -0.22, galaxyR: 8.2, camY: 0, lookY: 0, dim: 0.62 * soft, groll: d * 0.24 });
    K(ab + vh * 0.3, { tilt: 1.3, galaxyX: d * 0.54, galaxyY: -0.26, galaxyR: stage ? 4.5 : 3.4, camY: 0.8, hue: 0, dim: 0.78 * soft, groll: -0.32 });

    // the logo is fully re-assembled when its anchor sits mid-screen (or at the very end)
    const ct = top($("#contact"));
    const mark = $(".contact-mark");
    const markMid = top(mark) + mark.offsetHeight / 2 - vh * (stage ? 0.5 : 0.42);
    const cEnd = Math.max(ct - vh * 0.2, Math.min(markMid, maxScroll - 2));
    K(Math.min(ct - vh * 0.6, cEnd - 10), { m: 5, camY: 0.8, parallax: 0.42 });
    K(cEnd, { m: 6, camY: 0, galaxyY: 0, parallax: 0.16, dim: 1 });
  },
  anchors(state, m, introDone) {
    const near = (a, b) => m >= a && m <= b;
    state.logoA = near(1, 2.2) || !introDone ? heroLogo.getBoundingClientRect() : null;
    state.logoB = near(4.8, 6) ? contactLogo.getBoundingClientRect() : null;
    if (near(1.8, 4.2)) {
      state.planetA = planetA.getBoundingClientRect();
      state.planetB = planetB.getBoundingClientRect();
    }
  },
  afterFrame({ m, y }) {
    root.style.setProperty("--logo-a", (1 - smooth(innerHeight * 0.02, innerHeight * 0.16, y)).toFixed(3));
    contactSection.style.setProperty("--clogo", smooth(5.8, 5.99, m).toFixed(3));
    worldsSection.classList.toggle("formed", m > 2.72);
  },
});

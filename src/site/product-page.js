// YahyazLab · Nebula — Apps and Games pages (one entry, configured by <body data-page>).
// Each opens on its own particle world, dives into the ring tunnel for the
// stations and closes on the other world as a cross-link.
import { $, initLang, applyLang, bindStatic, L, COPY, apps, games } from "./core.js";
import { mountChrome } from "./chrome.js";
import { initDialogs, initReel, initReveals, initMagnetic, revealSequence } from "./ui.js";
import { renderApp, renderGame, renderIndex, setStationCount } from "./stations.js";
import { createFlight } from "./flight.js";

const page = document.body.dataset.page === "games" ? "games" : "apps";
const isApps = page === "apps";
const list = isApps ? apps : games;

// ---- content ----
setStationCount(list.map((p) => p.id));
renderIndex(list, $("#page-index"));
const holder = $("#station-list");
list.forEach((p) => holder.append(isApps ? renderApp(p) : renderGame(p)));

// ---- chrome + language ----
mountChrome({
  page,
  chapters: [
    { id: "top", code: "00", t: isApps ? "ui.nav.apps" : "ui.nav.games" },
    ...list.map((p, i) => ({ id: p.id, code: String(i + 1).padStart(2, "0"), label: p.name || p.title })),
    ...(isApps ? [] : [{ id: "reel", code: "04", t: "c.reel" }]),
    { id: "next", code: "→", t: isApps ? "ui.nav.games" : "ui.nav.apps" },
  ],
});
initLang(isApps ? { title: COPY.appsPageTitle, description: COPY.appsPageDescription } : { title: COPY.gamesPageTitle, description: COPY.gamesPageDescription });
bindStatic();
initDialogs();
if (!isApps) initReel();
initMagnetic();
initReveals("#top");
applyLang(L.lang, true);

let heroShown = false;
function revealHero(fast = false) {
  if (heroShown) return;
  heroShown = true;
  revealSequence(["#top .telemetry", "#top [data-split]", "#top .sub-title", "#top .lede", "#top .station-index", "#top .hero-foot"].map((s) => $(s)), fast);
}

// ---- flight ----
const heroPlanet = $("#planet-hero");
const endPlanet = $("#planet-end");
// solo: 1 = every particle forms the cyan Apps world, -1 = the pink/gold Games world
const START = isApps ? 1 : -1;

createFlight({
  // apps: void → apps world → tunnel → games world
  // games: void → games world → tunnel → galaxy (reel) → apps world
  seq: isApps ? [0, 3, 4, 3] : [0, 3, 4, 2, 3],
  stationIds: list.map((p) => p.id),
  intro: { duration: 1.9, reveal: revealHero },
  buildKeys(K, { top, vh, stage, d, maxScroll, stationKeys }) {
    const hero = $("#top");
    const heroPin = Math.max(hero.offsetHeight - vh, vh * 0.3);
    K(0, { m: 1, solo: START, hue: isApps ? 0 : 1, parallax: 0.3 });
    K(heroPin * 0.2, { m: 1, camZ: 12 });
    K(heroPin + vh * 0.1, { m: 2, parallax: 0.5 });
    const { arrives, leaves, zs, zEnd } = stationKeys(heroPin * 0.25);
    const n = arrives.length;

    // swap worlds and move the anchor plane while the particles are tunnel
    K(arrives[0] + vh * 0.1, { anchorZ: 0, solo: START });
    K(arrives[0] + vh * 0.5, { anchorZ: zEnd - 12, solo: -START });

    if (isApps) {
      // QuranHaven keeps its own calm green field
      K(arrives[1] - vh * 0.55, { green: 0 });
      K(arrives[1], { green: 1 });
      K(leaves[1], { green: 1 });
      K(leaves[1] + vh * 0.45, { green: 0, hue: 0 });
    } else {
      K(arrives[0] - vh * 0.3, { hue: 0.62 });
      K(leaves[0], { hue: 0.62 });
      K(arrives[1], { hue: 1 });
      K(leaves[1], { hue: 1 });
      K(arrives[2], { hue: 2 });

      // reel: the galaxy edge-on under the projected reel
      const rt = top($("#reel"));
      const soft = stage ? 1 : 0.6;
      K(rt - vh * 0.8, { m: 2, galaxyX: 0, galaxyY: 0, galaxyR: 6.6, tilt: 0.78, hue: 2, dim: 1, groll: -0.32 });
      K(rt + vh * 0.05, { m: 3, camZ: zEnd, galaxyX: d * 0.22, galaxyY: -0.22, galaxyR: 8.2, tilt: 0.12, roll: 0, dim: 0.62 * soft, groll: d * 0.24 });
      K(rt + vh * 0.4, { hue: 0.4 });
    }

    // the other world forms beside the cross-link
    const et = top($("#next"));
    const markMid = top(endPlanet) + endPlanet.offsetHeight / 2 - vh * (stage ? 0.5 : 0.45);
    const cEnd = Math.max(et - vh * 0.25, Math.min(markMid, maxScroll - 2));
    const endM = isApps ? 3 : 4;
    K(Math.min(et - vh * 0.7, cEnd - 10), { m: endM - 1, dim: isApps ? 1 : 0.62 * (stage ? 1 : 0.6) });
    K(cEnd, { m: endM, camZ: zEnd, parallax: 0.3, dim: 1, hue: isApps ? 1 : 0 });
    if (isApps) K(leaves[n - 1], { camZ: zs[n - 1] - 0.7 });
  },
  anchors(state, m) {
    const heroRect = m < 2 ? heroPlanet.getBoundingClientRect() : null;
    const endRect = m > 2 ? endPlanet.getBoundingClientRect() : null;
    // solo +1 reads uPlanetA, -1 reads uPlanetB
    if (isApps) {
      if (heroRect) state.planetA = heroRect;
      if (endRect) state.planetB = endRect;
    } else {
      if (heroRect) state.planetB = heroRect;
      if (endRect) state.planetA = endRect;
    }
  },
  staticState: () => ({ galaxyX: 0.3, gain: 0.55 }),
});

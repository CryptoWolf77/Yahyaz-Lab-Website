// Nebula · flight engine. Boots the WebGL scene (or the designed fallback),
// turns scroll position into damped camera/morph keyframes and renders.
// Pages provide their own keyframes, morph sequence and DOM anchors.
import { $, $$, root, env, smooth, dirSign, onLang, lineDelays, studio } from "./core.js";
import { measureChrome } from "./chrome.js";
import { dialogState, openLightbox } from "./ui.js";
import { STATION_Z, stationDefs } from "./stations.js";
import { drawSky } from "./sky.js";

const PROPS = ["m", "camX", "camY", "camZ", "lookX", "lookY", "anchorZ", "hue", "tilt", "galaxyR", "galaxyX", "galaxyY", "roll", "parallax", "dim", "groll", "green", "solo"];
const BASE = { m: 1, camX: 0, camY: 0, camZ: 12, lookX: 0, lookY: 0, anchorZ: 0, hue: 0, tilt: 0.78, galaxyR: 6.6, galaxyX: 0, galaxyY: 0, roll: 0, parallax: 0.14, dim: 1, groll: -0.32, green: 0, solo: 0 };
const INTERACTIVE = "a, button, input, textarea, select, video, dialog, summary, .panel, .frame, .thumb";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Camera stops for a list of station elements; returns arrive/leave scroll points. */
function stationKeys(K, ctx, stations, startY) {
  const { top, vh, stage } = ctx;
  const zs = stations.map((_, i) => STATION_Z(i));
  let prevEnd = startY;
  const arrives = [];
  const leaves = [];
  stations.forEach((s, i) => {
    const st = top(s);
    const hold = Math.max(s.offsetHeight - vh, 0);
    const arrive = stage ? st : st - vh * 0.25;
    const leave = stage ? st + hold : Math.max(arrive + vh * 0.2, st + s.offsetHeight - vh * 0.8);
    K((prevEnd + arrive) / 2, { roll: (i % 2 ? -1 : 1) * 0.045 });
    K(arrive, { camZ: zs[i], roll: 0 });
    K(leave, { camZ: zs[i] - 0.7, roll: 0 });
    arrives.push(arrive);
    leaves.push(leave);
    prevEnd = leave;
  });
  return { arrives, leaves, zs, zEnd: zs[zs.length - 1] - 18 };
}

function evalTrack(t, y) {
  if (!t.length) return 0;
  if (y <= t[0][0]) return t[0][1];
  const last = t[t.length - 1];
  if (y >= last[0]) return last[1];
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i];
    const b = t[i + 1];
    if (y >= a[0] && y <= b[0]) {
      const k = b[0] === a[0] ? 1 : (y - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * k * k * (3 - 2 * k);
    }
  }
  return last[1];
}

/**
 * cfg:
 *  seq         target id for each integer m (0 void, 1 logo, 2 galaxy, 3 planets, 4 tunnel, 5 end logo)
 *  stationIds  station ids in flight order
 *  buildKeys   (K, ctx) => void, page keyframes; ctx.stationKeys(startY) adds the camera stops
 *  anchors     (state, m, introDone) => void, read DOM rects into state (logoA/B, planetA/B)
 *  afterFrame  ({ m, y, S, introDone }) => void, page DOM writes
 *  intro       { duration, reveal(fast) }
 *  staticState (d) => state for the reduced-motion still frame
 */
export function createFlight(cfg) {
  const canvas = $("#scene");
  const hudDepth = $("#hud-depth");
  const hudCount = $("#hud-count");
  const S = Object.fromEntries(PROPS.map((p) => [p, 0]));
  const state = { from: 0, to: 1, mix: 0, turb: 1.7, gain: 0, planes: false, flowBoost: 0, mouseX: 0, mouseY: 0, logoA: null, logoB: null, planetA: null, planetB: null };
  let tracks = {};
  let scene = null;
  let live = false;
  let staticMode = false;
  let vh = innerHeight;
  const INTRO = cfg.intro?.duration ?? 2.3;
  const reveal = cfg.intro?.reveal ?? (() => {});
  let introStart = null;
  let introT = 0;
  let introSpeed = 1;
  let introDone = false;

  function measure() {
    vh = innerHeight;
    measureChrome();
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const top = (el) => el.getBoundingClientRect().top + scrollY;
    const d = dirSign();
    const stage = env.stageMQ.matches;
    tracks = Object.fromEntries(PROPS.map((p) => [p, []]));
    // a later keyframe at the same scroll position replaces an earlier one
    const K = (y, props) => {
      for (const [k, v] of Object.entries(props)) {
        const t = tracks[k];
        const at = t.findIndex((p) => p[0] === y);
        if (at >= 0) t[at] = [y, v];
        else t.push([y, v]);
      }
    };
    K(0, BASE);
    const stations = $$(".station");
    const ctx = { top, vh, stage, d, maxScroll, stations, stationKeys: (startY) => stationKeys(K, ctx, stations, startY) };
    cfg.buildKeys(K, ctx);
    for (const p of PROPS) tracks[p].sort((a, b) => a[0] - b[0]);

    // safe screen span for each station's floating screens: beside its panel,
    // clear of the mission-timeline gutter (inline-end edge)
    if (scene) {
      const W = innerWidth;
      const spans = {};
      for (const s of stations) {
        const panel = $(".panel", s);
        if (!panel) continue;
        const r = panel.getBoundingClientRect();
        const side = (s.classList.contains("flip") ? -1 : 1) * d;
        let lo = side > 0 ? r.right + 40 : 40;
        let hi = side > 0 ? W - 40 : r.left - 40;
        if (d > 0) hi = Math.min(hi, W - 165);
        else lo = Math.max(lo, 165);
        spans[s.id] = [lo, hi];
      }
      scene.setSafe(spans);
    }
  }

  function enterFallback() {
    live = false;
    staticMode = true;
    root.classList.remove("live", "planes", "booting");
    root.classList.add("static", "fallback", "logo-on");
    try {
      scene?.dispose();
    } catch {
      /* ignore */
    }
    scene = null;
    drawSky();
    reveal(true);
  }

  function renderStatic() {
    if (!scene) return;
    const d = dirSign();
    const base = {
      from: 2, to: 3, mix: 0, turb: 0, gain: 0.62, hue: 0, groll: -0.32, tilt: 1.02, galaxyR: 6.4, galaxyX: d * 0.34, galaxyY: -0.05, solo: 0, green: 0,
      anchorZ: 0, camX: 0, camY: 0, camZ: 12, lookX: 0, lookY: 0, roll: 0, parallax: 0, mouseX: 0, mouseY: 0,
      planes: false, flowBoost: 0, logoA: null, logoB: null, planetA: null, planetB: null,
    };
    scene.frame({ ...base, ...(cfg.staticState?.(d) || {}) }, 18, 0);
  }

  function setPlanesMode() {
    state.planes = live && env.stageMQ.matches;
    root.classList.toggle("planes", state.planes);
  }

  function skipIntro() {
    if (introDone || introStart === null) return;
    introSpeed = 5;
    reveal(true);
  }
  for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"]) addEventListener(ev, skipIntro, { passive: true });

  // pointer + picking of floating screens
  let mx = 0;
  let my = 0;
  let mxs = 0;
  let mys = 0;
  let pointerX = -1;
  let pointerY = -1;
  let lastPick = 0;
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = -((e.clientY / innerHeight) * 2 - 1);
      pointerX = e.clientX;
      pointerY = e.clientY;
    },
    { passive: true },
  );
  document.addEventListener("click", (e) => {
    if (!scene || !state.planes || e.target.closest(INTERACTIVE)) return;
    const hit = scene.pick(e.clientX, e.clientY);
    if (hit) openLightbox(hit.gallery, hit.index, null);
  });

  let smoothY = scrollY;
  let last = performance.now();
  const dbg = (window.__nebula = { frames: 0, dt: 0, state });
  let lastDepth = "";
  const clock0 = performance.now();
  const seq = cfg.seq;
  const maxM = seq.length - 1;

  function loop(now) {
    requestAnimationFrame(loop);
    if (!live || !scene) return;
    if (document.hidden || dialogState.open > 0) {
      last = now;
      return;
    }
    const rawDt = (now - last) / 1000;
    if (rawDt < 0.0155) return; // ~60 fps cap
    last = now;
    const dt = Math.min(rawDt, 0.1);
    const time = (now - clock0) / 1000;
    const y = scrollY;
    dbg.frames++;
    dbg.dt = rawDt;

    // intro clock runs on wall time so slow GPUs still finish on schedule
    if (!introDone && introStart !== null) {
      introT += Math.min(rawDt, 0.5) * introSpeed;
      if (introT >= INTRO) {
        introT = INTRO;
        introDone = true;
      }
      if (introT > INTRO * 0.8) root.classList.add("logo-on");
      if (introT > INTRO * 0.3) root.classList.remove("booting");
    }

    smoothY += (y - smoothY) * (1 - Math.exp(-Math.min(rawDt, 1) * 3.6));
    if (Math.abs(y - smoothY) < 0.5) smoothY = y;
    for (const p of PROPS) S[p] = evalTrack(tracks[p], smoothY);

    const m = Math.min(maxM, Math.max(1, S.m));
    const i = Math.min(Math.floor(m), maxM - 1);
    state.from = seq[i];
    state.to = seq[i + 1];
    state.mix = m - i;
    if (!introDone) {
      const p = introT / INTRO;
      state.from = 0;
      state.to = seq[Math.round(m)];
      state.mix = p;
      state.gain = smooth(0, 0.3, p);
    } else state.gain = 1;
    state.gain *= S.dim || 1;
    state.turb = state.from === 4 || state.to === 4 ? 2.4 : state.from === 0 ? 2.2 : 1.7;

    Object.assign(state, S);
    mxs += (mx - mxs) * (1 - Math.exp(-dt * 2.4));
    mys += (my - mys) * (1 - Math.exp(-dt * 2.4));
    state.mouseX = env.finePointer ? mxs : 0;
    state.mouseY = env.finePointer ? mys : 0;

    cfg.anchors?.(state, m, introDone);
    scene.frame(state, time, dt);
    cfg.afterFrame?.({ m, y, S, introDone });

    if (hudDepth) {
      const depth = String(Math.round(Math.max(0, 12 - S.camZ) * 10)).padStart(4, "0");
      if (depth !== lastDepth) {
        hudDepth.textContent = depth;
        lastDepth = depth;
      }
    }

    // hover affordance for floating screens
    if (state.planes && env.finePointer && pointerX >= 0 && now - lastPick > 120) {
      lastPick = now;
      const el = document.elementFromPoint(pointerX, pointerY);
      const hit = el && !el.closest(INTERACTIVE) ? scene.pick(pointerX, pointerY) : null;
      document.body.style.cursor = hit ? "zoom-in" : "";
    }
  }

  async function boot() {
    if (env.saveData || env.forceFallback || !hasWebGL()) {
      enterFallback();
      return;
    }
    if (env.reduced) {
      staticMode = true;
      root.classList.add("static", "logo-on");
      reveal(true);
    } else {
      live = true;
      root.classList.add("live", "booting");
      // never leave the hero empty if the GPU is slow to start
      setTimeout(() => {
        if (!scene && live) {
          root.classList.add("logo-on");
          reveal();
        }
      }, 2200);
    }
    try {
      const { createNebula } = await import("./scene.js");
      scene = await createNebula({ canvas, logoSrc: studio.logo.src, mobile: env.smallDevice, lowPower: env.lowPower, onLost: () => enterFallback() });
    } catch {
      enterFallback();
      return;
    }
    scene.setDir(dirSign());
    scene.setStations(stationDefs(cfg.stationIds));
    measure();
    if (hudCount) hudCount.textContent = scene.count.toLocaleString("en-US").replace(/,/g, " ");
    if (staticMode) {
      renderStatic();
      return;
    }
    setPlanesMode();
    introStart = performance.now();
    if (scrollY > vh * 0.3) {
      introSpeed = 50;
      reveal(true);
    } else {
      setTimeout(() => reveal(), INTRO * 370);
    }
    requestAnimationFrame(loop);
  }

  onLang((initial) => {
    if (initial) return;
    scene?.setDir(dirSign());
    requestAnimationFrame(() => {
      measure();
      if (staticMode && scene) renderStatic();
    });
  });

  let resizeTimer = 0;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      setPlanesMode();
      scene?.resize();
      if (staticMode && scene) renderStatic();
      if (root.classList.contains("fallback")) drawSky();
      $$("[data-split]").forEach(lineDelays);
    }, 140);
  });
  addEventListener("pagehide", () => {
    try {
      scene?.dispose();
    } catch {
      /* ignore */
    }
  });
  document.fonts?.ready.then(() => measure());
  addEventListener("load", () => measure());

  measure();
  boot();
  return { measure };
}

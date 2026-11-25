// Nebula · shared interaction layer: dialogs (menu, lightbox, trailer, details),
// galleries, the reel controller, reveals, counters and magnetic buttons.
import { $, $$, h, root, env, L, COPY, tr, fmt, fillText, onLang, pad2, privacyRoute, clamp01, pagePath } from "./core.js";
import { apps, games, ui, studio } from "./content.js";

// ------------------------------------------------------------------
// Galleries
// ------------------------------------------------------------------
export const galleries = {};
for (const a of apps) galleries[a.id] = { name: a.name, accent: a.accent, items: a.screenshots.map((s) => ({ ...s })) };
for (const g of games) {
  if (!g.screenshots) continue;
  galleries[g.id] = { name: g.title, accent: g.accent, items: g.screenshots.map((s, i) => ({ ...s, n: i + 1 })) };
}
export const itemLabel = (it) => (it.n ? fmt(COPY.screenshotN, { n: it.n }) : tr(it.label));

export const SIGNALS = ["apexload", "quranhaven", "white-ninja", "puzzle-vs-zombie", "ball-crusher"];
export const signalOf = (id) => pad2(SIGNALS.indexOf(id) + 1);

const ARROW_SVG =
  '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>';
export function extIcon() {
  return h("span", { class: "ext-ico", "aria-hidden": "true", html: ARROW_SVG });
}

// ------------------------------------------------------------------
// Dialogs
// ------------------------------------------------------------------
const focusables = (el) =>
  $$('a[href], button:not([disabled]), video[controls], summary, [tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null || x === document.activeElement);

export const dialogState = { open: 0 };
export function openDialog(dlg, opener) {
  dlg._opener = opener || document.activeElement;
  if (!dlg.open) {
    dialogState.open++;
    root.classList.add("locked");
    dlg.showModal();
  }
  const first = $("[data-close]", dlg) || focusables(dlg)[0];
  first?.focus({ preventScroll: true });
}

function wireDialog(dlg) {
  dlg.addEventListener("close", () => {
    dialogState.open = Math.max(0, dialogState.open - 1);
    if (!dialogState.open) root.classList.remove("locked");
    dlg.dispatchEvent(new Event("closed"));
    const o = dlg._opener;
    if (o && document.contains(o)) o.focus({ preventScroll: true });
  });
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  for (const c of $$("[data-close]", dlg)) c.addEventListener("click", () => dlg.close());
  dlg.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = focusables(dlg);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// Lightbox
const lb = { id: null, index: 0 };
function renderLightbox() {
  const g = galleries[lb.id];
  const lbEl = $("#lightbox");
  if (!g || !lbEl) return;
  const it = g.items[lb.index];
  const img = $("#lb-img");
  img.src = it.src;
  img.width = it.width;
  img.height = it.height;
  img.alt = `${g.name} — ${itemLabel(it)}`;
  lbEl.style.setProperty("--accent", g.accent);
  fillText($("#lb-title"), `${g.name} · ${tr(ui.screenshots)}`);
  $("#lb-count").textContent = `${pad2(lb.index + 1)} / ${pad2(g.items.length)}`;
  fillText($("#lb-cap"), itemLabel(it));
}
export function openLightbox(id, index, opener) {
  lb.id = id;
  lb.index = index;
  renderLightbox();
  openDialog($("#lightbox"), opener);
}
function stepLightbox(d) {
  const n = galleries[lb.id].items.length;
  lb.index = (lb.index + d + n) % n;
  renderLightbox();
}

// Trailer: the source is attached only after an explicit click.
const reels = new Set();
export function openTrailer(game, opener) {
  const el = $("#trailer");
  const video = $("#trailer-video");
  fillText($("#tr-title"), `${game.title} — ${tr(COPY.trailer)}`);
  $("#tr-size").textContent = `${game.trailer.sizeMB} MB`;
  video.poster = game.poster.src;
  video.setAttribute("aria-label", `${game.title} — ${tr(COPY.trailer)}`);
  video.src = game.trailer.src;
  el.style.setProperty("--accent", game.accent);
  openDialog(el, opener);
  video.play().catch(() => {});
  for (const r of reels) r.pause();
}

// Game details
let detailsGame = null;
function fillDetails(game) {
  const detailsEl = $("#details");
  const body = $("#details-body");
  body.replaceChildren();
  $("#dt-kicker").textContent = `${tr(COPY.dossier)} · ${signalOf(game.id)}`;
  const title = h("h2", { id: "dt-title" });
  fillText(title, game.title);
  const kicker = h("p", { class: "kicker" });
  fillText(kicker, tr(game.kicker));
  const long = h("p");
  fillText(long, tr(game.longDescription));
  const featTitle = h("h3");
  fillText(featTitle, tr(COPY.features));
  const list = h("ul", { class: "check-list" }, tr(game.features).map((f) => {
    const li = h("li");
    fillText(li, f);
    return li;
  }));
  const tags = h("ul", { class: "tags" }, tr(game.tags).map((t) => h("li", { text: t })));
  const trailerText = h("span");
  fillText(trailerText, tr(ui.playTrailer));
  const links = h("div", { class: "details-links" }, [
    h("button", { class: "btn btn-primary", type: "button", onclick: () => { detailsEl.close(); openTrailer(game, detailsEl._opener); } }, [
      h("span", { class: "play-glyph", "aria-hidden": "true" }),
      trailerText,
    ]),
    ...game.stores.map((s) =>
      h("a", { class: "btn store-btn ext", href: s.href, target: "_blank", rel: "noopener noreferrer", "aria-label": `${s.label}: ${game.title} (${tr(ui.opensNewTab)})` }, [
        h("span", {}, [h("span", { class: "store-k", text: tr(COPY.availableOn) }), h("span", { class: "store-n", text: s.label, dir: "ltr" })]),
        extIcon(),
      ]),
    ),
  ]);
  const priv = h("a", { class: "footer-link", href: privacyRoute(game.privacy) });
  fillText(priv, `${tr(COPY.privacyPolicy)} · ${game.title}`);
  body.append(
    h("div", {}, [kicker, title]),
    h("img", { class: "details-poster", src: game.poster.src, width: game.poster.width, height: game.poster.height, alt: game.title, loading: "lazy" }),
    long,
    tags,
    featTitle,
    list,
    links,
    priv,
  );
  detailsEl.style.setProperty("--accent", game.accent);
}
export function openDetails(game, opener) {
  detailsGame = game;
  fillDetails(game);
  openDialog($("#details"), opener);
}

/** Wire every dialog on the page (call once after the chrome is mounted). */
export function initDialogs() {
  for (const dlg of $$("dialog.dlg")) wireDialog(dlg);

  const lbEl = $("#lightbox");
  if (lbEl) {
    $(".lb-prev").addEventListener("click", () => stepLightbox(-1));
    $(".lb-next").addEventListener("click", () => stepLightbox(1));
    lbEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") stepLightbox(L.lang === "ar" ? -1 : 1);
      if (e.key === "ArrowLeft") stepLightbox(L.lang === "ar" ? 1 : -1);
    });
    let touchX = null;
    lbEl.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
    lbEl.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) stepLightbox((dx < 0 ? 1 : -1) * (L.lang === "ar" ? -1 : 1));
      touchX = null;
    });
  }
  const trailerEl = $("#trailer");
  if (trailerEl) {
    const video = $("#trailer-video");
    trailerEl.addEventListener("closed", () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) video.pause();
    });
  }
  $("#details")?.addEventListener("closed", () => (detailsGame = null));

  // Mobile menu: same-page anchors scroll after the dialog closes, other routes navigate.
  const menuEl = $("#menu");
  $(".menu-btn").addEventListener("click", (e) => openDialog(menuEl, e.currentTarget));
  for (const a of $$(".menu-list a", menuEl)) {
    a.addEventListener("click", (e) => {
      const url = new URL(a.href, location.href);
      const samePage = pagePath(url.pathname) === pagePath();
      menuEl._opener = null;
      if (!samePage) {
        menuEl.close();
        return;
      }
      e.preventDefault();
      menuEl.close();
      const id = url.hash.slice(1) || "top";
      requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: env.reduced ? "auto" : "smooth" });
        history.pushState(null, "", `#${id}`);
        const heading = $("h1, h2, h3", target);
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
      });
    });
  }

  onLang(() => {
    if (lb.id && lbEl?.open) renderLightbox();
    if (detailsGame) fillDetails(detailsGame);
  });
}

// ------------------------------------------------------------------
// Reel (muted autoplay while in view, paused offscreen)
// ------------------------------------------------------------------
export function initReel() {
  const video = $("#reel-video");
  if (!video) return null;
  const playBtn = $("#reel-play");
  const soundBtn = $("#reel-sound");
  let userPaused = env.reduced;
  let inView = false;
  const play = () => {
    if (!video.getAttribute("src")) video.src = studio.showreel.src;
    video.play().catch(() => {});
  };
  const pause = () => {
    if (!video.paused) video.pause();
  };
  const update = () => {
    const playing = !video.paused;
    playBtn.classList.toggle("is-playing", playing);
    playBtn.setAttribute("aria-pressed", String(playing));
    fillText($(".reel-play-label"), tr(playing ? COPY.pauseReel : COPY.playReel));
    soundBtn.setAttribute("aria-pressed", String(!video.muted));
    fillText($(".reel-sound-label"), tr(video.muted ? COPY.soundOn : COPY.soundOff));
  };
  video.addEventListener("play", update);
  video.addEventListener("pause", update);
  playBtn.addEventListener("click", () => {
    if (video.paused) {
      userPaused = false;
      play();
    } else {
      userPaused = true;
      pause();
    }
  });
  soundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    if (!video.muted && video.paused) {
      userPaused = false;
      play();
    }
    update();
  });
  new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting;
      // the REC/LOOP meta only shows once the frame is properly in view (never over the HUD)
      e.target.classList.toggle("in-view", inView);
      if (inView && !userPaused && !document.hidden) play();
      else pause();
    },
    { threshold: 0.35 },
  ).observe($(".reel-stage"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else if (inView && !userPaused) play();
  });
  const api = { pause };
  reels.add(api);
  onLang(update);
  return api;
}

// ------------------------------------------------------------------
// Reveals, counters, magnetic buttons
// ------------------------------------------------------------------
/** Reveal .rv / [data-split] as they enter; elements inside `except` are revealed by the page. */
export function initReveals(except = "#top") {
  const held = except ? $$(`${except} .rv, ${except} [data-split]`) : [];
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );
  for (const el of $$(".rv, [data-split]")) if (!held.includes(el)) io.observe(el);
}

/** Staggered reveal of a hero, used by the intro. */
export function revealSequence(els, fast = false) {
  els.forEach((el, i) => {
    if (!el) return;
    el.style.setProperty("--d", `${i * (fast ? 0.05 : 0.14)}s`);
    el.classList.add("in");
  });
}

export function countUp(dd) {
  const target = dd.dataset.value;
  const num = parseInt(target, 10);
  if (env.reduced) return;
  const t0 = performance.now();
  if (Number.isNaN(num)) {
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const step = (now) => {
      const p = clamp01((now - t0) / 900);
      const fixed = Math.floor(p * target.length);
      dd.textContent = target
        .split("")
        .map((ch, i) => (i < fixed ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join("");
      if (p < 1) requestAnimationFrame(step);
      else dd.textContent = target;
    };
    requestAnimationFrame(step);
    return;
  }
  const step = (now) => {
    const p = clamp01((now - t0) / 1300);
    const e = 1 - Math.pow(1 - p, 3);
    dd.textContent = String(Math.round(num * e)).padStart(target.length, "0");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initMagnetic() {
  if (!env.finePointer || env.reduced) return;
  document.addEventListener("pointermove", (e) => {
    const b = e.target.closest?.(".btn");
    if (!b || b.closest("dialog")) return;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    b.style.setProperty("--mx", `${(dx * 10).toFixed(1)}px`);
    b.style.setProperty("--my", `${(dy * 8).toFixed(1)}px`);
  });
  document.addEventListener("pointerout", (e) => {
    const b = e.target.closest?.(".btn");
    if (b && !b.contains(e.relatedTarget)) {
      b.style.setProperty("--mx", "0px");
      b.style.setProperty("--my", "0px");
    }
  });
}

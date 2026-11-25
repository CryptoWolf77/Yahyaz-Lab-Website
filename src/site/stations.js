// Nebula · product stations: transmission panels, DOM screen frames and the
// 3D layout of each stop. Shared by the home, Apps and Games pages.
import { h, bind, bindAttr, tr, fmt, COPY, R, pad2, onLang } from "./core.js";
import { ui } from "./content.js";
import { galleries, itemLabel, signalOf, extIcon, openLightbox, openTrailer, openDetails } from "./ui.js";

export const STATION_Z = (i) => -16 - 28 * i;

function extLink(href, cls, labelFn, children) {
  const a = h("a", { class: cls, href, target: "_blank", rel: "noopener noreferrer" }, [...[].concat(children), extIcon()]);
  bindAttr(a, "aria-label", () => `${labelFn()} (${tr(ui.opensNewTab)})`);
  return a;
}

function storeButton(store, productName) {
  const k = h("span", { class: "store-k" });
  bind(k, () => tr(COPY.availableOn));
  const n = h("span", { class: "store-n", text: store.label, dir: "ltr" });
  return extLink(store.href, "btn store-btn ext", () => `${store.label}: ${productName}`, [h("span", {}, [k, n])]);
}

// Signal numbers are site-wide (S·03 is always White Ninja); the counter on the
// right counts the stops of the page you are on.
const counter = { total: 5, ids: null };
export function setStationCount(ids) {
  counter.ids = ids;
  counter.total = ids.length;
}
function panelBar(id, name) {
  const left = h("span");
  bind(left, () => `${tr(COPY.signal)} ${signalOf(id)} · ${name.toUpperCase()}`);
  const n = counter.ids ? pad2(counter.ids.indexOf(id) + 1) : signalOf(id);
  return h("div", { class: "panel-bar mono" }, [left, h("span", { class: "dim", dir: "ltr", text: `${n} / ${pad2(counter.total)}` })]);
}

function thumbs(galleryId, max = 4) {
  const g = galleries[galleryId];
  const list = h("ul", { class: "thumbs" });
  const total = g.items.length;
  g.items.slice(0, max).forEach((it, i) => {
    const btn = h("button", { class: "thumb", type: "button", onclick: (e) => openLightbox(galleryId, i, e.currentTarget) }, [
      h("img", { src: it.src, width: it.width, height: it.height, alt: "", loading: "lazy", decoding: "async" }),
    ]);
    bindAttr(btn, "aria-label", () => `${fmt(COPY.openShot, { n: i + 1, t: total })}: ${itemLabel(it)}`);
    list.append(h("li", {}, btn));
  });
  if (total > max) {
    const more = h("button", { class: "thumb thumb-more", type: "button", onclick: (e) => openLightbox(galleryId, max, e.currentTarget) }, `+${total - max}`);
    bindAttr(more, "aria-label", () => fmt(COPY.moreShots, { t: total }));
    list.append(h("li", {}, more));
  }
  const label = h("span");
  bind(label, () => tr(ui.screenshots));
  return h("div", { class: "shots" }, [h("p", { class: "shots-label mono" }, [label, h("span", { dir: "ltr", text: pad2(total) })]), list]);
}

function frame(galleryId, index, kind) {
  const it = galleries[galleryId].items[index];
  return h(
    "div",
    { class: `frame ${kind}`, style: `--ar:${kind === "phone" ? `${it.width + 30}/${it.height + 30}` : `${it.width}/${it.height}`}`, onclick: () => openLightbox(galleryId, index, null) },
    h("img", { src: it.src, width: it.width, height: it.height, alt: "", loading: "lazy", decoding: "async" }),
  );
}

export function renderApp(app) {
  const title = h("h3", { id: `${app.id}-title`, text: app.name });
  const cat = h("p", { class: "category" });
  bind(cat, () => tr(app.category));
  const desc = h("p", { class: "desc" });
  bind(desc, () => tr(app.description));
  const feats = h(
    "ul",
    { class: "features" },
    app.features.map((f, i) => {
      const s = h("strong");
      bind(s, () => tr(f.title));
      const b = h("span", { class: "fb" });
      bind(b, () => tr(f.body));
      return h("li", {}, [h("span", { class: "idx", text: pad2(i + 1) }), h("div", {}, [s, b])]);
    }),
  );
  const visitLabel = () => `${tr(ui.visit)} ${app.name}`;
  const visitText = h("span");
  bind(visitText, visitLabel);
  const actions = h("div", { class: "actions" }, [
    h("div", { class: "actions-main" }, [extLink(app.website, "btn btn-primary ext", visitLabel, [visitText])]),
    h("div", { class: "actions-stores" }, app.platformLinks.map((p) => storeButton(p, app.name))),
  ]);
  const panel = h("div", { class: "panel rv" }, [
    panelBar(app.id, app.name),
    h("div", { class: "panel-head" }, [h("img", { class: "app-icon", src: app.icon.src, width: 46, height: 46, alt: "", loading: "lazy" }), title]),
    cat,
    desc,
    feats,
    thumbs(app.id, 3),
    actions,
  ]);
  let visual;
  if (app.id === "apexload") visual = h("div", { class: "visual-duo" }, [frame(app.id, 0, "phone"), frame(app.id, 1, "phone")]);
  else visual = h("div", { class: "visual-qh" }, [frame(app.id, 0, "wide"), frame(app.id, 1, "phone")]);
  const fig = h("div", { class: "station-visual screens", "aria-hidden": "true" }, visual);
  return h("article", { class: `station${app.id === "quranhaven" ? " flip" : ""}`, id: app.id, style: `--accent:${app.accent}`, "aria-labelledby": `${app.id}-title` }, [
    h("div", { class: "pin" }, h("div", { class: "grid station-grid" }, [panel, fig])),
  ]);
}

export function renderGame(game) {
  const isBC = game.id === "ball-crusher";
  const title = h("h3", { id: `${game.id}-title`, text: game.title });
  const kicker = h("p", { class: "category" });
  bind(kicker, () => tr(game.kicker));
  const desc = h("p", { class: "desc" });
  bind(desc, () => tr(game.description));
  const head = h("div", { class: "panel-head" }, [
    game.icon ? h("img", { class: "app-icon", src: game.icon.src, width: 46, height: 46, alt: "", loading: "lazy" }) : null,
    title,
  ]);
  const parts = [panelBar(game.id, game.title), head, kicker, desc];
  if (isBC) {
    const t = h("span");
    bind(t, () => tr(game.cta));
    parts.push(h("div", { class: "actions" }, [h("div", { class: "actions-main" }, [extLink(game.website, "btn btn-primary ext", () => tr(game.cta), [t])])]));
  } else {
    const tags = h("ul", { class: "tags" });
    onLang(() => tags.replaceChildren(...tr(game.tags).map((t) => h("li", { text: t }))));
    parts.push(tags, thumbs(game.id, 4));
    const trailerText = h("span");
    bind(trailerText, () => tr(ui.playTrailer));
    const trailerBtn = h("button", { class: "btn btn-primary", type: "button", onclick: (e) => openTrailer(game, e.currentTarget) }, [
      h("span", { class: "play-glyph", "aria-hidden": "true" }),
      trailerText,
    ]);
    const detailsText = h("span");
    bind(detailsText, () => tr(COPY.details));
    const detailsBtn = h("button", { class: "btn", type: "button", "aria-haspopup": "dialog", onclick: (e) => openDetails(game, e.currentTarget) }, [detailsText]);
    bindAttr(detailsBtn, "aria-label", () => `${tr(COPY.details)}: ${game.title}`);
    bindAttr(trailerBtn, "aria-label", () => `${tr(ui.playTrailer)}: ${game.title} (${fmt(COPY.trailerMeta, { s: game.trailer.sizeMB })})`);
    parts.push(
      h("div", { class: "actions" }, [
        h("div", { class: "actions-main" }, [trailerBtn, detailsBtn]),
        h("div", { class: "actions-stores" }, game.stores.map((s) => storeButton(s, game.title))),
      ]),
    );
    const meta = h("p", { class: "meta-note mono" });
    bind(meta, () => `${tr(COPY.trailer)} · ${fmt(COPY.trailerMeta, { s: game.trailer.sizeMB })}`);
    parts.push(meta);
  }
  const panel = h("div", { class: "panel rv" }, parts);
  let fig;
  if (isBC) {
    fig = h(
      "div",
      { class: "station-visual word" },
      h("div", { class: "visual-word" }, h("img", { src: game.wordmark.src, width: game.wordmark.width, height: game.wordmark.height, alt: "Ball Crusher", loading: "lazy" })),
    );
  } else {
    const order = game.id === "white-ninja" ? [1, 0, 5] : [0, 2, 4];
    fig = h("div", { class: "station-visual screens", "aria-hidden": "true" }, h("div", { class: "visual-game" }, order.map((i) => frame(game.id, i, "wide"))));
  }
  const variant = isBC ? " short center" : game.id === "puzzle-vs-zombie" ? " flip" : "";
  return h("article", { class: `station${variant}`, id: game.id, style: `--accent:${game.accent}`, "aria-labelledby": `${game.id}-title` }, [
    h("div", { class: "pin" }, h("div", { class: "grid station-grid" }, [panel, fig])),
  ]);
}

/** Text manifest used by the home chapter heads. */
export function renderManifest(list, el) {
  for (const p of list) {
    const name = p.name || p.title;
    const line = h("span", { class: "manifest-line" });
    bind(line, () => tr(p.category || p.kicker));
    el.append(
      h("li", {}, h("a", { href: `#${p.id}` }, [
        h("span", { class: "mono", dir: "ltr", text: `S·${signalOf(p.id)}` }),
        h("span", { class: "manifest-name" }, [h("bdi", { text: name }), line]),
        h("span", { class: "arrow", "aria-hidden": "true" }),
      ])),
    );
  }
}

/** Compact icon index used by the Apps / Games page heroes. */
export function renderIndex(list, el) {
  for (const p of list) {
    const name = p.name || p.title;
    let mark;
    if (p.icon) mark = h("img", { src: p.icon.src, width: 56, height: 56, alt: "", loading: "lazy" });
    else if (p.wordmark) mark = h("img", { class: "wm", src: p.wordmark.src, width: 112, height: 52, alt: "", loading: "lazy" });
    else mark = h("img", { class: "crop", src: p.poster.src, width: 56, height: 56, alt: "", loading: "lazy" });
    const line = h("span", { class: "chip-line" });
    bind(line, () => tr(p.category || p.kicker));
    el.append(
      h("li", { style: `--accent:${p.accent}` }, h("a", { class: "chip", href: `#${p.id}` }, [
        h("span", { class: "chip-mark" }, mark),
        h("span", { class: "chip-text" }, [h("span", { class: "chip-code mono", dir: "ltr", text: `S·${signalOf(p.id)}` }), h("bdi", { class: "chip-name", text: name }), line]),
        h("span", { class: "arrow", "aria-hidden": "true" }),
      ])),
    );
  }
}

const shot = (gid, i) => galleries[gid].items[i];
const item = (gid, i, kind, o) => ({ kind, src: shot(gid, i).src, w: shot(gid, i).width, h: shot(gid, i).height, index: i, ...o });

const DEFS = {
  apexload: () => ({
    rim: R.apps.apexload.accent,
    items: [
      item("apexload", 0, "phone", { nx: 0.3, ny: 0.03, hFrac: 0.6, yaw: -0.2, dz: 0 }),
      item("apexload", 1, "phone", { nx: 0.56, ny: -0.05, hFrac: 0.52, yaw: -0.36, dz: -1.3 }),
    ],
  }),
  // calm, upright and flat: no tilt, no curvature
  quranhaven: () => ({
    rim: R.apps.quranhaven.accent,
    calm: true,
    flip: true,
    items: [
      item("quranhaven", 0, "wide", { nx: 0.52, ny: 0.1, wFrac: 0.64, yaw: 0, dz: 0 }),
      item("quranhaven", 1, "phone", { nx: 0.14, ny: -0.2, hFrac: 0.46, yaw: 0, dz: 1.0 }),
    ],
  }),
  "white-ninja": () => ({
    rim: R.games["white-ninja"].accent,
    items: [
      item("white-ninja", 1, "wide", { nx: 0.47, ny: 0.2, wFrac: 0.66, yaw: -0.1, curve: 0.14 }),
      item("white-ninja", 0, "wide", { nx: 0.26, ny: -0.43, wFrac: 0.38, yaw: 0.08, dz: 1.1, curve: 0.05 }),
      item("white-ninja", 5, "wide", { nx: 0.65, ny: -0.47, wFrac: 0.32, yaw: -0.3, dz: 1.6, curve: 0.05 }),
    ],
  }),
  // a deck of screens receding diagonally into the tunnel
  "puzzle-vs-zombie": () => ({
    rim: R.games["puzzle-vs-zombie"].accent,
    flip: true,
    items: [
      item("puzzle-vs-zombie", 4, "wide", { nx: 0.78, ny: 0.34, wFrac: 0.46, yaw: -0.26, dz: -2.2, curve: 0.06 }),
      item("puzzle-vs-zombie", 2, "wide", { nx: 0.5, ny: 0.04, wFrac: 0.48, yaw: -0.2, dz: -0.6, curve: 0.06 }),
      item("puzzle-vs-zombie", 0, "wide", { nx: 0.22, ny: -0.3, wFrac: 0.5, yaw: -0.14, dz: 1.0, curve: 0.06 }),
    ],
  }),
  "ball-crusher": () => ({ rim: R.games["ball-crusher"].accent, items: [] }),
};

/** 3D station definitions for the given ids, in flight order. */
export function stationDefs(ids) {
  return ids.map((id, i) => ({ id, z: STATION_Z(i), ...DEFS[id]() }));
}

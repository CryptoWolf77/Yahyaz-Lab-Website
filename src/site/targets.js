// Morph targets for the Nebula particle system.
// Every particle owns one position per "state": void, logo, galaxy, planets, tunnel.
// The vertex shader blends between two of them with a per-particle delay.

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const hex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [toLinear(((n >> 16) & 255) / 255), toLinear(((n >> 8) & 255) / 255), toLinear((n & 255) / 255)];
};

const CYAN = hex("#2ef4ff");
const ICE = hex("#d9f6ff");
const BLUE = hex("#3d8bff");
const PINK = hex("#ff3f8c");
const GOLD = hex("#ffd448");
const ROSE = hex("#ff9cc4");
const WHITE = [1, 1, 1];

/** Sample the transparent logo so every particle can inherit its real colour. */
export async function sampleLogo(src, width = 760) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const w = width;
  const h = Math.round((width * img.naturalHeight) / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 150) continue;
      const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      // The black outline would be invisible with additive light, so it is skipped.
      if (lum < 0.17) continue;
      pts.push(x, y);
    }
  }
  return { w, h, data, pts: Int32Array.from(pts) };
}

// Tunnel loop: 112 units = 4 stations of 28. Gates at world z = -10 - 28k
// (22 beyond each station camera), hoops at a third of the spacing between.
const TUNNEL = (() => {
  const len = 112;
  const gates = [18, 46, 74, 102];
  const rings = [];
  for (const g of gates) rings.push(g + 28 / 3, g + (2 * 28) / 3);
  return { len, gates, rings, radius: 6.4, tube: 0.3 };
})();
export const TUNNEL_LEN = TUNNEL.len;

export function buildTargets(count, logo) {
  const tunnel = TUNNEL;
  const rand = mulberry32(2021);
  const gauss = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  const aVoid = new Float32Array(count * 3);
  const aLogo = new Float32Array(count * 3);
  const aGalaxy = new Float32Array(count * 3);
  const aPlanet = new Float32Array(count * 3);
  const aTunnel = new Float32Array(count * 4);
  const aColLogo = new Float32Array(count * 3);
  const aColCos = new Float32Array(count * 3);
  const aRand = new Float32Array(count * 4);

  const nPts = logo.pts.length / 2;
  const aspect = logo.h / logo.w;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;
    const group = rand() < 0.5 ? 0 : 1;

    // ---- logo (unit width, centred) ----
    const k = Math.floor(rand() * nPts);
    const px = logo.pts[k * 2] + rand();
    const py = logo.pts[k * 2 + 1] + rand();
    const lx = px / logo.w - 0.5;
    const ly = -(py / logo.h - 0.5) * aspect;
    const di = (Math.floor(py) * logo.w + Math.floor(px)) * 4;
    const r = logo.data[di] / 255;
    const g = logo.data[di + 1] / 255;
    const b = logo.data[di + 2] / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    aLogo[i3] = lx;
    aLogo[i3 + 1] = ly;
    aLogo[i3 + 2] = (rand() - 0.5) * 0.018 + lum * 0.012;
    aColLogo[i3] = toLinear(r);
    aColLogo[i3 + 1] = toLinear(g);
    aColLogo[i3 + 2] = toLinear(b);

    // Delay sweeps from the left edge of the mark, so the logo "prints" across.
    aRand[i4] = Math.min(1, Math.max(0, 0.55 * rand() + 0.45 * (lx + 0.5)));
    aRand[i4 + 1] = rand();
    aRand[i4 + 2] = rand();
    aRand[i4 + 3] = group;

    // ---- void: deep space ahead of the camera ----
    const vr = 40 + rand() * 110;
    const va = rand() * Math.PI * 2;
    const spread = 0.35 + rand() * 0.9;
    aVoid[i3] = Math.cos(va) * vr * spread;
    aVoid[i3 + 1] = Math.sin(va) * vr * spread * 0.6;
    aVoid[i3 + 2] = -vr;

    // ---- galaxy: two arms (one per world) + bulge + halo ----
    const roll = rand();
    let gr;
    let gt;
    let gh;
    let gc;
    if (roll < 0.11) {
      gr = Math.pow(rand(), 1.7) * 0.2;
      gt = rand() * Math.PI * 2;
      gh = gauss() * 0.045 * (1 - gr * 3);
      gc = mixc(hex("#fff1d6"), GOLD, rand() * 0.5);
    } else if (roll < 0.24) {
      gr = 0.1 + Math.pow(rand(), 0.6) * 1.05;
      gt = rand() * Math.PI * 2;
      gh = gauss() * 0.09;
      gc = rand() < 0.5 ? mixc(ICE, BLUE, rand() * 0.5) : mixc(ROSE, ICE, rand() * 0.6);
    } else {
      gr = 0.08 + Math.pow(rand(), 0.8) * 0.92;
      gt = group * Math.PI + gr * 4.4 + gauss() * 0.24 * (1.15 - gr * 0.55);
      gh = gauss() * 0.022;
      if (group === 0) gc = rand() < 0.7 ? mixc(CYAN, ICE, rand() * 0.55) : mixc(BLUE, ICE, rand());
      else gc = rand() < 0.68 ? mixc(PINK, ROSE, rand() * 0.6) : mixc(GOLD, hex("#fff1d6"), rand() * 0.5);
      if (rand() < 0.06) gc = WHITE;
    }
    aGalaxy[i3] = gr;
    aGalaxy[i3 + 1] = gt;
    aGalaxy[i3 + 2] = gh;
    aColCos[i3] = gc[0];
    aColCos[i3 + 1] = gc[1];
    aColCos[i3 + 2] = gc[2];

    // ---- planets: banded sphere + ring (unit radius) ----
    if (rand() < 0.74) {
      const u = rand() * 2 - 1;
      const th = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const rr = 0.9 + 0.1 * Math.cbrt(rand());
      aPlanet[i3] = Math.cos(th) * s * rr;
      aPlanet[i3 + 1] = u * rr;
      aPlanet[i3 + 2] = Math.sin(th) * s * rr;
    } else {
      const th = rand() * Math.PI * 2;
      let rr = 1.42 + rand() * 0.62;
      if (rr > 1.7 && rr < 1.77) rr += 0.08; // Cassini-style gap
      aPlanet[i3] = Math.cos(th) * rr;
      aPlanet[i3 + 1] = gauss() * 0.012;
      aPlanet[i3 + 2] = Math.sin(th) * rr;
    }

    // ---- tunnel: angle, radius factor, z (0..1 of the loop), type ----
    // type 0 dust (drifts), 1 thin hoop, 2 gate torus, 3 helix strand (drifts)
    // Gates sit 22 units beyond every station, so one frames each stop and the
    // camera flies through one at each chapter opener.
    const t4 = i * 4;
    const roll2 = rand();
    const R = tunnel.radius;
    const L = tunnel.len;
    if (roll2 < 0.22) {
      const g = Math.floor(rand() * tunnel.gates.length);
      const phi = rand() * Math.PI * 2;
      const tube = tunnel.tube * (0.82 + 0.18 * rand());
      aTunnel[t4] = rand() * Math.PI * 2;
      aTunnel[t4 + 1] = 1 + (Math.cos(phi) * tube) / R;
      aTunnel[t4 + 2] = (tunnel.gates[g] + Math.sin(phi) * tube) / L;
      aTunnel[t4 + 3] = 2;
    } else if (roll2 < 0.5) {
      const ring = tunnel.rings[Math.floor(rand() * tunnel.rings.length)];
      aTunnel[t4] = rand() * Math.PI * 2;
      aTunnel[t4 + 1] = 1 + gauss() * 0.005;
      aTunnel[t4 + 2] = (ring + gauss() * 0.035) / L;
      aTunnel[t4 + 3] = 1;
    } else if (roll2 < 0.65) {
      const strand = Math.floor(rand() * 4);
      const z = rand();
      aTunnel[t4] = strand * (Math.PI / 2) + z * L * 0.16 + gauss() * 0.02;
      aTunnel[t4 + 1] = 0.97 + gauss() * 0.008;
      aTunnel[t4 + 2] = z;
      aTunnel[t4 + 3] = 3;
    } else {
      aTunnel[t4] = rand() * Math.PI * 2;
      aTunnel[t4 + 1] = rand() < 0.25 ? 0.18 + rand() * 0.6 : 0.92 + gauss() * 0.07;
      aTunnel[t4 + 2] = rand();
      aTunnel[t4 + 3] = 0;
    }
  }

  return { aVoid, aLogo, aGalaxy, aPlanet, aTunnel, aColLogo, aColCos, aRand };
}

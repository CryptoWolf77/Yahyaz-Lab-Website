// Nebula · static 2D starfield: the no-WebGL fallback and the privacy pages' quiet sky.
export function drawSky(canvas = document.getElementById("sky")) {
  if (!canvas) return;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const w = innerWidth;
  const hgt = innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(hgt * dpr);
  const g = canvas.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.fillStyle = "#03040b";
  g.fillRect(0, 0, w, hgt);
  const glow = (x, y, r, col) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, col);
    gr.addColorStop(1, "rgba(3,4,11,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, hgt);
  };
  glow(w * 0.5, hgt * 0.55, Math.max(w, hgt) * 0.7, "rgba(16,24,70,0.55)");
  glow(w * 0.78, hgt * 0.28, Math.max(w, hgt) * 0.45, "rgba(46,244,255,0.10)");
  glow(w * 0.18, hgt * 0.82, Math.max(w, hgt) * 0.42, "rgba(255,63,140,0.09)");
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const n = Math.round((w * hgt) / 1800);
  for (let i = 0; i < n; i++) {
    const r = rnd();
    g.fillStyle = r < 0.8 ? `rgba(234,246,255,${0.25 + rnd() * 0.6})` : r < 0.9 ? `rgba(46,244,255,${0.4 + rnd() * 0.5})` : `rgba(255,120,170,${0.4 + rnd() * 0.5})`;
    const s = rnd() < 0.94 ? 0.5 + rnd() * 0.8 : 1.2 + rnd() * 1.2;
    g.beginPath();
    g.arc(rnd() * w, rnd() * hgt, s, 0, Math.PI * 2);
    g.fill();
  }
}

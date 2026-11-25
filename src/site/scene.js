// Nebula: one persistent WebGL scene behind the page.
// Particles morph between targets (void, logo, galaxy, planets, tunnel) and the
// camera flies through them. Screens float as emissive cards in the tunnel.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { sampleLogo, buildTargets, TUNNEL_LEN } from "./targets.js";
import * as GL from "./shaders.js";

export const FOV = 35;
export const FOCUS = 12; // camera to anchor-plane distance used for DOM alignment
const STATION_DIST = 9;
const HOLD_DRIFT = 0.7; // camera creeps forward this much while a station is pinned

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export async function createNebula({ canvas, logoSrc, mobile, lowPower, onLost }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x03040b, 1);
  renderer.toneMapping = THREE.NoToneMapping;

  const dprCap = mobile ? 1.5 : 1.75;
  let dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  let W = window.innerWidth;
  let H = window.innerHeight;

  let logo;
  try {
    logo = await sampleLogo(logoSrc, mobile ? 560 : 760);
  } catch (err) {
    renderer.dispose();
    throw err;
  }

  const count = mobile ? 18000 : lowPower ? 36000 : 60000;
  const T = buildTargets(count, logo);

  const scene = new THREE.Scene();
  const planeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 900);
  camera.position.set(0, 0, FOCUS);
  const look = new THREE.Vector3(0, 0, 0);

  // ---------- background haze ----------
  const hazeGeo = new THREE.BufferGeometry();
  hazeGeo.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const hazeU = {
    uTime: { value: 0 },
    uOffset: { value: new THREE.Vector2() },
    uZoom: { value: 1 },
    uHue: { value: 0 },
    uGreen: { value: 0 },
    uAspect: { value: W / H },
    uStrength: { value: 1 },
  };
  const haze = new THREE.Mesh(
    hazeGeo,
    new THREE.ShaderMaterial({
      uniforms: hazeU,
      vertexShader: GL.hazeVertex,
      fragmentShader: GL.hazeFragment,
      depthTest: false,
      depthWrite: false,
    }),
  );
  haze.frustumCulled = false;
  haze.renderOrder = -10;
  scene.add(haze);

  // ---------- star field (at infinity, follows the camera) ----------
  const starCount = mobile ? 1600 : 4200;
  const starPos = new Float32Array(starCount * 3);
  const starAttr = new Float32Array(starCount * 4);
  for (let i = 0; i < starCount; i++) {
    const u = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 260 + Math.random() * 200;
    starPos[i * 3] = Math.cos(t) * s * r;
    starPos[i * 3 + 1] = u * r;
    starPos[i * 3 + 2] = Math.sin(t) * s * r;
    starAttr[i * 4] = 0.8 + Math.pow(Math.random(), 3) * 2.2;
    starAttr[i * 4 + 1] = Math.random();
    starAttr[i * 4 + 2] = 0.3 + Math.random() * 1.1;
    starAttr[i * 4 + 3] = Math.random();
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("aStar", new THREE.BufferAttribute(starAttr, 4));
  const starU = { uTime: { value: 0 }, uPixelRatio: { value: dpr } };
  const stars = new THREE.Points(
    starGeo,
    new THREE.ShaderMaterial({
      uniforms: starU,
      vertexShader: GL.starVertex,
      fragmentShader: GL.starFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  stars.frustumCulled = false;
  scene.add(stars);

  // ---------- particles ----------
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(T.aLogo.slice(), 3));
  geo.setAttribute("aVoid", new THREE.BufferAttribute(T.aVoid, 3));
  geo.setAttribute("aLogo", new THREE.BufferAttribute(T.aLogo, 3));
  geo.setAttribute("aGalaxy", new THREE.BufferAttribute(T.aGalaxy, 3));
  geo.setAttribute("aPlanet", new THREE.BufferAttribute(T.aPlanet, 3));
  geo.setAttribute("aTunnel", new THREE.BufferAttribute(T.aTunnel, 4));
  geo.setAttribute("aColLogo", new THREE.BufferAttribute(T.aColLogo, 3));
  geo.setAttribute("aColCos", new THREE.BufferAttribute(T.aColCos, 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(T.aRand, 4));

  const U = {
    uTime: { value: 0 },
    uFrom: { value: 0 },
    uTo: { value: 1 },
    uMix: { value: 0 },
    uTurb: { value: 1.6 },
    uScale: { value: 1 },
    uSize: { value: mobile ? 0.03 : 0.024 },
    uGain: { value: 1 },
    uLogoGain: { value: 0.62 },
    uLogoA: { value: new THREE.Vector4(2, 0, 0, 8) },
    uLogoB: { value: new THREE.Vector4(2, 0, 0, 8) },
    uAnchorZ: { value: 0 },
    uCamZ: { value: FOCUS },
    uPlanetA: { value: new THREE.Vector3(-3, 0, 1.3) },
    uPlanetB: { value: new THREE.Vector3(3, 0, 1.3) },
    uGalaxyR: { value: 6.2 },
    uGalaxyTilt: { value: 0.78 },
    uGalaxyRoll: { value: -0.32 },
    uGalaxyOff: { value: new THREE.Vector2(0, 0) },
    uTunnelR: { value: 6.4 },
    uTunnelLen: { value: TUNNEL_LEN },
    uFlow: { value: 0 },
    uHue: { value: 0 },
    uGreen: { value: 0 },
    uSolo: { value: 0 },
    uFogNear: { value: 26 },
    uFogFar: { value: 92 },
    uMaxSize: { value: 40 },
  };
  const particles = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: GL.particleVertex,
      fragmentShader: GL.particleFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  particles.frustumCulled = false;
  scene.add(particles);

  // ---------- screens (rendered after bloom so they stay crisp) ----------
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  let stations = [];
  let dir = 1;
  const cardMeshes = [];

  function makeCard(item, rim) {
    const bezel = item.kind === "phone" ? 0.07 : 0.0;
    const radius = item.kind === "phone" ? 0.2 : 0.07;
    const margin = 0.5;
    const uniforms = {
      uMap: { value: null },
      uHasMap: { value: 0 },
      uOpacity: { value: 0 },
      uRadius: { value: radius },
      uBezel: { value: bezel },
      uGlow: { value: item.kind === "phone" ? 0.85 : 0.6 },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uCard: { value: new THREE.Vector2(1, 1) },
      uRim: { value: new THREE.Color(rim) },
      uTime: { value: 0 },
      uCurve: { value: item.curve || 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: GL.cardVertex,
      fragmentShader: GL.cardFragment,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, item.curve ? 24 : 1, 1), mat);
    mesh.userData = { item, margin, bezel, radius };
    mesh.renderOrder = 2;
    cardMeshes.push(mesh);
    return mesh;
  }

  function makeBody(rim) {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uRim: { value: new THREE.Color(rim) }, uOpacity: { value: 0 } },
      vertexShader: GL.bodyVertex,
      fragmentShader: GL.bodyFragment,
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
    mesh.renderOrder = 1;
    return mesh;
  }

  function setStations(defs) {
    for (const st of stations) {
      planeScene.remove(st.pivot);
      st.pivot.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          o.material.uniforms?.uMap?.value?.dispose();
          o.material.dispose();
        }
      });
    }
    cardMeshes.length = 0;
    stations = defs.map((def) => {
      const pivot = new THREE.Group();
      const items = def.items.map((item) => {
        const holder = new THREE.Group();
        const card = makeCard(item, def.rim);
        holder.add(card);
        let body = null;
        if (item.kind === "phone") {
          body = makeBody(def.rim);
          holder.add(body);
        }
        pivot.add(holder);
        return { item, holder, card, body, texture: null, loading: false, mix: 0 };
      });
      planeScene.add(pivot);
      return { def, pivot, items, opacity: 0 };
    });
    layoutStations();
  }

  function halfAt(dist) {
    const h = dist * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    return { h, w: h * (W / H) };
  }

  // Per-station safe span in viewport px [minX, maxX], measured from the DOM
  // (beside the panel, clear of the mission timeline gutter).
  let safe = {};
  function setSafe(map) {
    safe = map || {};
    layoutStations();
  }

  function layoutStations() {
    const ndc = (px) => (px / W) * 2 - 1;
    for (const st of stations) {
      if (!st.items.length) continue;
      const side = st.def.flip ? -dir : dir;
      const bezel = (it) => (it.item.kind === "phone" ? 0.07 : 0);
      // 1) natural size + where each card lands on screen at the closest point of the stop
      const parts = st.items.map((it) => {
        const { item } = it;
        const dLayout = STATION_DIST - (item.dz || 0);
        const half = halfAt(dLayout);
        const aspect = item.w / item.h;
        let screenW;
        let screenH;
        if (item.hFrac) {
          screenH = item.hFrac * 2 * half.h;
          screenW = screenH * aspect;
        } else {
          screenW = item.wFrac * half.w;
          screenH = screenW / aspect;
        }
        const near = halfAt(dLayout - HOLD_DRIFT);
        const x = side * item.nx * half.w;
        const c = x / near.w;
        const ext = ((screenW / 2 + bezel(it)) * Math.cos(item.yaw || 0) + 0.14) / near.w;
        return { it, screenW, screenH, near, c, ext, y: item.ny * half.h };
      });
      // 2) fit the group inside the safe span (shrink if needed, then centre it)
      let gmin = Infinity;
      let gmax = -Infinity;
      for (const p of parts) {
        gmin = Math.min(gmin, p.c - p.ext);
        gmax = Math.max(gmax, p.c + p.ext);
      }
      const span = safe[st.def.id];
      const smin = span ? ndc(span[0]) : side > 0 ? 0.08 : -0.8;
      const smax = span ? ndc(span[1]) : side > 0 ? 0.8 : -0.08;
      const k = Math.min(1, (smax - smin) / Math.max(0.001, gmax - gmin));
      const mid = (smin + smax) / 2;
      const gc = (gmin + gmax) / 2;
      const pivotX = mid * halfAt(STATION_DIST - HOLD_DRIFT).w;
      st.pivot.position.set(pivotX, 0, st.def.z - STATION_DIST);
      for (const p of parts) {
        const { it } = p;
        const { item } = it;
        const b = bezel(it);
        const cardW = p.screenW * k + b * 2;
        const cardH = p.screenH * k + b * 2;
        const margin = it.card.userData.margin;
        it.card.scale.set(cardW + margin * 2, cardH + margin * 2, 1);
        it.card.material.uniforms.uPlane.value.set(cardW + margin * 2, cardH + margin * 2);
        it.card.material.uniforms.uCard.value.set(cardW, cardH);
        it.card.position.z = 0.004;
        // item.curve is the edge sag in world units; geometry x runs -0.5..0.5
        if (item.curve) it.card.material.uniforms.uCurve.value = item.curve * 4;
        if (it.body) {
          it.body.geometry.dispose();
          const depth = 0.1;
          const g = new THREE.ExtrudeGeometry(roundedRectShape(cardW, cardH, 0.2 * Math.max(0.7, k)), {
            depth,
            bevelEnabled: true,
            bevelThickness: 0.018,
            bevelSize: 0.018,
            bevelSegments: 2,
            curveSegments: 10,
          });
          g.translate(0, 0, -(depth + 0.018));
          it.body.geometry = g;
        }
        const xWorld = (mid + (p.c - gc) * k) * p.near.w;
        it.holder.position.set(xWorld - pivotX, p.y, item.dz || 0);
        it.holder.rotation.set(0, side * (item.yaw || 0), 0);
        it.baseY = p.y;
      }
    }
  }

  function loadTexture(it) {
    if (it.loading) return;
    it.loading = true;
    loader.load(
      it.item.src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        it.texture = tex;
        it.card.material.uniforms.uMap.value = tex;
      },
      undefined,
      () => {
        it.loading = false;
      },
    );
  }

  // ---------- post ----------
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(dpr);
  composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), mobile ? 0.7 : 0.82, 0.55, 0.12);
  composer.addPass(bloom);
  const planesPass = new RenderPass(planeScene, camera);
  planesPass.clear = false;
  planesPass.clearDepth = true;
  composer.addPass(planesPass);
  const finalPass = new ShaderPass(GL.finalShader);
  finalPass.uniforms.uRes.value = new THREE.Vector2(W * dpr, H * dpr);
  composer.addPass(finalPass);

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    composer.setPixelRatio(dpr);
    composer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    U.uScale.value = (H * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    U.uMaxSize.value = 46 * dpr;
    starU.uPixelRatio.value = dpr;
    hazeU.uAspect.value = W / H;
    finalPass.uniforms.uRes.value.set(W * dpr, H * dpr);
    layoutStations();
  }
  resize();

  // Convert a viewport rect to the anchor plane (camera at canonical pose).
  function rectToWorld(rect) {
    const half = halfAt(FOCUS);
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return {
      x: (cx / W) * 2 * half.w - half.w,
      y: -((cy / H) * 2 * half.h - half.h),
      w: (rect.width / W) * 2 * half.w,
      h: (rect.height / H) * 2 * half.h,
    };
  }

  const pointer = new THREE.Vector2();
  const tmp = new THREE.Vector3();
  const ray = new THREE.Raycaster();
  const hitList = [];
  let flow = 0;

  function frame(s, time, dt) {
    U.uTime.value = time;
    starU.uTime.value = time;
    hazeU.uTime.value = time;
    U.uFrom.value = s.from;
    U.uTo.value = s.to;
    U.uMix.value = s.mix;
    U.uTurb.value = s.turb;
    U.uGain.value = s.gain;
    U.uHue.value = s.hue;
    hazeU.uHue.value = s.hue;
    U.uGreen.value = s.green || 0;
    U.uSolo.value = s.solo || 0;
    hazeU.uGreen.value = s.green || 0;
    U.uGalaxyTilt.value = s.tilt;
    U.uGalaxyRoll.value = s.groll ?? -0.32;
    U.uGalaxyR.value = s.galaxyR;
    U.uAnchorZ.value = s.anchorZ;
    flow += dt * (0.55 + s.flowBoost);
    U.uFlow.value = flow;

    if (s.logoA) {
      const a = rectToWorld(s.logoA);
      U.uLogoA.value.set(a.x, a.y, s.anchorZ, a.w);
    }
    if (s.logoB) {
      const b = rectToWorld(s.logoB);
      U.uLogoB.value.set(b.x, b.y, s.anchorZ, b.w);
    }
    if (s.planetA) {
      const a = rectToWorld(s.planetA);
      U.uPlanetA.value.set(a.x, a.y, Math.min(a.w, a.h) * 0.3);
    }
    if (s.planetB) {
      const b = rectToWorld(s.planetB);
      U.uPlanetB.value.set(b.x, b.y, Math.min(b.w, b.h) * 0.3);
    }
    const half = halfAt(FOCUS);
    U.uGalaxyOff.value.set(s.galaxyX * half.w, s.galaxyY * half.h);

    // camera: orbit-style parallax around a fixed look target keeps anchors aligned
    const px = s.mouseX * s.parallax;
    const py = s.mouseY * s.parallax;
    camera.position.set(s.camX + px, s.camY + py, s.camZ);
    look.set(s.lookX, s.lookY, s.camZ - FOCUS);
    camera.lookAt(look);
    camera.rotation.z += s.roll;
    U.uCamZ.value = s.camZ;
    stars.position.copy(camera.position);
    hazeU.uOffset.value.set(s.camX * 0.02 + px * 0.015, s.camY * 0.02 + py * 0.015);
    hazeU.uZoom.value = 1 + Math.max(0, FOCUS - s.camZ) * 0.004;

    // screens
    for (const st of stations) {
      const dist = s.camZ - (st.def.z - STATION_DIST);
      const calm = st.def.calm;
      // the next stop stays invisible while the current one is held (its planes sit ~37 units away)
      const vis = s.planes ? smooth(27, 17, dist) * smooth(calm ? 6.2 : 4.4, calm ? 7.4 : 6.6, dist) : 0;
      st.opacity = vis;
      st.pivot.visible = vis > 0.002;
      if (s.planes && dist < 72 && dist > -10) for (const it of st.items) if (!it.texture) loadTexture(it);
      if (!st.pivot.visible) continue;
      const k = st.def.calm ? 0.35 : 1;
      st.pivot.rotation.y = s.mouseX * 0.09 * k;
      st.pivot.rotation.x = -s.mouseY * 0.05 * k;
      for (let i = 0; i < st.items.length; i++) {
        const it = st.items[i];
        it.mix = Math.min(1, it.mix + (it.texture ? dt * 1.6 : 0));
        const u = it.card.material.uniforms;
        // nothing shows until the real screenshot has arrived (no black placeholder)
        u.uOpacity.value = vis * it.mix;
        u.uHasMap.value = it.texture ? 1 : 0;
        u.uTime.value = time;
        if (it.body) it.body.material.uniforms.uOpacity.value = vis * it.mix;
        it.holder.position.y = it.baseY + Math.sin(time * 0.5 + i * 1.7) * 0.05 * k;
      }
    }

    composer.render(dt);
  }

  function pick(clientX, clientY) {
    pointer.set((clientX / W) * 2 - 1, -(clientY / H) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    const hits = [];
    for (const st of stations) {
      if (st.opacity < 0.5) continue;
      for (const it of st.items) {
        it.card.updateMatrixWorld();
        hitList.length = 0;
        const h = ray.intersectObject(it.card, false, hitList)[0];
        if (!h) continue;
        // ignore the glow margin
        const local = it.card.worldToLocal(tmp.copy(h.point));
        const { uPlane, uCard } = it.card.material.uniforms;
        if (Math.abs(local.x * uPlane.value.x) > uCard.value.x / 2 || Math.abs(local.y * uPlane.value.y) > uCard.value.y / 2) continue;
        hits.push({ d: h.distance, gallery: st.def.id, index: it.item.index });
      }
    }
    hits.sort((a, b) => a.d - b.d);
    return hits[0] || null;
  }

  function setDir(d) {
    dir = d;
    layoutStations();
  }

  const lost = (e) => {
    e.preventDefault();
    onLost?.();
  };
  canvas.addEventListener("webglcontextlost", lost);

  function dispose() {
    canvas.removeEventListener("webglcontextlost", lost);
    setStations([]);
    geo.dispose();
    particles.material.dispose();
    starGeo.dispose();
    stars.material.dispose();
    hazeGeo.dispose();
    haze.material.dispose();
    composer.dispose?.();
    renderer.dispose();
  }

  return { frame, resize, setStations, setDir, setSafe, pick, dispose, rectToWorld, count };
}

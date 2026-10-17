import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FogExp2,
  GridHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from "three";
import type * as Three from "three";
import { heroImages } from "../data/siteContent";

type SceneMode = "loading" | "animated" | "static" | "paused-hidden" | "paused-offscreen" | "fallback";

export default function HeroScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<SceneMode>("loading");

  useEffect(() => {
    const mount = mountRef.current;
    const root = rootRef.current;
    if (!mount || !root) return;
    let disposed = false;
    let teardown: (() => void) | undefined;

    const initialize = () => {
      try {
        if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
          setMode("fallback");
          return;
        }
        if (disposed) return;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: true,
        });
        if (!context) {
          setMode("fallback");
          return;
        }
        const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
        renderer.outputColorSpace = SRGBColorSpace;
        canvas.setAttribute("aria-hidden", "true");
        mount.appendChild(canvas);
        teardown = () => { renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); };

        const scene = new Scene();
        scene.fog = new FogExp2(0x070713, 0.035);
        const camera = new PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0, 8.8);
        const group = new Group();
        scene.add(group);
        const geometrySet = new Set<Three.BufferGeometry>();
        const materialSet = new Set<Three.Material>();
        const textureSet = new Set<Three.Texture>();
        teardown = () => {
          geometrySet.forEach((geometry) => geometry.dispose());
          materialSet.forEach((surface) => surface.dispose());
          textureSet.forEach((texture) => texture.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        };
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let loaded = 0;
        let failed = false;
        let visible = false;
        let dirty = true;
        let elapsed = 0;
        let previousTime = 0;
        let raf = 0;
        let frames = 0;
        const planes: Three.Mesh<Three.PlaneGeometry, Three.MeshBasicMaterial>[] = [];
        const positions = [
          { x: 0, y: 0.65, z: 0.5, w: 3.05, h: 1.55, r: 0 },
          { x: -3.1, y: -0.25, z: -0.9, w: 2.65, h: 1.5, r: -0.2 },
          { x: 3.05, y: -0.1, z: -1.25, w: 2.55, h: 1.45, r: 0.22 },
          { x: -1.35, y: -2.0, z: -2.0, w: 2.35, h: 1.32, r: 0.12 },
          { x: 1.8, y: -1.78, z: -1.7, w: 2.45, h: 1.38, r: -0.16 },
        ];
        const loader = new TextureLoader();
        heroImages.forEach((src, index) => {
          const texture = loader.load(src, (result) => {
            if (disposed) { result.dispose(); return; }
            loaded += 1;
            root.dataset.textures = String(loaded);
            dirty = true;
            reconcile();
          }, undefined, () => {
            if (disposed) return;
            failed = true;
            stop();
            setReady(false);
            setMode("fallback");
          });
          texture.colorSpace = SRGBColorSpace;
          textureSet.add(texture);
          const surface = new MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: index === 0 ? 0.96 : 0.58,
            side: DoubleSide,
          });
          const data = positions[index];
          const geometry = new PlaneGeometry(data.w, data.h);
          geometrySet.add(geometry);
          materialSet.add(surface);
          const plane = new Mesh(geometry, surface);
          plane.position.set(data.x, data.y, data.z);
          plane.rotation.z = data.r;
          planes.push(plane);
          group.add(plane);
        });

        const grid = new GridHelper(12, 18, 0x27f3ff, 0x21334f);
        grid.position.set(0, -2.65, -2.2);
        grid.rotation.x = Math.PI * 0.5;
        const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
        gridMaterials.forEach((surface) => {
          surface.transparent = true;
          surface.opacity = 0.22;
          materialSet.add(surface);
        });
        geometrySet.add(grid.geometry);
        scene.add(grid);

        const particles = new BufferGeometry();
        const particlePositions = new Float32Array(160 * 3);
        for (let index = 0; index < 160; index += 1) {
          particlePositions[index * 3] = (Math.random() - 0.5) * 10;
          particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 6;
          particlePositions[index * 3 + 2] = -Math.random() * 6;
        }
        particles.setAttribute("position", new BufferAttribute(particlePositions, 3));
        const particleMaterial = new PointsMaterial({ color: 0x6df7ff, size: 0.032, transparent: true, opacity: 0.68 });
        geometrySet.add(particles);
        materialSet.add(particleMaterial);
        const particleField = new Points(particles, particleMaterial);
        scene.add(particleField);

        const isVisible = () => {
          const rect = mount.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
        };
        function stop() {
          window.cancelAnimationFrame(raf);
          raf = 0;
          previousTime = 0;
        }
        const render = () => {
          if (disposed || failed || loaded !== heroImages.length || !visible || document.hidden) return;
          const time = motion.matches ? 0 : elapsed;
          planes.forEach((plane, index) => {
            const data = positions[index];
            plane.position.y = data.y + Math.sin(time * (0.25 + index * 0.03) + index * 1.6) * 0.12;
            plane.rotation.z = data.r + Math.sin(time * 0.35 + index) * 0.025;
          });
          group.rotation.y = Math.sin(time * 0.24) * 0.09;
          particleField.rotation.z = time * 0.054;
          grid.position.x = Math.sin(time * 0.18) * 0.18;
          renderer.render(scene, camera);
          frames += 1;
          root.dataset.frameCount = String(frames);
          canvas.dataset.frameCount = String(frames);
          if (frames === 1) setReady(true);
          dirty = false;
        };
        const tick = (time: number) => {
          raf = 0;
          if (disposed || failed || !visible || document.hidden) return;
          if (motion.matches) { dirty = true; reconcile(); return; }
          if (!previousTime || time - previousTime >= 1000 / 30) {
            elapsed += previousTime ? Math.min((time - previousTime) / 1000, 0.06) : 0;
            previousTime = time;
            render();
          }
          raf = window.requestAnimationFrame(tick);
        };
        function reconcile() {
          if (disposed || failed) return;
          if (document.hidden || !visible) {
            stop();
            if (loaded === heroImages.length) setMode(document.hidden ? "paused-hidden" : "paused-offscreen");
            return;
          }
          if (loaded !== heroImages.length) return;
          if (motion.matches) {
            stop();
            setMode("static");
            if (dirty) render();
          } else {
            setMode("animated");
            if (!raf) raf = window.requestAnimationFrame(tick);
          }
        }
        const resize = () => {
          const width = mount.clientWidth;
          const height = mount.clientHeight;
          if (!width || !height) {
            visible = false;
            reconcile();
            return;
          }
          const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 900 ? 1.5 : 1.75);
          renderer.setPixelRatio(dpr);
          renderer.setSize(width, height, false);
          root.dataset.dpr = String(dpr);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          visible = isVisible();
          dirty = true;
          reconcile();
        };
        const onVisibility = () => { visible = isVisible(); dirty = true; reconcile(); };
        const onMotion = () => { dirty = true; reconcile(); };
        const onContextLost = (event: Event) => {
          event.preventDefault();
          failed = true;
          stop();
          setReady(false);
          setMode("fallback");
        };
        const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && isVisible(); reconcile(); });
        const observer = new ResizeObserver(resize);
        intersection.observe(mount);
        observer.observe(mount);
        motion.addEventListener("change", onMotion);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("resize", resize, { passive: true });
        canvas.addEventListener("webglcontextlost", onContextLost);
        teardown = () => {
          stop();
          intersection.disconnect();
          observer.disconnect();
          motion.removeEventListener("change", onMotion);
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("resize", resize);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          geometrySet.forEach((geometry) => geometry.dispose());
          materialSet.forEach((surface) => surface.dispose());
          textureSet.forEach((texture) => texture.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        };
        resize();
      } catch {
        teardown?.();
        if (!disposed) { setReady(false); setMode("fallback"); }
      }
    };

    const idle = "requestIdleCallback" in window
      ? window.requestIdleCallback(() => { void initialize(); }, { timeout: 1200 })
      : undefined;
    const timer = idle === undefined ? window.setTimeout(() => { void initialize(); }, 80) : undefined;
    return () => {
      disposed = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
      teardown?.();
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-scene" aria-hidden="true" data-mode={mode} data-frame-count="0">
      <div ref={mountRef} className="hero-scene__canvas" style={{ opacity: ready ? 1 : 0 }} />
      {!ready ? <div className="hero-scene__fallback">{heroImages.map((image) => <img key={image} src={image} alt="" decoding="async" />)}</div> : null}
    </div>
  );
}

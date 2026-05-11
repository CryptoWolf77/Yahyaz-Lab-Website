import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { heroImages } from "../data/siteContent";

type FloatingPlane = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> & {
  userData: {
    baseY: number;
    drift: number;
    speed: number;
    rotate: number;
  };
};

const canUseWebGl = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
};

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !canUseWebGl()) {
      setFallback(true);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070713, 0.035);

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const textureLoader = new THREE.TextureLoader();
    const planes: FloatingPlane[] = [];
    const positions = [
      { x: 0, y: 0.65, z: 0.5, w: 3.05, h: 1.55, r: 0 },
      { x: -3.1, y: -0.25, z: -0.9, w: 2.65, h: 1.5, r: -0.2 },
      { x: 3.05, y: -0.1, z: -1.25, w: 2.55, h: 1.45, r: 0.22 },
      { x: -1.35, y: -2.0, z: -2.0, w: 2.35, h: 1.32, r: 0.12 },
      { x: 1.8, y: -1.78, z: -1.7, w: 2.45, h: 1.38, r: -0.16 },
    ];

    heroImages.forEach((src, index) => {
      const texture = textureLoader.load(src);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: index === 0 ? 0.96 : 0.58,
        side: THREE.DoubleSide,
      });
      const data = positions[index];
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(data.w, data.h), material) as FloatingPlane;
      plane.position.set(data.x, data.y, data.z);
      plane.rotation.set(0, 0, data.r);
      plane.userData = {
        baseY: data.y,
        drift: index * 1.6,
        speed: 0.25 + index * 0.03,
        rotate: data.r,
      };
      planes.push(plane);
      group.add(plane);
    });

    const grid = new THREE.GridHelper(12, 18, 0x27f3ff, 0x21334f);
    grid.position.y = -2.65;
    grid.position.z = -2.2;
    grid.rotation.x = Math.PI * 0.5;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.22;
    scene.add(grid);

    const particles = new THREE.BufferGeometry();
    const particleCount = 160;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (Math.random() - 0.5) * 10;
      particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[index * 3 + 2] = -Math.random() * 6;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x6df7ff,
      size: 0.032,
      transparent: true,
      opacity: 0.68,
    });
    const particleField = new THREE.Points(particles, particleMaterial);
    scene.add(particleField);

    let frame = 0;
    let animationId = 0;
    const animate = () => {
      frame += reducedMotion ? 0 : 0.016;
      planes.forEach((plane, index) => {
        plane.position.y = plane.userData.baseY + Math.sin(frame * plane.userData.speed + plane.userData.drift) * 0.12;
        plane.rotation.z = plane.userData.rotate + Math.sin(frame * 0.35 + index) * 0.025;
      });
      if (!reducedMotion) {
        group.rotation.y = Math.sin(frame * 0.24) * 0.09;
        particleField.rotation.z += 0.0009;
        grid.position.x = Math.sin(frame * 0.18) * 0.18;
      }
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      mount.removeChild(renderer.domElement);
      particles.dispose();
      particleMaterial.dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      planes.forEach((plane) => {
        plane.geometry.dispose();
        plane.material.map?.dispose();
        plane.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true">
      <div ref={mountRef} className="hero-scene__canvas" />
      {fallback ? (
        <div className="hero-scene__fallback">
          {heroImages.map((image) => (
            <img key={image} src={image} alt="" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

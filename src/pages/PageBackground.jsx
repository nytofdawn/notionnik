import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

// ─── Lazy Three.js loader ──────────────────────────────────────────────────────
let THREE = null;
async function getThree() {
  if (THREE) return THREE;
  THREE = await import("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js");
  return THREE;
}

// ─── Shared sprite textures ────────────────────────────────────────────────────
function makeCircleTexture(T, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const half = size / 2;
  const grd = ctx.createRadialGradient(half, half, 0, half, half, half);
  grd.addColorStop(0,   "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.8)");
  grd.addColorStop(0.7, "rgba(255,255,255,0.2)");
  grd.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  return new T.CanvasTexture(c);
}

function makeStarTexture(T, size = 64, spikes = 4) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const cx = size / 2, cy = size / 2;
  const outer = size / 2 - 1;
  const inner = outer * 0.18;
  ctx.clearRect(0, 0, size, size);
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, outer);
  grd.addColorStop(0,    "rgba(255,255,255,0.9)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.5)");
  grd.addColorStop(0.6,  "rgba(255,255,255,0.1)");
  grd.addColorStop(1,    "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, outer, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const r = i % 2 === 0 ? outer * 0.88 : inner;
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  return new T.CanvasTexture(c);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DARK MODE — 3D Space fly-through
// ═══════════════════════════════════════════════════════════════════════════════
function SpaceCanvas3D() {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    let T, renderer, scene, camera, animId;
    let scrollZ = 0, targetScrollZ = 0;
    let isAlive = true;

    (async () => {
      T = await getThree();
      const mount = mountRef.current;
      if (!mount || !isAlive) return;

      renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
      document.body.appendChild(renderer.domElement);

      scene  = new T.Scene();
      camera = new T.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 8);

      scene.background = new T.Color(0x0a0108);
      scene.fog = new T.FogExp2(0x0a0108, 0.018);

      const circleTex = makeCircleTexture(T, 64);
      const starTex   = makeStarTexture(T, 64, 4);

      const starLayers = [
        { count: 1200, spread: 60, zRange: 30, size: 0.4 },
        { count: 600,  spread: 40, zRange: 20, size: 0.7 },
        { count: 200,  spread: 25, zRange: 12, size: 1.1 },
      ];
      const starMeshes = starLayers.map(({ count, spread, zRange, size }) => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          pos[i * 3]     = (Math.random() - 0.5) * spread;
          pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
          pos[i * 3 + 2] = (Math.random() - 0.5) * zRange;
        }
        const geo = new T.BufferGeometry();
        geo.setAttribute("position", new T.BufferAttribute(pos, 3));
        const mat = new T.PointsMaterial({
          color: 0xffffff, map: circleTex, size, sizeAttenuation: true,
          transparent: true, opacity: 0.85, depthWrite: false,
          alphaTest: 0.01, blending: T.AdditiveBlending,
        });
        const pts = new T.Points(geo, mat);
        scene.add(pts);
        return pts;
      });

      const nebulaBlobs = [
        { pos: [-4,  2,  -8], col: 0x3c0860, scale: 8  },
        { pos: [ 5, -1, -12], col: 0x1a0550, scale: 10 },
        { pos: [-2, -3,  -6], col: 0x280840, scale: 6  },
        { pos: [ 3,  4, -10], col: 0x460a20, scale: 7  },
      ];
      nebulaBlobs.forEach(({ pos, col, scale }) => {
        const geo = new T.SphereGeometry(scale, 8, 8);
        const mat = new T.MeshBasicMaterial({
          color: col, transparent: true, opacity: 0.18,
          depthWrite: false, side: T.BackSide, blending: T.AdditiveBlending,
        });
        const mesh = new T.Mesh(geo, mat);
        mesh.position.set(...pos);
        scene.add(mesh);
      });

      stateRef.current = { cleanup: null };

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      const onScroll = () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
        targetScrollZ = -pct * 14;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      let t = 0;
      const animate = () => {
        if (!isAlive) return;
        animId = requestAnimationFrame(animate);
        t++;
        scrollZ += (targetScrollZ - scrollZ) * 0.045;
        camera.position.z = 8 + scrollZ;
        camera.position.x = Math.sin(t * 0.0004) * 0.6;
        camera.position.y = Math.cos(t * 0.0003) * 0.4;
        camera.lookAt(0, 0, 0);
        starMeshes[0].rotation.y = t * 0.00008;
        starMeshes[0].rotation.x = t * 0.00004;
        starMeshes[1].rotation.y = t * 0.00015;
        starMeshes[1].rotation.z = t * 0.00006;
        starMeshes[2].rotation.y = t * 0.00025;
        renderer.render(scene, camera);
      };
      animate();

      stateRef.current.cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(animId);
        circleTex.dispose();
        starTex.dispose();
        renderer.dispose();
        if (document.body.contains(renderer.domElement))
          document.body.removeChild(renderer.domElement);
      };
    })();

    return () => {
      isAlive = false;
      stateRef.current?.cleanup?.();
    };
  }, []);

  return <div ref={mountRef} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHT MODE — Underwater diver POV 3D fly-through
//
// Architecture is a 1-to-1 mirror of SpaceCanvas3D:
//   starLayers      → waterLayers   (plankton / sediment / bubbles)
//   nebulaBlobs     → deepBlobs     (large teal/indigo volumetric spheres)
//   starMeshes.rotation → particleMeshes.rotation  (parallax at 3 speeds)
//   camera drift    → diver drift   (same sine pattern + breath layer)
//   scroll dolly    → identical
//
// Extra layer unique to water: god-ray group that slowly rotates as one unit,
// giving the sense of filtered surface light swinging overhead.
// ═══════════════════════════════════════════════════════════════════════════════
function UnderwaterCanvas3D() {
  const stateRef = useRef(null);

  useEffect(() => {
    let T, renderer, scene, camera, animId;
    let scrollZ = 0, targetScrollZ = 0;
    let isAlive = true;

    (async () => {
      T = await getThree();
      if (!isAlive) return;

      // ── Renderer — identical setup to dark mode ────────────────────────
      renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
      document.body.appendChild(renderer.domElement);

      // ── Scene & camera — mirrors dark mode ─────────────────────────────
      scene  = new T.Scene();
      camera = new T.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 300);
      camera.position.set(0, 0, 8);

      // Deep ocean: very dark teal (analogous to dark mode's near-black)
      scene.background = new T.Color(0x011a26);
      // Water fog: absorbs light with depth (analogous to space fog)
      scene.fog = new T.FogExp2(0x011520, 0.020);

      // ── Textures ───────────────────────────────────────────────────────
      const circleTex = makeCircleTexture(T, 64);

      // Hollow-ring bubble sprite
      const makeBubbleTex = () => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const ctx = c.getContext("2d");
        const half = 32;
        const grd = ctx.createRadialGradient(half, half, half * 0.5, half, half, half);
        grd.addColorStop(0,    "rgba(255,255,255,0)");
        grd.addColorStop(0.55, "rgba(180,240,255,0.4)");
        grd.addColorStop(0.82, "rgba(255,255,255,0.9)");
        grd.addColorStop(1,    "rgba(255,255,255,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 64, 64);
        return new T.CanvasTexture(c);
      };
      const bubbleTex = makeBubbleTex();

      // God-ray beam texture (vertical gradient strip)
      const makeRayTex = () => {
        const c = document.createElement("canvas");
        c.width = 32; c.height = 256;
        const ctx = c.getContext("2d");
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0,    "rgba(140,250,255,0.75)");
        g.addColorStop(0.25, "rgba(80,220,240,0.38)");
        g.addColorStop(0.65, "rgba(30,180,210,0.10)");
        g.addColorStop(1,    "rgba(0,150,190,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 32, 256);
        return new T.CanvasTexture(c);
      };
      const rayTex = makeRayTex();

      // ── WATER PARTICLE LAYERS (= star layers in dark mode) ─────────────
      // 3 layers at different depths/speeds — creates the same parallax feel
      const waterLayerDefs = [
        // Layer 0: Far plankton — many, wide spread, tiny, slow (= distant stars)
        { count: 1200, spread: 65, yRange: 40, zRange: 70,
          size: 0.22, color: 0x38d8d0, opacity: 0.60, tex: circleTex,
          rotY:  0.000080, rotX:  0.000040 },
        // Layer 1: Mid sediment — medium, medium spread (= mid stars)
        { count: 600,  spread: 44, yRange: 28, zRange: 48,
          size: 0.42, color: 0x70f0e8, opacity: 0.50, tex: circleTex,
          rotY:  0.000150, rotZ:  0.000060 },
        // Layer 2: Close bubbles — few, narrow, large, fast (= bright foreground stars)
        { count: 200,  spread: 22, yRange: 16, zRange: 24,
          size: 0.85, color: 0xe0fcff, opacity: 0.70, tex: bubbleTex,
          rotY:  0.000250, rotX: -0.000000 },
      ];

      const particleMeshes = waterLayerDefs.map(def => {
        const pos = new Float32Array(def.count * 3);
        for (let i = 0; i < def.count; i++) {
          pos[i * 3]     = (Math.random() - 0.5) * def.spread;
          pos[i * 3 + 1] = (Math.random() - 0.5) * def.yRange;
          pos[i * 3 + 2] = (Math.random() - 0.5) * def.zRange;
        }
        const geo = new T.BufferGeometry();
        geo.setAttribute("position", new T.BufferAttribute(pos, 3));
        const mat = new T.PointsMaterial({
          color: def.color,
          map: def.tex,
          size: def.size,
          sizeAttenuation: true,
          transparent: true,
          opacity: def.opacity,
          depthWrite: false,
          alphaTest: 0.01,
          blending: T.AdditiveBlending,
        });
        const pts = new T.Points(geo, mat);
        scene.add(pts);
        return { pts, def };
      });

      // ── DEEP WATER BLOBS (= nebula blobs in dark mode) ─────────────────
      // Large translucent back-side spheres that colour the deep water,
      // exactly like the purple/indigo nebulae colour deep space.
      const deepBlobs = [
        { pos: [ -7,  3, -28], col: 0x004466, scale: 16 },
        { pos: [  9, -3, -48], col: 0x003355, scale: 22 },
        { pos: [ -4, -6, -18], col: 0x005060, scale: 12 },
        { pos: [  6,  5, -38], col: 0x002244, scale: 18 },
      ];
      deepBlobs.forEach(({ pos, col, scale }) => {
        const geo = new T.SphereGeometry(scale, 8, 8);
        const mat = new T.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0.20,
          depthWrite: false,
          side: T.BackSide,
          blending: T.AdditiveBlending,
        });
        const mesh = new T.Mesh(geo, mat);
        mesh.position.set(...pos);
        scene.add(mesh);
      });

      // ── GOD-RAY GROUP (rotates as a single unit — extra water layer) ───
      // 12 additive planes fanned above camera in a circle.
      // The whole group rotates slowly, making rays sweep like surface light.
      const rayGroup = new T.Group();
      rayGroup.position.set(0, 0, -8);
      scene.add(rayGroup);

      const rayMeshes = [];
      const RAY_N = 12;
      for (let i = 0; i < RAY_N; i++) {
        const w = 0.6 + Math.random() * 1.8;
        const h = 30 + Math.random() * 20;
        const geo = new T.PlaneGeometry(w, h);
        const mat = new T.MeshBasicMaterial({
          map: rayTex,
          transparent: true,
          opacity: 0.10 + Math.random() * 0.16,
          depthWrite: false,
          side: T.DoubleSide,
          blending: T.AdditiveBlending,
        });
        const mesh = new T.Mesh(geo, mat);
        const angle  = (i / RAY_N) * Math.PI * 2;
        const radius = 3 + Math.random() * 6;
        mesh.position.set(
          Math.cos(angle) * radius,
          14 - h / 2,
          Math.sin(angle) * radius
        );
        mesh.rotation.x = -0.1 + (Math.random() - 0.5) * 0.18;
        mesh.rotation.y = angle;
        mesh.userData.baseOp    = mat.opacity;
        mesh.userData.pulsePhase = Math.random() * Math.PI * 2;
        rayGroup.add(mesh);
        rayMeshes.push(mesh);
      }

      // ── Resize ─────────────────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      // ── Scroll dolly — identical to dark mode ──────────────────────────
      const onScroll = () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
        targetScrollZ = -pct * 14;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // ── Animate — mirrors dark mode loop exactly ───────────────────────
      let t = 0;
      const animate = () => {
        if (!isAlive) return;
        animId = requestAnimationFrame(animate);
        t++;

        // Camera dolly — identical to dark mode
        scrollZ += (targetScrollZ - scrollZ) * 0.045;
        camera.position.z = 8 + scrollZ;

        // Diver drift — same sine pattern as dark mode camera drift
        // + extra high-freq component simulates breathing
        camera.position.x = Math.sin(t * 0.0004) * 0.6;
        camera.position.y = Math.cos(t * 0.0003) * 0.4
                          + Math.sin(t * 0.0009) * 0.10;
        camera.lookAt(0, 0, 0);

        // Particle layer rotations — same speed ratios as dark mode stars
        // Layer 0 (far plankton) — slowest, like distant stars
        particleMeshes[0].pts.rotation.y = t * 0.000080;
        particleMeshes[0].pts.rotation.x = t * 0.000040;
        // Layer 1 (mid sediment) — medium
        particleMeshes[1].pts.rotation.y = t * 0.000150;
        particleMeshes[1].pts.rotation.z = t * 0.000060;
        // Layer 2 (close bubbles) — fastest, most parallax
        particleMeshes[2].pts.rotation.y = t * 0.000250;

        // God-ray group rotates slowly (analogous to nebula blob positions shifting)
        rayGroup.rotation.y = t * 0.000038;
        rayGroup.rotation.z = t * 0.000016;

        // Ray pulse — each beam brightens and dims
        rayMeshes.forEach(mesh => {
          mesh.material.opacity =
            mesh.userData.baseOp *
            (0.65 + 0.35 * Math.sin(t * 0.020 + mesh.userData.pulsePhase));
        });

        renderer.render(scene, camera);
      };
      animate();

      stateRef.current = {
        cleanup: () => {
          window.removeEventListener("resize", onResize);
          window.removeEventListener("scroll", onScroll);
          cancelAnimationFrame(animId);
          circleTex.dispose();
          bubbleTex.dispose();
          rayTex.dispose();
          renderer.dispose();
          if (document.body.contains(renderer.domElement))
            document.body.removeChild(renderer.domElement);
        },
      };
    })();

    return () => {
      isAlive = false;
      stateRef.current?.cleanup?.();
    };
  }, []);

  return null;
}

// ─── PageBackground ────────────────────────────────────────────────────────────
export default function PageBackground() {
  const { isDark } = useTheme();
  return isDark ? <SpaceCanvas3D /> : <UnderwaterCanvas3D />;
}
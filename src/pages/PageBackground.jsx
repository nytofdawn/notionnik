import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

// ─── Water Background ─────────────────────────────────────────────────────────
function WaterCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const waves = [
      { amp: 0.07, freq: 0.010, speed: 0.016, alpha: 0.22, color: "#0097a7" },
      { amp: 0.05, freq: 0.016, speed: 0.022, alpha: 0.18, color: "#006064" },
      { amp: 0.06, freq: 0.008, speed: 0.011, alpha: 0.15, color: "#4dd0e1" },
      { amp: 0.04, freq: 0.020, speed: 0.030, alpha: 0.12, color: "#00838f" },
      { amp: 0.03, freq: 0.026, speed: 0.038, alpha: 0.10, color: "#00e5ff" },
    ];

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#00F0FF");
      bg.addColorStop(1, "#B0E0E6");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      waves.forEach((wave, wi) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 3) {
          const y =
            height * 0.5 +
            Math.sin(x * wave.freq + t * wave.speed + wi * 1.3) * height * wave.amp +
            Math.sin(x * wave.freq * 0.6 + t * wave.speed * 0.8 + wi * 0.7) * height * wave.amp * 0.4;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0,    wave.color + "00");
        grad.addColorStop(0.35, wave.color + Math.round(wave.alpha * 255).toString(16).padStart(2, "0"));
        grad.addColorStop(1,    wave.color + "44");
        ctx.fillStyle = grad;
        ctx.fill();
      });

      ctx.globalAlpha = 0.055;
      for (let i = 0; i < 10; i++) {
        const y = (height / 10) * i + 20 + Math.sin(t * 0.018 + i * 0.9) * 12;
        const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
        lineGrad.addColorStop(0,    "transparent");
        lineGrad.addColorStop(0.25, "#ffffff");
        lineGrad.addColorStop(0.75, "#00e5ff");
        lineGrad.addColorStop(1,    "transparent");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= width; x += 4) {
          ctx.lineTo(x, y + Math.sin(x * 0.018 + t * 0.025 + i) * 5);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0,
      width: "100vw", height: "100vh",
      zIndex: -1, pointerEvents: "none",
    }} />
  );
}

// ─── Space Background ─────────────────────────────────────────────────────────
function SpaceCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const makeStars = (count, speed, minR, maxR) =>
      Array.from({ length: count }, () => ({
        x: Math.random(), y: Math.random(),
        r: minR + Math.random() * (maxR - minR),
        alpha: 0.3 + Math.random() * 0.7,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed:  0.008 + Math.random() * 0.025,
        speed,
        color: Math.random() > 0.88 ? (Math.random() > 0.5 ? "#a0d8ff" : "#ffcba0") : "#ffffff",
      }));

    const starsNear = makeStars(70,  0.00022,  1.2, 2.4);
    const starsMid  = makeStars(160, 0.00010,  0.6, 1.3);
    const starsFar  = makeStars(300, 0.000035, 0.2, 0.7);

    const nebulae = [
      { x: 0.40, y: 0.30, rx: 0.45, ry: 0.28, r: 60,  g: 8,  b: 18, a: 0.22 },
      { x: 0.60, y: 0.45, rx: 0.35, ry: 0.22, r: 45,  g: 5,  b: 25, a: 0.16 },
      { x: 0.20, y: 0.20, rx: 0.30, ry: 0.18, r: 30,  g: 3,  b: 40, a: 0.12 },
      { x: 0.80, y: 0.60, rx: 0.28, ry: 0.20, r: 70,  g: 10, b: 15, a: 0.10 },
      { x: 0.15, y: 0.70, rx: 0.25, ry: 0.18, r: 20,  g: 5,  b: 35, a: 0.10 },
      { x: 0.70, y: 0.15, rx: 0.22, ry: 0.15, r: 55,  g: 0,  b: 20, a: 0.09 },
    ];

    const shooters = Array.from({ length: 3 }, () => ({
      active: false, cooldown: 200 + Math.floor(Math.random() * 400),
      x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0,
    }));
    const launch = (s) => {
      s.active = true;
      s.x = Math.random() * 0.7; s.y = Math.random() * 0.5;
      s.vx = 0.0025 + Math.random() * 0.004;
      s.vy = 0.001  + Math.random() * 0.002;
      s.life = 0; s.maxLife = 35 + Math.floor(Math.random() * 35);
    };

    const drawStar = (x, y, r, alpha, color) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (r > 1.4) {
        ctx.globalAlpha = alpha * 0.25;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - r * 3, y); ctx.lineTo(x + r * 3, y);
        ctx.moveTo(x, y - r * 3); ctx.lineTo(x, y + r * 3);
        ctx.stroke();
      }
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(
        width * 0.48, height * 0.38, 0,
        width * 0.48, height * 0.38, Math.max(width, height) * 0.72
      );
      bg.addColorStop(0,    "#1c080e");
      bg.addColorStop(0.30, "#110510");
      bg.addColorStop(0.60, "#080310");
      bg.addColorStop(1,    "#020108");
      ctx.globalAlpha = 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      nebulae.forEach((n) => {
        const nx = (n.x + Math.sin(t * 0.00025 + n.x * 4) * 0.012) * width;
        const ny = (n.y + Math.cos(t * 0.00018 + n.y * 4) * 0.010) * height;
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.rx * width);
        grad.addColorStop(0,   `rgba(${n.r},${n.g},${n.b},${n.a})`);
        grad.addColorStop(0.5, `rgba(${n.r},${n.g},${n.b},${(n.a * 0.4).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${n.r},${n.g},${n.b},0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(nx, ny, n.rx * width, n.ry * height, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      [starsFar, starsMid, starsNear].forEach((layer) =>
        layer.forEach((s) => {
          s.x += s.speed; if (s.x > 1) s.x -= 1;
          const tw = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
          drawStar(s.x * width, s.y * height, s.r, s.alpha * tw, s.color);
        })
      );

      ctx.globalAlpha = 1;
      shooters.forEach((s) => {
        if (!s.active) {
          s.cooldown--;
          if (s.cooldown <= 0) { launch(s); s.cooldown = 280 + Math.floor(Math.random() * 450); }
        } else {
          s.life++;
          const p  = s.life / s.maxLife;
          const al = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
          const sx = s.x * width, sy = s.y * height;
          const ex = sx + s.vx * s.life * width  * 0.55;
          const ey = sy + s.vy * s.life * height * 0.55;
          const tr = ctx.createLinearGradient(sx, sy, ex, ey);
          tr.addColorStop(0,   "rgba(255,255,255,0)");
          tr.addColorStop(0.6, `rgba(220,200,255,${(al * 0.35).toFixed(3)})`);
          tr.addColorStop(1,   `rgba(255,255,255,${al.toFixed(3)})`);
          ctx.strokeStyle = tr; ctx.lineWidth = 1.5; ctx.globalAlpha = 1;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
          if (s.life >= s.maxLife) s.active = false;
        }
      });

      ctx.globalAlpha = 1;
      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0,
      width: "100vw", height: "100vh",
      zIndex: -1, pointerEvents: "none",
    }} />
  );
}

// ─── PageBackground — auto-switches based on theme ────────────────────────────
export default function PageBackground() {
  const { isDark } = useTheme();
  return isDark ? <SpaceCanvas /> : <WaterCanvas />;
}
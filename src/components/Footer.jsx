import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTheme } from "../pages/ThemeContext";
// ─── Sand Canvas (Light Mode) ─────────────────────────────────────────────────
function SandCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const grains = Array.from({ length: 420 }, () => ({
      x:       Math.random(),
      y:       Math.random(),
      r:       0.6 + Math.random() * 1.4,
      opacity: 0.08 + Math.random() * 0.18,
      drift:   Math.random() * Math.PI * 2,
      speed:   0.003 + Math.random() * 0.006,
    }));

    const ripples = Array.from({ length: 9 }, (_, i) => ({
      y:       0.1 + (i / 9) * 0.85,
      amp:     1.5 + Math.random() * 3,
      freq:    0.006 + Math.random() * 0.008,
      speed:   0.004 + Math.random() * 0.006,
      offset:  Math.random() * Math.PI * 2,
      opacity: 0.07 + Math.random() * 0.1,
    }));

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0,   "#f5deb3");
      bg.addColorStop(0.3, "#e8c98a");
      bg.addColorStop(0.7, "#d4aa6a");
      bg.addColorStop(1,   "#c8975a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const radial = ctx.createRadialGradient(width * 0.35, height * 0.3, 0, width * 0.35, height * 0.3, width * 0.6);
      radial.addColorStop(0, "rgba(255,220,130,0.35)");
      radial.addColorStop(1, "rgba(255,220,130,0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      ripples.forEach((ripple) => {
        const y = ripple.y * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= width; x += 3) {
          ctx.lineTo(x, y + Math.sin(x * ripple.freq + t * ripple.speed + ripple.offset) * ripple.amp);
        }
        const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
        lineGrad.addColorStop(0,   "rgba(120,80,20,0)");
        lineGrad.addColorStop(0.2, `rgba(120,80,20,${ripple.opacity})`);
        lineGrad.addColorStop(0.8, `rgba(120,80,20,${ripple.opacity})`);
        lineGrad.addColorStop(1,   "rgba(120,80,20,0)");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, y + 2);
        for (let x = 0; x <= width; x += 3) {
          ctx.lineTo(x, y + 2 + Math.sin(x * ripple.freq + t * ripple.speed + ripple.offset) * ripple.amp);
        }
        ctx.strokeStyle = `rgba(180,130,60,${ripple.opacity * 0.4})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      grains.forEach((g) => {
        const x = (g.x + Math.sin(g.drift + t * g.speed) * 0.004) * canvas.width;
        const y = (g.y + Math.cos(g.drift + t * g.speed * 0.5) * 0.002) * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,95,40,${g.opacity})`;
        ctx.fill();
      });

      const sheen = ctx.createLinearGradient(0, 0, 0, height * 0.3);
      sheen.addColorStop(0, "rgba(255,245,210,0.25)");
      sheen.addColorStop(1, "rgba(255,245,210,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, width, height * 0.3);

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
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      display: "block", pointerEvents: "none",
    }} />
  );
}

// ─── Space Canvas (Dark Mode) ─────────────────────────────────────────────────
function SpaceCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const makeStars = (count, speed, minR, maxR) =>
      Array.from({ length: count }, () => ({
        x:             Math.random(),
        y:             Math.random(),
        r:             minR + Math.random() * (maxR - minR),
        alpha:         0.3 + Math.random() * 0.7,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed:  0.008 + Math.random() * 0.025,
        speed,
        color: Math.random() > 0.88 ? (Math.random() > 0.5 ? "#a0d8ff" : "#ffcba0") : "#ffffff",
      }));

    const starsNear = makeStars(40,  0.00022,  1.0, 2.0);
    const starsMid  = makeStars(90,  0.00010,  0.5, 1.1);
    const starsFar  = makeStars(160, 0.000035, 0.2, 0.6);

    const nebulae = [
      { x: 0.40, y: 0.40, rx: 0.50, ry: 0.40, r: 60,  g: 8,  b: 18, a: 0.20 },
      { x: 0.70, y: 0.50, rx: 0.40, ry: 0.35, r: 45,  g: 5,  b: 25, a: 0.14 },
      { x: 0.20, y: 0.30, rx: 0.35, ry: 0.30, r: 30,  g: 3,  b: 40, a: 0.10 },
    ];

    const drawStar = (x, y, r, alpha, color) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (r > 1.2) {
        ctx.globalAlpha = alpha * 0.2;
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

      // Deep space base
      const bg = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.4, Math.max(width, height) * 0.8);
      bg.addColorStop(0,    "#1c080e");
      bg.addColorStop(0.40, "#110510");
      bg.addColorStop(0.70, "#080310");
      bg.addColorStop(1,    "#020108");
      ctx.globalAlpha = 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Nebula glows
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
          s.x += s.speed;
          if (s.x > 1) s.x -= 1;
          const tw = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
          drawStar(s.x * width, s.y * height, s.r, s.alpha * tw, s.color);
        })
      );

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
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      display: "block", pointerEvents: "none",
    }} />
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const { isDark } = useTheme();

  const textMain = isDark ? "text-white/80"  : "text-amber-900";
  const textSub  = isDark ? "text-white/40"  : "text-amber-800/70";
  const textLink = isDark ? "text-white/50 hover:text-white" : "text-amber-900/70 hover:text-amber-950";
  const border   = isDark ? "border-white/10" : "border-amber-300/60";
  const iconBg   = isDark ? "bg-white/8 border-white/15" : "bg-amber-100/60 border-amber-300";
  const iconFill = isDark ? "fill-white/60 group-hover:fill-white" : "fill-amber-900 group-hover:fill-white";

  return (
    <footer className={`relative border-t py-8 px-4 sm:px-6 overflow-hidden ${border}`}>

      {/* Theme-aware canvas background */}
      {isDark ? <SpaceCanvas /> : <SandCanvas />}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">

        {/* Logo + Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <div className="flex items-center gap-2">
            <img src="/notionnik.svg" alt="Notionnik Logo" className="h-8 w-auto object-contain" />
            <span className={`font-bold text-xl tracking-wide ${textMain}`}>Notionnik</span>
          </div>
          <p className={`text-sm mt-1 ${textSub}`}>
            © {new Date().getFullYear()} Notionnik. All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 text-sm">
          {[
            { label: "Dashboard",    to: "/" },
            { label: "About Us",     to: "/about" },
            { label: "Services",     to: "/services" },
            { label: "Case Studies", to: "/case-studies" },
            { label: "Book Now",     to: "/book" },
          ].map((link) => (
            <Link key={link.label} to={link.to}
              className={`font-medium transition-colors duration-200 ${textLink}`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center gap-2">
          <p className={`text-sm font-semibold tracking-wide uppercase ${textMain}`}>Follow Us</p>
          <div className="flex gap-3 flex-wrap justify-center">

            {/* Facebook */}
            <a href="https://www.facebook.com/notionnik/"
              target="_blank" rel="noopener noreferrer"
              className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-blue-500 ${iconBg}`}
              aria-label="Facebook">
              <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H8.08V12h2.36v-2.05c0-2.33 1.39-3.62 3.51-3.62.69 0 1.53.12 2.22.24v2.44h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89h-2.3v6.99A10 10 0 0 0 22 12z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/103721418/admin/dashboard/LinkedIn"
              target="_blank" rel="noopener noreferrer"
              className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-blue-600 ${iconBg}`}
              aria-label="LinkedIn">
              <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/>
              </svg>
            </a>

            {/* Upwork */}
            <a href="https://www.upwork.com/agencies/1768339692736311296/"
              target="_blank" rel="noopener noreferrer"
              className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-green-500 ${iconBg}`}
              aria-label="Upwork">
              <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M18.56 12.67c-1.1 0-2.13-.42-2.93-1.09l.22-1.02.01-.07c.19-1.07.78-2.87 2.7-2.87a2.53 2.53 0 0 1 2.53 2.53 2.53 2.53 0 0 1-2.53 2.52zm0-7.1c-2.6 0-4.63 1.7-5.48 4.46-.79-1.41-1.39-3.1-1.74-4.53H8.87v5.5a2.36 2.36 0 0 1-2.35 2.35 2.36 2.36 0 0 1-2.36-2.35V5.5H1.69v5.5a4.84 4.84 0 0 0 4.83 4.84 4.84 4.84 0 0 0 4.84-4.84v-.92c.34.73.76 1.47 1.25 2.14L10.9 18.5h2.42l1.09-4.01c.96.62 2.07.98 3.24.98 3.05 0 5.2-2.23 5.2-5.02a5.02 5.02 0 0 0-5.02-5.02z" />
              </svg>
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
}
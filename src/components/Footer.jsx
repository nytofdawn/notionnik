import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

// ─── Sand Texture Canvas ──────────────────────────────────────────────────────
function SandCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Pre-generate random sand grain positions
    const grains = Array.from({ length: 420 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      opacity: 0.08 + Math.random() * 0.18,
      drift: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.006,
    }));

    // Pre-generate ripple lines (wind-blown sand patterns)
    const ripples = Array.from({ length: 9 }, (_, i) => ({
      y: 0.1 + (i / 9) * 0.85,
      amp: 1.5 + Math.random() * 3,
      freq: 0.006 + Math.random() * 0.008,
      speed: 0.004 + Math.random() * 0.006,
      offset: Math.random() * Math.PI * 2,
      opacity: 0.07 + Math.random() * 0.1,
    }));

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Base sand gradient
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0,   "#f5deb3"); // wheat
      bg.addColorStop(0.3, "#e8c98a"); // sandy
      bg.addColorStop(0.7, "#d4aa6a"); // darker sand
      bg.addColorStop(1,   "#c8975a"); // warm tan
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle radial warmth spot (like sunlight hitting sand)
      const radial = ctx.createRadialGradient(width * 0.35, height * 0.3, 0, width * 0.35, height * 0.3, width * 0.6);
      radial.addColorStop(0, "rgba(255,220,130,0.35)");
      radial.addColorStop(1, "rgba(255,220,130,0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Wind ripple lines (dune-like horizontal striations)
      ripples.forEach((ripple) => {
        const y = ripple.y * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= width; x += 3) {
          const wy = y + Math.sin(x * ripple.freq + t * ripple.speed + ripple.offset) * ripple.amp;
          ctx.lineTo(x, wy);
        }
        // Thin dune ridge
        const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
        lineGrad.addColorStop(0,   "rgba(120,80,20,0)");
        lineGrad.addColorStop(0.2, `rgba(120,80,20,${ripple.opacity})`);
        lineGrad.addColorStop(0.8, `rgba(120,80,20,${ripple.opacity})`);
        lineGrad.addColorStop(1,   "rgba(120,80,20,0)");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Soft shadow below each ridge
        ctx.beginPath();
        ctx.moveTo(0, y + 2);
        for (let x = 0; x <= width; x += 3) {
          const wy = y + 2 + Math.sin(x * ripple.freq + t * ripple.speed + ripple.offset) * ripple.amp;
          ctx.lineTo(x, wy);
        }
        ctx.strokeStyle = `rgba(180,130,60,${ripple.opacity * 0.4})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      // Drifting sand grains
      grains.forEach((g) => {
        const x = (g.x + Math.sin(g.drift + t * g.speed) * 0.004) * canvas.width;
        const y = (g.y + Math.cos(g.drift + t * g.speed * 0.5) * 0.002) * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,95,40,${g.opacity})`;
        ctx.fill();
      });

      // Subtle top sheen (light catching the top of dunes)
      const sheen = ctx.createLinearGradient(0, 0, 0, height * 0.3);
      sheen.addColorStop(0,   "rgba(255,245,210,0.25)");
      sheen.addColorStop(1,   "rgba(255,245,210,0)");
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
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="relative border-t border-amber-300/60 text-black py-8 px-4 sm:px-6 overflow-hidden">

      {/* Sand canvas background */}
      <SandCanvas />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">

        {/* Logo + Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <div className="flex items-center gap-2">
            <img
              src="/notionnik.svg"
              alt="Notionnik Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-bold text-xl tracking-wide text-amber-900">
              Notionnik
            </span>
          </div>
          <p className="text-amber-800/70 text-sm mt-1">
            © 2026 Notionnik. All rights reserved.
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
            <Link
              key={link.label}
              to={link.to}
              className="text-amber-900/70 hover:text-amber-950 font-medium transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-amber-800 text-sm font-semibold tracking-wide uppercase">
            Follow Us
          </p>
          <div className="flex gap-3 flex-wrap justify-center">

            {/* Facebook */}
            <a
              href="https://www.facebook.com/notionnik/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-100/60 hover:bg-blue-500 border border-amber-300 rounded-xl p-3 transition-all duration-200 hover:-translate-y-1 group shadow-sm"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 fill-amber-900 group-hover:fill-white transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H8.08V12h2.36v-2.05c0-2.33 1.39-3.62 3.51-3.62.69 0 1.53.12 2.22.24v2.44h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89h-2.3v6.99A10 10 0 0 0 22 12z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/103721418/admin/dashboard/LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-100/60 hover:bg-blue-600 border border-amber-300 rounded-xl p-3 transition-all duration-200 hover:-translate-y-1 group shadow-sm"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 fill-amber-900 group-hover:fill-white transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/>
              </svg>
            </a>

            {/* Upwork */}
            <a
              href="https://www.upwork.com/agencies/1768339692736311296/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-100/60 hover:bg-green-500 border border-amber-300 rounded-xl p-3 transition-all duration-200 hover:-translate-y-1 group shadow-sm"
              aria-label="Upwork"
            >
              <svg className="w-5 h-5 fill-amber-900 group-hover:fill-white transition-colors duration-200"
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
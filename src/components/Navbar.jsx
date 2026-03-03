import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// ─── Cloud Canvas Background ──────────────────────────────────────────────────
function CloudCanvas() {
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

    // Cloud puffs — each is a cluster of circles
    const clouds = Array.from({ length: 6 }, (_, i) => ({
      x: (i / 6) * 1.3 - 0.1,
      y: 0.1 + Math.random() * 0.75,
      speed: 0.00015 + Math.random() * 0.0002,
      scale: 0.5 + Math.random() * 0.8,
      opacity: 0.55 + Math.random() * 0.35,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        dx: (Math.random() - 0.5) * 60,
        dy: (Math.random() - 0.5) * 20,
        r: 18 + Math.random() * 22,
      })),
    }));

    const drawCloud = (cx, cy, puffs, scale, opacity) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      puffs.forEach(({ dx, dy, r }) => {
        const grad = ctx.createRadialGradient(
          cx + dx * scale, cy + dy * scale, 0,
          cx + dx * scale, cy + dy * scale, r * scale
        );
        grad.addColorStop(0,   "rgba(255,255,255,0.95)");
        grad.addColorStop(0.6, "rgba(230,240,255,0.7)");
        grad.addColorStop(1,   "rgba(200,220,255,0)");
        ctx.beginPath();
        ctx.arc(cx + dx * scale, cy + dy * scale, r * scale, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      ctx.restore();
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0,   "#1a6fc4");
      sky.addColorStop(0.5, "#3b9de8");
      sky.addColorStop(1,   "#7ec8f5");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // Subtle sun rays at top-right
      ctx.save();
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 8; i++) {
        const angle = -0.3 + i * 0.12;
        ctx.beginPath();
        ctx.moveTo(width * 0.85, -10);
        ctx.lineTo(
          width * 0.85 + Math.cos(angle) * width * 1.5,
          -10 + Math.sin(angle) * height * 3
        );
        ctx.lineWidth = 30;
        ctx.strokeStyle = "rgba(255,255,200,1)";
        ctx.stroke();
      }
      ctx.restore();

      // Draw drifting clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > 1.2) cloud.x = -0.3;
        const cx = cloud.x * width;
        const cy = cloud.y * height;
        drawCloud(cx, cy, cloud.puffs, cloud.scale, cloud.opacity);
      });

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

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "About Us",     to: "/about" },
    { label: "Services",     to: "/services" },
    { label: "Case Studies", to: "/case-studies" },
  ];

  return (
    <nav className="relative overflow-hidden shadow-xl" style={{ minHeight: "68px" }}>

      {/* Sky + cloud canvas */}
      <CloudCanvas />

      {/* Frosted cloud-glass bar */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center"
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/notionnik.svg"
            alt="Notionnik Logo"
            className="h-8 w-auto object-contain drop-shadow-md"
          />
          <span
            className="font-bold text-xl tracking-wide"
            style={{
              color: "white",
              textShadow: "0 1px 8px rgba(30,100,200,0.5)",
            }}
          >
            Notionnik
          </span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">

          {/* Nav pill — looks like a cloud shape */}
          <div
            className="flex items-center gap-1 px-3 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,0.6)",
              boxShadow: "0 4px 20px rgba(100,160,255,0.2), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `font-semibold text-sm px-4 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md"
                      : "text-white hover:bg-white/30 hover:text-white"
                  }`
                }
                style={({ isActive }) => ({
                  textShadow: isActive ? "none" : "0 1px 4px rgba(20,80,180,0.4)",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Book Now — bright cloud button */}
          <NavLink
            to="/book"
            className={({ isActive }) =>
              `font-bold px-5 py-2 rounded-full transition-all duration-200 shadow-lg ${
                isActive ? "bg-sky-100 text-sky-800" : "hover:scale-105"
              }`
            }
            style={({ isActive }) => ({
              background: isActive
                ? undefined
                : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(220,240,255,0.9))",
              color: isActive ? undefined : "#1a5faa",
              boxShadow: "0 4px 14px rgba(100,160,255,0.35), inset 0 1px 0 rgba(255,255,255,0.9)",
              border: "1.5px solid rgba(255,255,255,0.8)",
              textShadow: "none",
            })}
          >
            ☁️ Book Now
          </NavLink>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
          style={{ color: "white", filter: "drop-shadow(0 1px 3px rgba(0,60,180,0.4))" }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="relative z-10 md:hidden px-4 pb-4">
          <div
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(16px)",
              border: "1.5px solid rgba(255,255,255,0.55)",
              boxShadow: "0 8px 32px rgba(80,140,255,0.2)",
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md"
                      : "text-white hover:bg-white/30"
                  }`
                }
                style={({ isActive }) => ({
                  textShadow: isActive ? "none" : "0 1px 4px rgba(20,80,180,0.4)",
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-1 font-bold text-center px-4 py-2.5 rounded-full transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(220,240,255,0.9))",
                color: "#1a5faa",
                boxShadow: "0 4px 14px rgba(100,160,255,0.3)",
                border: "1.5px solid rgba(255,255,255,0.8)",
              }}
            >
              ☁️ Book Now
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
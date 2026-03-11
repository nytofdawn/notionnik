import { useState, useEffect, useRef } from "react";
import { useTheme } from "../pages/ThemeContext";

// ─── Cloud Canvas Background ──────────────────────────────────────────────────
function CloudCanvas({ isDark }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const clouds = Array.from({ length: 6 }, (_, i) => ({
      x: (i / 6) * 1.3 - 0.1,
      y: 0.1 + Math.random() * 0.75,
      speed: 0.00015 + Math.random() * 0.0002,
      scale: 0.5 + Math.random() * 0.8,
      opacity: 0.55 + Math.random() * 0.35,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        dx: (Math.random() - 0.5) * 60,
        dy: (Math.random() - 0.5) * 20,
        r:  18 + Math.random() * 22,
      })),
    }));

    const drawCloud = (cx, cy, puffs, scale, opacity) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      puffs.forEach(({ dx, dy, r }) => {
        const grad = ctx.createRadialGradient(cx + dx*scale, cy + dy*scale, 0, cx + dx*scale, cy + dy*scale, r*scale);
        if (isDark) {
          grad.addColorStop(0,   "rgba(80,50,140,0.55)");
          grad.addColorStop(0.6, "rgba(40,15,80,0.25)");
          grad.addColorStop(1,   "rgba(20,5,40,0)");
        } else {
          grad.addColorStop(0,   "rgba(255,255,255,0.95)");
          grad.addColorStop(0.6, "rgba(230,240,255,0.7)");
          grad.addColorStop(1,   "rgba(200,220,255,0)");
        }
        ctx.beginPath();
        ctx.arc(cx + dx*scale, cy + dy*scale, r*scale, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      ctx.restore();
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      if (isDark) {
        const sky = ctx.createLinearGradient(0, 0, 0, height);
        sky.addColorStop(0, "#0d0510"); sky.addColorStop(1, "#1c0818");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, height);
        sky.addColorStop(0, "#1a6fc4"); sky.addColorStop(0.5, "#3b9de8"); sky.addColorStop(1, "#7ec8f5");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
        ctx.save(); ctx.globalAlpha = 0.06;
        for (let i = 0; i < 8; i++) {
          const angle = -0.3 + i * 0.12;
          ctx.beginPath(); ctx.moveTo(width * 0.85, -10);
          ctx.lineTo(width * 0.85 + Math.cos(angle) * width * 1.5, -10 + Math.sin(angle) * height * 3);
          ctx.lineWidth = 30; ctx.strokeStyle = "rgba(255,255,200,1)"; ctx.stroke();
        }
        ctx.restore();
      }
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > 1.2) cloud.x = -0.3;
        drawCloud(cloud.x * width, cloud.y * height, cloud.puffs, cloud.scale, cloud.opacity);
      });
      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [isDark]);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      display: "block", pointerEvents: "none",
    }} />
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Light" : "Switch to Dark"}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "6px 12px", borderRadius: "999px",
        border: "1.5px solid rgba(255,255,255,0.4)",
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(12px)",
        cursor: "pointer", color: "white",
        fontSize: "12px", fontWeight: "700", fontFamily: "inherit",
        boxShadow: "0 4px 14px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
        transition: "all 0.3s ease", whiteSpace: "nowrap",
        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}
    >
      <span style={{ fontSize: "14px" }}>{isDark ? "🌙" : "☀️"}</span>
      {isDark ? "Dark" : "Light"}
      <span style={{
        display: "inline-flex", width: "30px", height: "16px",
        borderRadius: "999px", position: "relative", flexShrink: 0,
        background: isDark ? "rgba(160,80,255,0.5)" : "rgba(255,255,255,0.55)",
        border: "1px solid rgba(255,255,255,0.3)",
        transition: "background 0.3s ease",
      }}>
        <span style={{
          position: "absolute", top: "2px",
          left: isDark ? "15px" : "2px",
          width: "10px", height: "10px", borderRadius: "50%",
          background: "white", transition: "left 0.3s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </span>
    </button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { isDark } = useTheme();
  const [open,    setOpen]    = useState(false);
  const [active,  setActive]  = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { label: "Services",     id: "services"     },
    { label: "Case Studies", id: "case-studies" },
    { label: "About Us",     id: "about"        },
  ];

  // ── Scroll spy: highlight active section ──
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = ["home", "services", "case-studies", "about", "book"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 overflow-hidden shadow-xl transition-all duration-300"
      style={{
        minHeight: "76px",
        // subtle extra blur/shadow once user has scrolled
        boxShadow: scrolled
          ? "0 4px 32px rgba(0,0,0,0.45)"
          : "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      <CloudCanvas isDark={isDark} />

      {/* ── Main bar ── */}
      <div className="relative z-10 w-full px-6 sm:px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => scrollTo("home")} className="flex items-center gap-3 shrink-0 cursor-pointer bg-transparent border-none p-0">
          <img
            src="/notionnik.svg"
            alt="Notionnik Logo"
            style={{ height: "48px", width: "auto", objectFit: "contain" }}
            className="drop-shadow-lg"
          />
          <span
            className="font-extrabold text-2xl sm:text-3xl tracking-wide text-white"
            style={{
              textShadow: isDark
                ? "0 1px 10px rgba(180,60,255,0.7)"
                : "0 1px 10px rgba(30,100,200,0.6)",
            }}
          >
            Notionnik
          </span>
        </button>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">

          {/* Nav pill */}
          <div
            className="flex items-center gap-1 px-3 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`font-semibold text-sm px-4 py-1.5 rounded-full transition-all duration-200 border-none cursor-pointer ${
                  active === link.id
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-white hover:bg-white/30"
                }`}
                style={{
                  textShadow: active === link.id ? "none" : "0 1px 4px rgba(0,0,0,0.3)",
                  background: active === link.id ? "white" : undefined,
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Book Now */}
          <button
            onClick={() => scrollTo("book")}
            className="font-bold px-5 py-2 rounded-full transition-all duration-200 shadow-lg hover:scale-105 cursor-pointer border-none"
            style={{
              background: active === "book"
                ? "rgba(200,230,255,0.95)"
                : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(220,240,255,0.9))",
              color: "#1a5faa",
              boxShadow: "0 4px 14px rgba(100,160,255,0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
              border: "1.5px solid rgba(255,255,255,0.8)",
            }}
          >
            ☁️ Book Now
          </button>

          <ThemeToggle />
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="focus:outline-none text-white"
            style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="relative z-10 md:hidden px-4 pb-4">
          <div
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(16px)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-4 py-2.5 rounded-full font-semibold transition-all duration-200 text-left border-none cursor-pointer ${
                  active === link.id ? "bg-white text-blue-700 shadow-md" : "text-white hover:bg-white/30"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("book")}
              className="mt-1 font-bold text-center px-4 py-2.5 rounded-full transition-all hover:scale-105 border-none cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(220,240,255,0.9))",
                color: "#1a5faa",
                border: "1.5px solid rgba(255,255,255,0.8)",
              }}
            >
              ☁️ Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
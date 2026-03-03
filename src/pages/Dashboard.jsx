import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

// ─── Full-page Water Background Canvas ───────────────────────────────────────
function WaterBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Base gradient background
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#00F0FF");
      bg.addColorStop(1, "#B0E0E6");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Layered flowing sine waves
      const waves = [
        { amp: 0.07, freq: 0.010, speed: 0.016, alpha: 0.22, color: "#0097a7" },
        { amp: 0.05, freq: 0.016, speed: 0.022, alpha: 0.18, color: "#006064" },
        { amp: 0.06, freq: 0.008, speed: 0.011, alpha: 0.15, color: "#4dd0e1" },
        { amp: 0.04, freq: 0.020, speed: 0.030, alpha: 0.12, color: "#00838f" },
        { amp: 0.03, freq: 0.026, speed: 0.038, alpha: 0.10, color: "#00e5ff" },
      ];

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
        grad.addColorStop(0, wave.color + "00");
        grad.addColorStop(0.35, wave.color + Math.round(wave.alpha * 255).toString(16).padStart(2, "0"));
        grad.addColorStop(1, wave.color + "44");
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Subtle horizontal current shimmer lines
      ctx.globalAlpha = 0.055;
      for (let i = 0; i < 10; i++) {
        const y = (height / 10) * i + 20 + Math.sin(t * 0.018 + i * 0.9) * 12;
        const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
        lineGrad.addColorStop(0, "transparent");
        lineGrad.addColorStop(0.25, "#ffffff");
        lineGrad.addColorStop(0.75, "#00e5ff");
        lineGrad.addColorStop(1, "transparent");
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= width; x += 4) {
          const wy = y + Math.sin(x * 0.018 + t * 0.025 + i) * 5;
          ctx.lineTo(x, wy);
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
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const services = [
    { title: "Notion Setup",     desc: "Custom workspace design tailored to your workflow.",    icon: "📝" },
    { title: "Automation",       desc: "Zapier, Make, and n8n automations to save you hours.",  icon: "⚡" },
    { title: "CRM Build",        desc: "Full CRM systems inside Notion for managing clients.",  icon: "🗂️" },
    { title: "Dashboard Design", desc: "Beautiful Notion dashboards for data and analytics.",   icon: "📊" },
    { title: "SOP Creation",     desc: "Standard operating procedures documented in Notion.",   icon: "📋" },
    { title: "Team Wikis",       desc: "Centralized knowledge bases for your entire team.",     icon: "🌐" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">

      {/* Water background — fixed, full screen, behind everything */}
      <WaterBackground />

      {/* All content sits above the water */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Hero */}
        <div className="text-center mb-10 max-w-3xl">
          <span className="inline-block bg-white/10 border border-white/20 text-black text-xs sm:text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
            Notion & Automation Specialist
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
            Build Smarter Systems.<br className="hidden sm:block" />
            Work Less. Do More.
          </h1>

          <p className="text-black text-sm sm:text-base md:text-lg leading-relaxed">
            We design powerful Notion workspaces and automation workflows that help
            businesses run on autopilot — so you can focus on what matters most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              to="/book"
              className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              📅 Book a Free Call
            </Link>
            <Link
              to="/services"
              className="bg-white/10 border border-white/20 text-black font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              View Services
            </Link>
          </div>
        </div>

        {/* Services */}
        <div className="w-full max-w-6xl mb-12">
          <h2 className="text-black font-bold text-xl sm:text-2xl mb-6">
            🚀 What We Do
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 hover:bg-white/20 transition-all duration-300 shadow-lg flex flex-col gap-3"
              >
                <span className="text-3xl">{service.icon}</span>
                <h3 className="text-black font-bold text-base sm:text-lg">{service.title}</h3>
                <p className="text-black/80 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left">
          <div>
            <h3 className="text-black font-bold text-xl sm:text-2xl mb-1">
              Ready to systemize your business?
            </h3>
            <p className="text-black/80 text-sm sm:text-base">
              Let's build your dream Notion workspace together.
            </p>
          </div>
          <Link
            to="/book"
            className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg whitespace-nowrap"
          >
            📅 Book Now
          </Link>
        </div>

      </div>
    </div>
  );
}
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

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#B0E0E6");
      bg.addColorStop(0.5, "#A7D8EB");
      bg.addColorStop(1, "#9AD0EC");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

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

// ─── Services ─────────────────────────────────────────────────────────────────
export default function Services() {
  const services = [
    {
      icon: "🧠",
      title: "Consulting",
      desc: "Strategic advice on systems, workflows, and tools to help your business scale efficiently.",
    },
    {
      icon: "💻",
      title: "Web Development",
      desc: "Clean, modern websites and web apps built to perform and convert.",
    },
    {
      icon: "🔁",
      title: "N8N Automation",
      desc: "Self-hosted automation pipelines using n8n to connect your apps and eliminate manual work.",
    },
    {
      icon: "⚡",
      title: "Make Automation",
      desc: "Visual automation workflows with Make (formerly Integromat) for seamless app integrations.",
    },
    {
      icon: "📜",
      title: "Google App Scripts",
      desc: "Custom scripts to automate Google Sheets, Docs, Gmail, and more within your Google Workspace.",
    },
    {
      icon: "📝",
      title: "Notion Automation",
      desc: "Automate your Notion databases, pages, and workflows to keep everything organized and updated.",
    },
  ];

  return (
    <div className="relative min-h-screen py-16 px-6">

      {/* Water background */}
      <WaterBackground />

      {/* Content */}
      <div className="relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-white/50 border border-blue-200 text-blue-900 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
            What We Offer
          </span>
          <h1 className="text-5xl font-bold text-blue-950 mb-4 tracking-tight">
            Our Services
          </h1>
          <p className="text-blue-900/80 text-lg max-w-2xl mx-auto leading-relaxed">
            From Notion workspaces to full automation pipelines — we build systems
            that save time, reduce errors, and scale with your business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-6
                         hover:bg-white hover:-translate-y-1 transition-all duration-300
                         shadow-lg flex flex-col gap-3 group"
            >
              <span className="text-4xl">{service.icon}</span>
              <h2 className="text-blue-950 font-bold text-xl group-hover:text-blue-700 transition-colors">
                {service.title}
              </h2>
              <p className="text-blue-900/80 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="max-w-6xl mx-auto mt-14 bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-8
                        flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-blue-950 font-bold text-2xl mb-1">
              Need a custom automation?
            </h3>
            <p className="text-blue-900/80">
              Tell us what you need — we'll build it for you.
            </p>
          </div>
          <a
            href="/book"
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl
                       hover:bg-blue-700 transition-all duration-200
                       hover:-translate-y-1 shadow-lg whitespace-nowrap"
          >
            📅 Book a Consultation
          </a>
        </div>

      </div>
    </div>
  );
}
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

// ─── AboutUs ──────────────────────────────────────────────────────────────────
export default function AboutUs() {
  const team = [
    {
      name: "Alex Rivera",
      role: "Automation Architect",
      desc: "Specializes in building end-to-end automation pipelines using n8n, Make, and Zapier for businesses of all sizes.",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4",
    },
    {
      name: "Jordan Lee",
      role: "Notion Specialist",
      desc: "Expert in designing Notion workspaces, CRM systems, and SOPs that streamline how teams operate daily.",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=c0aede",
    },
    {
      name: "Morgan Chen",
      role: "Systems Integrator",
      desc: "Connects APIs, databases, and third-party tools to create seamless data flows across your entire tech stack.",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan&backgroundColor=d1f4d1",
    },
    {
      name: "Taylor Smith",
      role: "AI & Workflow Engineer",
      desc: "Builds AI-powered workflows for document generation, meeting summaries, video creation, and smart reporting.",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor&backgroundColor=ffd5dc",
    },
  ];

  const values = [
    { icon: "⚡", title: "Speed",       desc: "We build fast and deploy faster — your systems go live without the long wait." },
    { icon: "🎯", title: "Precision",   desc: "Every automation is tested, documented, and built to work exactly as intended." },
    { icon: "🔒", title: "Reliability", desc: "We design for uptime. Your workflows run 24/7 without breaking." },
    { icon: "🤝", title: "Partnership", desc: "We don't just deliver and disappear — we stay with you as your systems grow." },
  ];

  return (
    <div className="relative min-h-screen py-16 px-6">

      {/* Water background */}
      <WaterBackground />

      {/* Content */}
      <div className="relative z-10">

        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block bg-white/50 border border-blue-200 text-blue-900 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
            Who We Are
          </span>
          <h1 className="text-5xl font-bold text-blue-950 mb-5 tracking-tight">
            We Build Systems That Work While You Sleep
          </h1>
          <p className="text-blue-900/80 text-lg leading-relaxed">
            Notionnik is a team of automation specialists, Notion experts, and systems thinkers
            dedicated to helping businesses eliminate repetitive work and operate at a higher
            level — through smart workflows, clean integrations, and powerful tools.
          </p>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-5
                         flex flex-col gap-3 hover:bg-white hover:-translate-y-1
                         transition-all duration-300 shadow-lg"
            >
              <span className="text-3xl">{v.icon}</span>
              <h3 className="text-blue-900 font-bold text-lg">{v.title}</h3>
              <p className="text-blue-900/80 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-blue-950 font-bold text-2xl mb-8 text-center">
            👥 Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-6
                           flex flex-col items-center text-center gap-4
                           hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-md bg-white">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-blue-950 font-bold text-xl">{member.name}</h2>
                  <span className="inline-block mt-1 mb-3 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-3 py-1">
                    {member.role}
                  </span>
                  <p className="text-blue-900/80 text-sm leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Approach */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-blue-950 mb-3">🎯 Our Mission</h2>
            <p className="text-blue-900/80 leading-relaxed">
              To eliminate manual, repetitive work from every business we touch.
              Your time is too valuable to be spent on tasks a well-built system can handle.
              We engineer those systems so you can focus on growing — not grinding.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-blue-950 mb-3">🚀 Our Approach</h2>
            <p className="text-blue-900/80 leading-relaxed">
              We start by understanding your workflow, then design a custom automation
              strategy using the best tools for your needs — Notion, n8n, Make,
              Google Apps, or AI. Every solution is built to scale as your business grows.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
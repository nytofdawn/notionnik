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
      bg.addColorStop(0, "#00F0FF");
      bg.addColorStop(1, "#B0E0E6");
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

// ─── Book ─────────────────────────────────────────────────────────────────────
export default function Book() {
  const calendlyRef = useRef(null);

  useEffect(() => {
    function initCalendly() {
      if (window.Calendly && calendlyRef.current) {
        calendlyRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/jannikm/30min",
          parentElement: calendlyRef.current,
        });
      }
    }

    if (!window.Calendly) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initCalendly;
      document.body.appendChild(script);
    } else {
      initCalendly();
    }
  }, []);

  return (
    <div className="relative min-h-[100dvh] px-4 py-6 flex flex-col items-center">

      {/* Water background */}
      <WaterBackground />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">
            Book a Session
          </h1>
          <p className="text-black/80 text-sm sm:text-base max-w-md mx-auto">
            Pick a time that works for you — it'll sync directly to Google Calendar.
          </p>
        </div>

        {/* Calendly Container */}
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden">
          <div
            ref={calendlyRef}
            className="w-full h-[400px] sm:h-[480px] md:h-[520px]"
          />
        </div>

      </div>
    </div>
  );
}
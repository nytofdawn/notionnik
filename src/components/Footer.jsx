import { useEffect, useRef, useState } from "react";
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

      const bg = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.4, Math.max(width, height) * 0.8);
      bg.addColorStop(0,    "#1c080e");
      bg.addColorStop(0.40, "#110510");
      bg.addColorStop(0.70, "#080310");
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

// ─── Privacy Policy Modal ─────────────────────────────────────────────────────
function PrivacyModal({ isDark, onClose }) {
  const overlay = isDark ? "bg-black/80" : "bg-black/50";
  const modal   = isDark ? "bg-[#120810] border-white/10 text-white/80" : "bg-white border-black/10 text-black/80";
  const heading = isDark ? "text-white" : "text-black";
  const muted   = isDark ? "text-white/50" : "text-black/50";

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center px-4 ${overlay} backdrop-blur-sm`}
      onClick={handleBackdrop}
    >
      <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col ${modal}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/10" : "border-black/8"}`}>
          <h2 className={`text-xl font-bold ${heading}`}>🔒 Privacy Policy</h2>
          <button onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-black/5 text-black/50 hover:text-black"}`}>
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 text-sm leading-relaxed space-y-5">
          <p className={muted}>Last updated: {new Date().getFullYear()}</p>
          <section>
            <h3 className={`font-bold text-base mb-1 ${heading}`}>1. Information We Collect</h3>
            <p>When you use our website or book a consultation, we may collect your name, email address, and any information you voluntarily provide through our booking or contact forms. We do not collect sensitive personal data unless explicitly required for service delivery.</p>
          </section>
          <section>
            <h3 className={`font-bold text-base mb-1 ${heading}`}>2. How We Use Your Information</h3>
            <p>We use the information we collect to respond to your inquiries, schedule consultations, deliver our services, and improve your experience on our platform. We do not sell, rent, or trade your personal data to third parties.</p>
          </section>
          <section>
            <h3 className={`font-bold text-base mb-1 ${heading}`}>3. Cookies & Analytics</h3>
            <p>Our website may use cookies or similar technologies to understand how visitors interact with our site. This data is used solely to improve performance and user experience. You may disable cookies in your browser settings at any time.</p>
          </section>
          <section>
            <h3 className={`font-bold text-base mb-1 ${heading}`}>4. Third-Party Services</h3>
            <p>We use third-party tools such as Calendly for scheduling. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the data practices of third-party platforms.</p>
          </section>
          <section>
            <h3 className={`font-bold text-base mb-1 ${heading}`}>5. Data Security</h3>
            <p>We take reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, or misuse. However, no method of transmission over the internet is 100% secure.</p>
          </section>
          <section>
            <h3 className={`font-bold text-base mb-1 ${heading}`}>6. Your Rights</h3>
            <p>You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, please contact us directly via our website or WhatsApp.</p>
          </section>
          <section>
            <h3 className={`font-bold text-base mb-1 ${heading}`}>7. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please reach out to us through our website's booking system or social media channels.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const { isDark } = useTheme();
  const [showPrivacy, setShowPrivacy] = useState(false);

  const textMain = isDark ? "text-white/80"  : "text-amber-900";
  const textSub  = isDark ? "text-white/40"  : "text-amber-800/70";
  const textLink = isDark ? "text-white/50 hover:text-white" : "text-amber-900/70 hover:text-amber-950";
  const border   = isDark ? "border-white/10" : "border-amber-300/60";
  const iconBg   = isDark ? "bg-white/8 border-white/15" : "bg-amber-100/60 border-amber-300";
  const iconFill = isDark ? "fill-white/60 group-hover:fill-white" : "fill-amber-900 group-hover:fill-white";

  // ✅ Navbar-accurate scroll
  const scrollTo = (id) => {
    const el  = document.getElementById(id);
    const nav = document.querySelector("nav");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 76) - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home",         id: "home"         },
    { label: "Services",     id: "services"     },
    { label: "Case Studies", id: "case-studies" },
    { label: "About Us",     id: "about"        },
    { label: "Book Now",     id: "book"         },
  ];

  return (
    <>
      {showPrivacy && <PrivacyModal isDark={isDark} onClose={() => setShowPrivacy(false)} />}

      <footer className={`relative border-t overflow-hidden ${border}`}>
        {isDark ? <SpaceCanvas /> : <SandCanvas />}

        {/* ── Same padding as Navbar: px-6 sm:px-8, no max-width cap ── */}
        <div className="relative z-10 w-full px-6 sm:px-8 py-10 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">

            {/* Logo — pinned to the left edge */}
            <div className="flex items-center gap-2">
              <img src="/notionnik.svg" alt="NotionNik Logo" className="h-8 w-auto object-contain" />
              <span className={`font-bold text-xl tracking-wide ${textMain}`}>NotionNik</span>
            </div>

            {/* Nav links — flex-1 centers them between logo and socials */}
            <div className="flex flex-1 flex-wrap justify-center gap-3 sm:gap-5 text-sm mt-6 md:mt-0">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)}
                  className={`font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${textLink}`}>
                  {link.label}
                </button>
              ))}
            </div>

            {/* Socials */}
            <div className="flex flex-col items-center gap-2 mt-6 md:mt-0">
              <p className={`text-xs font-semibold tracking-widest uppercase ${textSub}`}>Find Us</p>
              <div className="flex gap-3">

                {/* Instagram */}
                <a href="https://www.instagram.com/notionnik/" target="_blank" rel="noopener noreferrer"
                  className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 ${iconBg}`}
                  aria-label="Instagram">
                  <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.239 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.239-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.239-2.242-1.301-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.239 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.612.074-3.055.4-4.209 1.554C1.69 2.78 1.364 4.223 1.29 5.835 1.232 7.115 1.218 7.523 1.218 12s.014 4.885.072 6.165c.074 1.612.4 3.055 1.554 4.209 1.154 1.154 2.597 1.48 4.209 1.554C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.612-.074 3.055-.4 4.209-1.554 1.154-1.154 1.48-2.597 1.554-4.209.058-1.28.072-1.688.072-6.165s-.014-4.885-.072-6.165c-.074-1.612-.4-3.055-1.554-4.209C19.002.472 17.559.146 15.947.072 14.667.014 14.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a href="https://wa.me/+639663671854" target="_blank" rel="noopener noreferrer"
                  className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-green-500 ${iconBg}`}
                  aria-label="WhatsApp">
                  <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/notionnik/" target="_blank" rel="noopener noreferrer"
                  className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-blue-500 ${iconBg}`}
                  aria-label="Facebook">
                  <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H8.08V12h2.36v-2.05c0-2.33 1.39-3.62 3.51-3.62.69 0 1.53.12 2.22.24v2.44h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89h-2.3v6.99A10 10 0 0 0 22 12z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/103721418/" target="_blank" rel="noopener noreferrer"
                  className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-blue-600 ${iconBg}`}
                  aria-label="LinkedIn">
                  <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/>
                  </svg>
                </a>

                {/* Upwork */}
                <a href="https://www.upwork.com/agencies/1768339692736311296/" target="_blank" rel="noopener noreferrer"
                  className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 group shadow-sm hover:bg-green-600 ${iconBg}`}
                  aria-label="Upwork">
                  <svg className={`w-5 h-5 transition-colors duration-200 ${iconFill}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M18.56 12.67c-1.1 0-2.13-.42-2.93-1.09l.22-1.02.01-.07c.19-1.07.78-2.87 2.7-2.87a2.53 2.53 0 0 1 2.53 2.53 2.53 2.53 0 0 1-2.53 2.52zm0-7.1c-2.6 0-4.63 1.7-5.48 4.46-.79-1.41-1.39-3.1-1.74-4.53H8.87v5.5a2.36 2.36 0 0 1-2.35 2.35 2.36 2.36 0 0 1-2.36-2.35V5.5H1.69v5.5a4.84 4.84 0 0 0 4.83 4.84 4.84 4.84 0 0 0 4.84-4.84v-.92c.34.73.76 1.47 1.25 2.14L10.9 18.5h2.42l1.09-4.01c.96.62 2.07.98 3.24.98 3.05 0 5.2-2.23 5.2-5.02a5.02 5.02 0 0 0-5.02-5.02z"/>
                  </svg>
                </a>

              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className={`relative border-t pt-5 flex items-center justify-between text-xs ${isDark ? "border-white/8" : "border-amber-300/40"}`}>
            <p className={textSub}>© {new Date().getFullYear()} NotionNik. All rights reserved.</p>
            <button onClick={() => setShowPrivacy(true)}
              className={`font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer absolute left-1/2 -translate-x-1/2 ${textLink}`}>
              🔒 Privacy Policy
            </button>
            <div />
          </div>

        </div>
      </footer>
    </>
  );
}
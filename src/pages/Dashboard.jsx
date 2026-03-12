import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";
import AboutUs       from "./AboutUs";
import Services      from "./Services";
import CaseStudies   from "./CaseStudies";
import Testimonials  from "./Testimonials";
import Book          from "./Book";

// ─── Pulsing separator dot between sections ───────────────────────────────────
function SectionDot({ label, active, isDark, onClick }) {
  return (
    <div className="relative flex flex-col items-center select-none" style={{ zIndex: 10 }}>
      {/* Top line */}
      <div style={{
        width: 1, height: 44,
        background: isDark
          ? "linear-gradient(to bottom, transparent, rgba(180,80,255,0.3), transparent)"
          : "linear-gradient(to bottom, transparent, rgba(0,220,255,0.4), transparent)",
      }} />

      {/* Dot button */}
      <button
        onClick={onClick}
        title={label}
        style={{
          width:        active ? 14 : 8,
          height:       active ? 14 : 8,
          borderRadius: "50%",
          border: isDark
            ? `2px solid rgba(180,80,255,${active ? 0.95 : 0.4})`
            : `2px solid rgba(0,220,255,${active ? 0.95 : 0.5})`,
          background: active
            ? (isDark ? "rgba(180,80,255,0.75)" : "rgba(0,220,255,0.75)")
            : "transparent",
          boxShadow: active
            ? (isDark ? "0 0 12px 4px rgba(180,80,255,0.5)" : "0 0 12px 4px rgba(0,220,255,0.5)")
            : "none",
          cursor: "pointer",
          padding: 0,
          outline: "none",
          position: "relative",
          transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {active && (
          <span style={{
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            border: isDark
              ? "1.5px solid rgba(180,80,255,0.55)"
              : "1.5px solid rgba(0,220,255,0.55)",
            animation: "dotPulse 1.8s ease-out infinite",
            pointerEvents: "none",
          }} />
        )}
      </button>

      {/* Bottom line */}
      <div style={{
        width: 1, height: 44,
        background: isDark
          ? "linear-gradient(to bottom, transparent, rgba(180,80,255,0.3), transparent)"
          : "linear-gradient(to bottom, transparent, rgba(0,220,255,0.4), transparent)",
      }} />
    </div>
  );
}

// ─── Section order ────────────────────────────────────────────────────────────
const SECTIONS = ["home", "services", "case-studies", "about", "testimonials", "book"];

// ─── Color tokens — both modes render over a DARK 3D background ──────────────
// Dark mode  → deep space  (near-black, purple accents)
// Light mode → deep ocean  (dark teal abyss, cyan accents)
// Therefore: text is always light; only accent hue changes.
const C = {
  // Eyebrow / label text
  label:   (d) => d ? "rgba(200,140,255,1)"  : "rgba(100,240,255,1)",
  // Primary heading
  heading: (d) => d ? "#ffffff"              : "#e8fffe",
  // Accent word in heading
  accent:  (d) => d ? "#c084fc"             : "#22d3ee",
  // Body / sub text
  body:    (d) => d ? "rgba(210,210,230,1)"  : "rgba(180,240,248,1)",
  // Primary button bg
  btnPrimary: (d) => d
    ? { bg: "#9333ea", hover: "#a855f7", shadow: "rgba(147,51,234,0.45)" }
    : { bg: "#0891b2", hover: "#06b6d4", shadow: "rgba(6,182,212,0.45)" },
  // Ghost button
  btnGhost: (d) => d
    ? { border: "rgba(192,132,252,0.45)", text: "#d8b4fe" }
    : { border: "rgba(34,211,238,0.50)", text: "#67e8f9" },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const lastSectionRef = useRef("home");
  const burstCooldown  = useRef(false);

  // Hover state for buttons
  const [primaryHover, setPrimaryHover]   = useState(false);
  const [ghostHover,   setGhostHover]     = useState(false);
  const [ctaHover,     setCtaHover]       = useState(false);

  const fireBurst = useCallback(() => {
    if (burstCooldown.current) return;
    burstCooldown.current = true;
    window.dispatchEvent(new CustomEvent("section-burst"));
    setTimeout(() => { burstCooldown.current = false; }, 800);
  }, []);

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      const navH   = document.querySelector("nav")?.offsetHeight || 76;
      const offset = navH + 40;
      let current  = SECTIONS[0];
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      if (current !== lastSectionRef.current) {
        lastSectionRef.current = current;
        setActiveSection(current);
        fireBurst();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fireBurst]);

  const scrollTo = (id) => {
    const el  = document.getElementById(id);
    const nav = document.querySelector("nav");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 76) - 8;
    window.scrollTo({ top, behavior: "smooth" });
    fireBurst();
  };

  const Separator = ({ afterId }) => {
    const idx  = SECTIONS.indexOf(afterId);
    const next = SECTIONS[idx + 1];
    const isActive = activeSection === afterId || activeSection === next;
    return (
      <SectionDot
        label={next ? `Go to ${next}` : afterId}
        active={isActive}
        isDark={isDark}
        onClick={() => next && scrollTo(next)}
      />
    );
  };

  const btn     = C.btnPrimary(isDark);
  const ghost   = C.btnGhost(isDark);

  return (
    <>
      <style>{`
        @keyframes dotPulse {
          0%   { transform: scale(0.5); opacity: 0.9; }
          70%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(0.5); opacity: 0;   }
        }
      `}</style>

      {/* Fixed background */}
      <div style={{ position: "fixed", inset: 0, zIndex: -10, pointerEvents: "none" }}>
        <PageBackground />
      </div>

      <div className="relative flex flex-col items-center">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section id="home" className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Eyebrow */}
            <p style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.label(isDark),
              textShadow: isDark
                ? "0 0 18px rgba(200,140,255,0.6)"
                : "0 0 18px rgba(0,240,255,0.5)",
            }}>
              Notion Automation Agency
            </p>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: C.heading(isDark),
              textShadow: isDark
                ? "0 2px 40px rgba(0,0,0,0.8)"
                : "0 2px 40px rgba(0,20,40,0.9)",
            }}>
              We Build{" "}
              <span style={{
                color: C.accent(isDark),
                textShadow: isDark
                  ? "0 0 30px rgba(192,132,252,0.7)"
                  : "0 0 30px rgba(34,211,238,0.7)",
              }}>
                Systems
              </span>
              {" "}That Work While You Sleep
            </h1>

            {/* Sub-text */}
            <p style={{
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              maxWidth: "38rem",
              margin: "0 auto",
              color: C.body(isDark),
              textShadow: isDark
                ? "0 1px 12px rgba(0,0,0,0.7)"
                : "0 1px 12px rgba(0,10,30,0.8)",
              lineHeight: 1.65,
            }}>
              Notion dashboards, automation workflows, and smart integrations —
              designed for founders who want clarity without chaos.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", paddingTop: "1rem" }}>
              {/* Primary */}
              <button
                onClick={() => scrollTo("book")}
                onMouseEnter={() => setPrimaryHover(true)}
                onMouseLeave={() => setPrimaryHover(false)}
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "1rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#ffffff",
                  background: primaryHover ? btn.hover : btn.bg,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 8px 32px ${btn.shadow}`,
                  transform: primaryHover ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s ease",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                Book a Free Call
              </button>

              {/* Ghost */}
              <button
                onClick={() => scrollTo("services")}
                onMouseEnter={() => setGhostHover(true)}
                onMouseLeave={() => setGhostHover(false)}
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "1rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: ghostHover ? "#ffffff" : ghost.text,
                  background: ghostHover
                    ? (isDark ? "rgba(147,51,234,0.25)" : "rgba(6,182,212,0.22)")
                    : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${ghost.border}`,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transform: ghostHover ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s ease",
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                }}
              >
                See Our Services
              </button>
            </div>
          </div>
        </section>

        <Separator afterId="home" />

        {/* ── Services ──────────────────────────────────────────────────── */}
        <section id="services" className="w-full">
          <Services />
        </section>

        <Separator afterId="services" />

        {/* ── Case Studies ──────────────────────────────────────────────── */}
        <section id="case-studies" className="w-full">
          <CaseStudies />
        </section>

        <Separator afterId="case-studies" />

        {/* ── About ─────────────────────────────────────────────────────── */}
        <section id="about" className="w-full">
          <AboutUs />
        </section>

        <Separator afterId="about" />

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section id="testimonials" className="w-full">
          <Testimonials />
        </section>

        <Separator afterId="testimonials" />

        {/* ── Book ──────────────────────────────────────────────────────── */}
        <section id="book" className="w-full">
          <Book />
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="w-full py-24 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-2xl mx-auto space-y-6">

            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              color: C.heading(isDark),
              textShadow: isDark
                ? "0 2px 40px rgba(0,0,0,0.8)"
                : "0 2px 40px rgba(0,20,40,0.9)",
              lineHeight: 1.15,
            }}>
              Ready to{" "}
              <span style={{
                color: C.accent(isDark),
                textShadow: isDark
                  ? "0 0 28px rgba(192,132,252,0.65)"
                  : "0 0 28px rgba(34,211,238,0.65)",
              }}>
                Automate
              </span>
              {" "}Everything?
            </h2>

            <p style={{
              fontSize: "1.1rem",
              color: C.body(isDark),
              textShadow: isDark
                ? "0 1px 12px rgba(0,0,0,0.7)"
                : "0 1px 12px rgba(0,10,30,0.8)",
            }}>
              Let&apos;s build something that actually moves your business forward.
            </p>

            <button
              onClick={() => scrollTo("book")}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={{
                padding: "1rem 2.5rem",
                borderRadius: "1rem",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "#ffffff",
                background: ctaHover ? btn.hover : btn.bg,
                border: "none",
                cursor: "pointer",
                boxShadow: `0 10px 40px ${btn.shadow}`,
                transform: ctaHover ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s ease",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            >
              Get Started Today
            </button>
          </div>
        </section>

      </div>
    </>
  );
}
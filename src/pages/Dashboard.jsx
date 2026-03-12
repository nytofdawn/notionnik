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
          : "linear-gradient(to bottom, transparent, rgba(0,188,212,0.4), transparent)",
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
            : `2px solid rgba(0,188,212,${active ? 0.95 : 0.4})`,
          background: active
            ? (isDark ? "rgba(180,80,255,0.75)" : "rgba(0,200,220,0.75)")
            : "transparent",
          boxShadow: active
            ? (isDark ? "0 0 12px 4px rgba(180,80,255,0.5)" : "0 0 12px 4px rgba(0,220,255,0.45)")
            : "none",
          cursor: "pointer",
          padding: 0,
          outline: "none",
          position: "relative",
          transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Pulse ring */}
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
          : "linear-gradient(to bottom, transparent, rgba(0,188,212,0.4), transparent)",
      }} />
    </div>
  );
}

// ─── Section order ────────────────────────────────────────────────────────────
const SECTIONS = ["home", "services", "case-studies", "about", "testimonials", "book"];

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const lastSectionRef = useRef("home");
  const burstCooldown  = useRef(false);

  // Fire burst event (debounced)
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

  // Smooth scroll helper
  const scrollTo = (id) => {
    const el  = document.getElementById(id);
    const nav = document.querySelector("nav");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 76) - 8;
    window.scrollTo({ top, behavior: "smooth" });
    fireBurst();
  };

  // Separator between two section ids
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
            <p className={`text-sm font-semibold tracking-widest uppercase ${isDark ? "text-purple-300" : "text-cyan-700"}`}>
              Notion Automation Agency
            </p>
            <h1 className={`text-5xl md:text-7xl font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              We Build{" "}
              <span className={isDark ? "text-purple-400" : "text-cyan-600"}>Systems</span>
              {" "}That Work While You Sleep
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Notion dashboards, automation workflows, and smart integrations — designed for founders who want clarity without chaos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => scrollTo("book")}
                className={`px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/40"
                    : "bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-300/40"
                }`}
              >
                Book a Free Call
              </button>
              <button
                onClick={() => scrollTo("services")}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 border ${
                  isDark
                    ? "border-purple-500/40 text-purple-300 hover:bg-purple-900/30"
                    : "border-cyan-400/50 text-cyan-700 hover:bg-cyan-50"
                }`}
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
            <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Ready to{" "}
              <span className={isDark ? "text-purple-400" : "text-cyan-600"}>Automate</span>
              {" "}Everything?
            </h2>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Let&apos;s build something that actually moves your business forward.
            </p>
            <button
              onClick={() => scrollTo("book")}
              className={`px-10 py-4 rounded-2xl font-semibold text-white transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "bg-purple-600 hover:bg-purple-500 shadow-xl shadow-purple-900/50"
                  : "bg-cyan-600 hover:bg-cyan-500 shadow-xl shadow-cyan-300/50"
              }`}
            >
              Get Started Today
            </button>
          </div>
        </section>

      </div>
    </>
  );
}
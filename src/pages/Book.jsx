import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

// ── Color tokens — both modes sit over a DARK 3D background ──────────────────
const C = {
  label:      (d) => d ? "rgba(210,150,255,1)"   : "rgba(100,240,255,1)",
  heading:    (d) => d ? "#ffffff"               : "#e8fffe",
  accent:     (d) => d ? "#c084fc"               : "#22d3ee",
  body:       (d) => d ? "rgba(200,200,220,1)"   : "rgba(170,235,245,1)",
  cardBg:     (d) => d ? "rgba(255,255,255,0.05)": "rgba(0,60,80,0.35)",
  cardBorder: (d) => d ? "rgba(255,255,255,0.09)": "rgba(0,200,230,0.20)",
  accentGlow: (d) => d ? "0 0 28px rgba(192,132,252,0.55)" : "0 0 28px rgba(34,211,238,0.50)",
  textShadow: (d) => d ? "0 2px 20px rgba(0,0,0,0.8)"     : "0 2px 20px rgba(0,15,30,0.9)",
};

export default function Book() {
  const { isDark } = useTheme();
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
    <div style={{ padding:"4rem 1rem", display:"flex", flexDirection:"column", alignItems:"center" }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", marginBottom:"2rem" }}>
        <span style={{
          display:"inline-block",
          background: C.cardBg(isDark),
          border: `1px solid ${C.cardBorder(isDark)}`,
          color: C.label(isDark),
          fontSize:"0.75rem", fontWeight:700,
          letterSpacing:"0.14em", textTransform:"uppercase",
          padding:"0.3rem 1.1rem", borderRadius:999,
          marginBottom:"1rem",
          backdropFilter:"blur(10px)",
          textShadow: C.textShadow(isDark),
        }}>
          Schedule a Call
        </span>

        <h2 style={{
          fontSize:"clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight:800, lineHeight:1.15,
          color: C.heading(isDark),
          textShadow: C.textShadow(isDark),
          margin:"0 0 0.75rem",
        }}>
          Book a{" "}
          <span style={{ color: C.accent(isDark), textShadow: C.accentGlow(isDark) }}>
            Session
          </span>
        </h2>

        <p style={{
          fontSize:"0.95rem", lineHeight:1.65,
          color: C.body(isDark),
          textShadow: C.textShadow(isDark),
          maxWidth:"28rem", margin:"0 auto",
        }}>
          Pick a time that works for you — it'll sync directly to Google Calendar.
        </p>
      </div>

      {/* ── Calendly widget ───────────────────────────────────────────── */}
      <div style={{
        width:"100%", maxWidth:"28rem",
        borderRadius:"1.25rem",
        backdropFilter:"blur(14px)",
        WebkitBackdropFilter:"blur(14px)",
        border: `1px solid ${C.cardBorder(isDark)}`,
        background: C.cardBg(isDark),
        overflow:"hidden",
        boxShadow: isDark
          ? "0 8px 40px rgba(0,0,0,0.5)"
          : "0 8px 40px rgba(0,30,50,0.45)",
      }}>
        <div
          ref={calendlyRef}
          style={{
            width:"100%",
            height:"clamp(400px, 60vw, 520px)",
          }}
        />
      </div>

    </div>
  );
}
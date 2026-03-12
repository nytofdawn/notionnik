import { useTheme } from "./ThemeContext";
import { useState } from "react";

const PER_PAGE = 6;

const CASE_STUDIES = [
  { icon:"🛍️", title:"Shopify Product Uploader",  desc:"Automated bulk product uploads to your Shopify store — no manual entry, no errors.",                   tag:"E-Commerce Automation" },
  { icon:"🗒️", title:"Meeting Summary to Notion", desc:"Auto-generate meeting summaries and push them directly into your Notion database.",                      tag:"Notion Integration" },
  { icon:"🎬", title:"Video Generation",           desc:"AI-powered automated video creation pipelines for content, marketing, and social media.",                tag:"AI Automation" },
  { icon:"📄", title:"Google Sheet to Document",  desc:"Automatically populate document templates from Google Sheets data — reports, proposals, and more.",       tag:"Google Workspace" },
  { icon:"🧾", title:"Invoice Generation",        desc:"Auto-generate and send professional invoices triggered by bookings, forms, or spreadsheet entries.",      tag:"Business Automation" },
];

// ── Color tokens — both modes sit over a DARK 3D background ──────────────────
const C = {
  label:       (d) => d ? "rgba(210,150,255,1)"   : "rgba(100,240,255,1)",
  heading:     (d) => d ? "#ffffff"               : "#e8fffe",
  accent:      (d) => d ? "#c084fc"               : "#22d3ee",
  body:        (d) => d ? "rgba(200,200,220,1)"   : "rgba(170,235,245,1)",
  muted:       (d) => d ? "rgba(160,160,190,1)"   : "rgba(130,210,230,1)",
  cardBg:      (d) => d ? "rgba(255,255,255,0.05)": "rgba(0,60,80,0.35)",
  cardBorder:  (d) => d ? "rgba(255,255,255,0.09)": "rgba(0,200,230,0.20)",
  cardHoverBg: (d) => d ? "rgba(255,255,255,0.10)": "rgba(0,80,110,0.50)",
  tagBg:       (d) => d ? "rgba(255,255,255,0.08)": "rgba(0,180,220,0.18)",
  tagBorder:   (d) => d ? "rgba(255,255,255,0.14)": "rgba(0,210,240,0.35)",
  tagText:     (d) => d ? "rgba(200,160,255,1)"   : "rgba(100,240,255,1)",
  btnBg:       (d) => d ? "rgba(255,255,255,0.10)": "rgba(8,145,178,1)",
  btnBorder:   (d) => d ? "rgba(255,255,255,0.22)": "transparent",
  btnText:     (d) => d ? "#ffffff"               : "#ffffff",
  btnHoverBg:  (d) => d ? "rgba(255,255,255,0.18)": "rgba(6,182,212,1)",
  btnShadow:   (d) => d ? "rgba(180,80,255,0.30)" : "rgba(6,182,212,0.40)",
  dotActive:   (d) => d ? "#a855f7"               : "#22d3ee",
  dotInactive: (d) => d ? "rgba(255,255,255,0.20)": "rgba(0,210,240,0.25)",
  accentGlow:  (d) => d ? "0 0 28px rgba(192,132,252,0.55)" : "0 0 28px rgba(34,211,238,0.50)",
  textShadow:  (d) => d ? "0 2px 20px rgba(0,0,0,0.8)"     : "0 2px 20px rgba(0,15,30,0.9)",
  arrowBtn:    (d) => d
    ? { bg:"rgba(255,255,255,0.10)", border:"rgba(255,255,255,0.18)", text:"#fff", hoverBg:"rgba(255,255,255,0.18)", disabledText:"rgba(255,255,255,0.20)" }
    : { bg:"rgba(0,60,80,0.40)",     border:"rgba(0,210,240,0.35)",   text:"#b0f0ff", hoverBg:"rgba(0,90,120,0.55)", disabledText:"rgba(0,210,240,0.20)" },
};

// ── Reusable glass card ────────────────────────────────────────────────────────
function GlassCard({ isDark, children, style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.cardHoverBg(isDark) : C.cardBg(isDark),
        border: `1px solid ${C.cardBorder(isDark)}`,
        borderRadius: "1rem",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: hov
          ? (isDark ? "0 8px 40px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,30,50,0.45)")
          : (isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,20,40,0.30)"),
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pagination({ page, totalPages, setPage, isDark }) {
  if (totalPages <= 1) return null;
  const [hovL, setHovL] = useState(false);
  const [hovR, setHovR] = useState(false);
  const arr = C.arrowBtn(isDark);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem", marginTop:"2.5rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          onMouseEnter={() => setHovL(true)}
          onMouseLeave={() => setHovL(false)}
          style={{
            width:40, height:40, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            background: page===0 ? "rgba(255,255,255,0.03)" : (hovL ? arr.hoverBg : arr.bg),
            border: `1px solid ${page===0 ? "rgba(255,255,255,0.08)" : arr.border}`,
            color: page===0 ? arr.disabledText : arr.text,
            cursor: page===0 ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{
              height:10, width: i===page ? 24 : 10,
              borderRadius:999,
              background: i===page ? C.dotActive(isDark) : C.dotInactive(isDark),
              border:"none", cursor:"pointer",
              transition:"all 0.25s",
              boxShadow: i===page ? C.accentGlow(isDark) : "none",
            }} />
          ))}
        </div>

        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          onMouseEnter={() => setHovR(true)}
          onMouseLeave={() => setHovR(false)}
          style={{
            width:40, height:40, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            background: page===totalPages-1 ? "rgba(255,255,255,0.03)" : (hovR ? arr.hoverBg : arr.bg),
            border: `1px solid ${page===totalPages-1 ? "rgba(255,255,255,0.08)" : arr.border}`,
            color: page===totalPages-1 ? arr.disabledText : arr.text,
            cursor: page===totalPages-1 ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p style={{ fontSize:"0.7rem", color: C.muted(isDark) }}>{page + 1} / {totalPages}</p>
    </div>
  );
}

export default function CaseStudies() {
  const { isDark } = useTheme();
  const [page, setPage] = useState(0);
  const [btnHov, setBtnHov] = useState(false);

  const totalPages = Math.ceil(CASE_STUDIES.length / PER_PAGE);
  const current    = CASE_STUDIES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const scrollToBook = () => {
    const el  = document.getElementById("book");
    const nav = document.querySelector("nav");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 76) - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div style={{ padding:"4rem 1.5rem" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
        <span style={{
          display:"inline-block",
          background: C.cardBg(isDark),
          border: `1px solid ${C.cardBorder(isDark)}`,
          color: C.label(isDark),
          fontSize:"0.75rem", fontWeight:700,
          letterSpacing:"0.14em", textTransform:"uppercase",
          padding:"0.3rem 1.1rem", borderRadius:999,
          marginBottom:"1.2rem",
          backdropFilter:"blur(10px)",
          textShadow: C.textShadow(isDark),
        }}>
          Real Results
        </span>

        <h2 style={{
          fontSize:"clamp(2rem, 5vw, 3.2rem)",
          fontWeight:800, lineHeight:1.1,
          color: C.heading(isDark),
          textShadow: C.textShadow(isDark),
          margin:"0 0 1rem",
        }}>
          Case{" "}
          <span style={{ color: C.accent(isDark), textShadow: C.accentGlow(isDark) }}>
            Studies
          </span>
        </h2>

        <p style={{
          fontSize:"1.05rem", lineHeight:1.7,
          color: C.body(isDark),
          textShadow: C.textShadow(isDark),
          maxWidth:"40rem", margin:"0 auto",
        }}>
          Real projects, real impact — automation systems and Notion solutions we've built for our clients.
        </p>
      </div>

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth:"72rem", margin:"0 auto",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",
        gap:"1.5rem",
      }}>
        {current.map((study, i) => (
          <GlassCard key={study.title + i} isDark={isDark} style={{
            padding:"1.75rem",
            display:"flex", flexDirection:"column", gap:"1rem",
          }}>
            <span style={{ fontSize:"2.4rem", lineHeight:1 }}>{study.icon}</span>

            <span style={{
              alignSelf:"flex-start",
              background: C.tagBg(isDark),
              border: `1px solid ${C.tagBorder(isDark)}`,
              color: C.tagText(isDark),
              fontSize:"0.72rem", fontWeight:600,
              padding:"0.25rem 0.75rem", borderRadius:999,
              letterSpacing:"0.05em",
            }}>
              {study.tag}
            </span>

            <h3 style={{
              fontWeight:700, fontSize:"1.15rem",
              color: C.heading(isDark),
              textShadow: C.textShadow(isDark),
              margin:0,
            }}>
              {study.title}
            </h3>

            <p style={{
              fontSize:"0.88rem", lineHeight:1.65,
              color: C.body(isDark),
              margin:0,
            }}>
              {study.desc}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} isDark={isDark} />

      {/* ── CTA banner ──────────────────────────────────────────────────── */}
      <GlassCard isDark={isDark} style={{
        maxWidth:"72rem", margin:"3.5rem auto 0",
        padding:"2rem 2.5rem",
        display:"flex", flexWrap:"wrap",
        alignItems:"center", justifyContent:"space-between",
        gap:"1.5rem",
      }}>
        <div>
          <h3 style={{
            fontWeight:700, fontSize:"1.4rem",
            color: C.heading(isDark),
            textShadow: C.textShadow(isDark),
            margin:"0 0 0.4rem",
          }}>
            Want results like these?
          </h3>
          <p style={{ color: C.body(isDark), margin:0, fontSize:"0.95rem" }}>
            Let's build your next automation system together.
          </p>
        </div>

        <button
          onClick={scrollToBook}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            padding:"0.85rem 2rem",
            borderRadius:"0.85rem",
            fontWeight:700, fontSize:"0.95rem",
            color: C.btnText(isDark),
            background: btnHov ? C.btnHoverBg(isDark) : C.btnBg(isDark),
            border: `1px solid ${C.btnBorder(isDark)}`,
            backdropFilter: isDark ? "blur(8px)" : "none",
            cursor:"pointer",
            boxShadow: `0 6px 28px ${C.btnShadow(isDark)}`,
            transform: btnHov ? "translateY(-2px)" : "translateY(0)",
            transition:"all 0.2s ease",
            whiteSpace:"nowrap",
            textShadow:"0 1px 4px rgba(0,0,0,0.35)",
          }}>
          📅 Book a Free Call
        </button>
      </GlassCard>

    </div>
  );
}
import { useTheme } from "./ThemeContext";
import { useState, useEffect } from "react";


const API_BASE         = import.meta.env.VITE_API_URL || "";
const NOTION_PROXY_URL = `${API_BASE}/api/notion-services`;
const PER_PAGE         = 6;

function parseService(page) {
  const props = page.properties;
  const title = props.Title?.title?.[0]?.plain_text || props.title?.title?.[0]?.plain_text || "Untitled";
  const desc  = props["Service Description"]?.rich_text?.map((r) => r.plain_text).join("")
             || props["service description"]?.rich_text?.map((r) => r.plain_text).join("") || "";
  const icon  = page.icon?.emoji || "🔧";
  const logoFile = props.Logo?.files?.[0] || props.logo?.files?.[0];
  const logo  = logoFile?.type === "external" ? logoFile.external.url : logoFile?.file?.url || null;
  return { title, desc, icon, logo };
}

// ── Color tokens — both modes sit over a DARK 3D background ──────────────────
const C = {
  label:       (d) => d ? "rgba(210,150,255,1)"   : "rgba(100,240,255,1)",
  heading:     (d) => d ? "#ffffff"               : "#e8fffe",
  accent:      (d) => d ? "#c084fc"               : "#22d3ee",
  body:        (d) => d ? "rgba(200,200,220,1)"   : "rgba(170,235,245,1)",
  muted:       (d) => d ? "rgba(150,150,180,1)"   : "rgba(120,200,220,1)",
  cardBg:      (d) => d ? "rgba(255,255,255,0.05)": "rgba(0,60,80,0.35)",
  cardBorder:  (d) => d ? "rgba(255,255,255,0.09)": "rgba(0,200,230,0.20)",
  cardHoverBg: (d) => d ? "rgba(255,255,255,0.10)": "rgba(0,80,110,0.50)",
  skeletonBg:  (d) => d ? "rgba(255,255,255,0.08)": "rgba(0,180,220,0.15)",
  btnBg:       (d) => d ? "rgba(255,255,255,0.10)": "rgba(8,145,178,1)",
  btnBorder:   (d) => d ? "rgba(255,255,255,0.22)": "transparent",
  btnText:     (d) => "#ffffff",
  btnHoverBg:  (d) => d ? "rgba(255,255,255,0.18)": "rgba(6,182,212,1)",
  btnShadow:   (d) => d ? "rgba(180,80,255,0.30)" : "rgba(6,182,212,0.40)",
  dotActive:   (d) => d ? "#a855f7"               : "#22d3ee",
  dotInactive: (d) => d ? "rgba(255,255,255,0.20)": "rgba(0,210,240,0.25)",
  accentGlow:  (d) => d ? "0 0 28px rgba(192,132,252,0.55)" : "0 0 28px rgba(34,211,238,0.50)",
  textShadow:  (d) => d ? "0 2px 20px rgba(0,0,0,0.8)"     : "0 2px 20px rgba(0,15,30,0.9)",
  arrowBtn:    (d) => d
    ? { bg:"rgba(255,255,255,0.10)", border:"rgba(255,255,255,0.18)", text:"#fff",    hoverBg:"rgba(255,255,255,0.18)", disabledText:"rgba(255,255,255,0.18)" }
    : { bg:"rgba(0,60,80,0.40)",     border:"rgba(0,210,240,0.35)",   text:"#b0f0ff", hoverBg:"rgba(0,90,120,0.55)",   disabledText:"rgba(0,200,230,0.18)"   },
};

// ── Reusable glass card ────────────────────────────────────────────────────────
function GlassCard({ isDark, children, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div
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

function SkeletonCard({ isDark }) {
  return (
    <div style={{
      background: C.cardBg(isDark),
      border: `1px solid ${C.cardBorder(isDark)}`,
      borderRadius: "1rem",
      padding: "1.5rem",
      display: "flex", flexDirection: "column", gap: "0.75rem",
      backdropFilter: "blur(12px)",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      {[40, 128, 200, 160].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? 40 : 12,
          width: i === 0 ? 40 : w,
          borderRadius: i === 0 ? "0.5rem" : 999,
          background: C.skeletonBg(isDark),
        }} />
      ))}
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
            border: `1px solid ${page===0 ? "rgba(255,255,255,0.07)" : arr.border}`,
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
            border: `1px solid ${page===totalPages-1 ? "rgba(255,255,255,0.07)" : arr.border}`,
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

export default function Services() {
  const { isDark } = useTheme();
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [page,     setPage]     = useState(0);
  const [btnHov,   setBtnHov]   = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true); setError(null);
        const res  = await fetch(NOTION_PROXY_URL);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setServices((data.results || []).map(parseService));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const totalPages = Math.ceil(services.length / PER_PAGE);
  const current    = services.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const scrollToBook = () => {
    const el  = document.getElementById("book");
    const nav = document.querySelector("nav");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 76) - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div style={{ padding:"4rem 1.5rem" }}>
      <style>{`
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

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
          What We Offer
        </span>

        <h2 style={{
          fontSize:"clamp(2rem, 5vw, 3.2rem)",
          fontWeight:800, lineHeight:1.1,
          color: C.heading(isDark),
          textShadow: C.textShadow(isDark),
          margin:"0 0 1rem",
        }}>
          Our{" "}
          <span style={{ color: C.accent(isDark), textShadow: C.accentGlow(isDark) }}>
            Services
          </span>
        </h2>

        <p style={{
          fontSize:"1.05rem", lineHeight:1.7,
          color: C.body(isDark),
          textShadow: C.textShadow(isDark),
          maxWidth:"40rem", margin:"0 auto",
        }}>
          From Notion workspaces to full automation pipelines — we build systems
          that save time, reduce errors, and scale with your business.
        </p>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <div className="services-grid" style={{
        maxWidth:"72rem", margin:"0 auto",
        display:"grid",
        gridTemplateColumns:"repeat(3, 1fr)",
        gridTemplateRows:"repeat(2, auto)",
        gap:"1.5rem",
      }}>
        {loading && [...Array(6)].map((_, i) => <SkeletonCard key={i} isDark={isDark} />)}

        {error && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"2.5rem 0" }}>
            <p style={{ color:"#f87171", fontSize:"0.875rem", marginBottom:"0.25rem" }}>⚠️ Failed to load services from Notion</p>
            <p style={{ color: C.muted(isDark), fontSize:"0.75rem" }}>{error}</p>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <p style={{ gridColumn:"1/-1", textAlign:"center", fontSize:"0.875rem", color: C.muted(isDark) }}>
            No services found in Notion database.
          </p>
        )}

        {!loading && !error && current.map((s, i) => (
          <GlassCard key={s.title + i} isDark={isDark} style={{
            padding:"1.75rem",
            display:"flex", flexDirection:"column", gap:"0.85rem",
          }}>
            {s.logo
              ? <img src={s.logo} alt={s.title} style={{ width:48, height:48, objectFit:"contain", borderRadius:"0.5rem" }} />
              : <span style={{ fontSize:"2.4rem", lineHeight:1 }}>{s.icon}</span>
            }
            <h3 style={{
              fontWeight:700, fontSize:"1.15rem",
              color: C.heading(isDark),
              textShadow: C.textShadow(isDark),
              margin:0,
            }}>
              {s.title}
            </h3>
            <p style={{
              fontSize:"0.875rem", lineHeight:1.65,
              color: C.body(isDark),
              margin:0,
            }}>
              {s.desc}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────────── */}
      {!loading && !error && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} isDark={isDark} />
      )}

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
            Need a custom automation?
          </h3>
          <p style={{ color: C.body(isDark), margin:0, fontSize:"0.95rem" }}>
            Tell us what you need — we'll build it for you.
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
          📅 Book a Consultation
        </button>
      </GlassCard>

    </div>
  );
}
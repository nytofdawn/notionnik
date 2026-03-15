import { useTheme } from "./ThemeContext";
import { useState, useEffect } from "react";

const API_BASE        = import.meta.env.VITE_API_URL || "";
const NOTION_PROXY_URL = `${API_BASE}/api/notion-team`;
const PER_PAGE        = 4;

const AVATAR_SEEDS  = ["Alex","Jordan","Morgan","Taylor","Sam","Casey","Riley","Drew"];
const AVATAR_COLORS = ["b6e3f4","c0aede","d1f4d1","ffd5dc","ffdfbf","c1e1c5","d4c5f9","f4d1b6"];

function getAvatar(name, index) {
  const seed  = encodeURIComponent(name || AVATAR_SEEDS[index % AVATAR_SEEDS.length]);
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${color}`;
}

function parseNotionTeamMember(page) {
  return {
    name:        page.name        || "Unknown",
    role:        page.skills      || "",
    description: page.description || "",
    image:       page.image       || null,
  };
}

const values = [
  { icon:"⚡", title:"Speed",       desc:"We build fast and deploy faster — your systems go live without the long wait." },
  { icon:"🎯", title:"Precision",   desc:"Every automation is tested, documented, and built to work exactly as intended." },
  { icon:"🔒", title:"Reliability", desc:"We design for uptime. Your workflows run 24/7 without breaking." },
  { icon:"🤝", title:"Partnership", desc:"We don't just deliver and disappear — we stay with you as your systems grow." },
];

// ── Color tokens — both modes sit over a DARK 3D background ──────────────────
// Dark  = deep space   (near-black bg, purple accents)
// Light = deep ocean   (dark teal abyss, cyan accents)
// → text must always be LIGHT; only hue changes
const C = {
  label:      (d) => d ? "rgba(210,150,255,1)"   : "rgba(100,240,255,1)",
  heading:    (d) => d ? "#ffffff"               : "#e8fffe",
  accent:     (d) => d ? "#c084fc"               : "#22d3ee",
  body:       (d) => d ? "rgba(200,200,220,1)"   : "rgba(170,235,245,1)",
  muted:      (d) => d ? "rgba(160,160,190,1)"   : "rgba(130,210,230,1)",
  cardBg:     (d) => d ? "rgba(255,255,255,0.05)": "rgba(0,60,80,0.35)",
  cardBorder: (d) => d ? "rgba(255,255,255,0.09)": "rgba(0,200,230,0.20)",
  cardHoverBg:(d) => d ? "rgba(255,255,255,0.10)": "rgba(0,80,110,0.50)",
  tagBg:      (d) => d ? "rgba(255,255,255,0.08)": "rgba(0,180,220,0.18)",
  tagBorder:  (d) => d ? "rgba(255,255,255,0.14)": "rgba(0,210,240,0.35)",
  tagText:    (d) => d ? "rgba(200,160,255,1)"   : "rgba(100,240,255,1)",
  avatarBorder:(d)=> d ? "rgba(255,255,255,0.18)": "rgba(0,210,240,0.40)",
  accentGlow: (d) => d ? "0 0 28px rgba(192,132,252,0.55)" : "0 0 28px rgba(34,211,238,0.50)",
  textShadow: (d) => d ? "0 2px 20px rgba(0,0,0,0.8)"     : "0 2px 20px rgba(0,15,30,0.9)",
  dotActive:  (d) => d ? "#a855f7"               : "#22d3ee",
  dotInactive:(d) => d ? "rgba(255,255,255,0.20)": "rgba(0,210,240,0.25)",
  arrowBtn:   (d) => d
    ? { bg:"rgba(255,255,255,0.10)", border:"rgba(255,255,255,0.18)", text:"#fff", hoverBg:"rgba(255,255,255,0.18)" }
    : { bg:"rgba(0,60,80,0.40)",     border:"rgba(0,210,240,0.35)",   text:"#b0f0ff", hoverBg:"rgba(0,90,120,0.55)" },
};

function SkeletonCard({ isDark }) {
  return (
    <div style={{
      background: C.cardBg(isDark),
      border: `1px solid ${C.cardBorder(isDark)}`,
      borderRadius: "1rem",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      backdropFilter: "blur(12px)",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ width:96, height:96, borderRadius:"50%", background: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,180,220,0.20)" }} />
      <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem" }}>
        {[128,80,200,160].map((w,i) => (
          <div key={i} style={{ height:10, width:w, borderRadius:999, background: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,180,220,0.20)" }} />
        ))}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, setPage, isDark }) {
  if (totalPages <= 1) return null;
  const [hovLeft,  setHovLeft]  = useState(false);
  const [hovRight, setHovRight] = useState(false);
  const arr = C.arrowBtn(isDark);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem", marginTop:"2rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>

        {/* Prev */}
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          onMouseEnter={() => setHovLeft(true)}
          onMouseLeave={() => setHovLeft(false)}
          style={{
            width:40, height:40, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            background: page===0 ? "rgba(255,255,255,0.03)" : (hovLeft ? arr.hoverBg : arr.bg),
            border: `1px solid ${page===0 ? "rgba(255,255,255,0.08)" : arr.border}`,
            color: page===0 ? "rgba(255,255,255,0.20)" : arr.text,
            cursor: page===0 ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{
              height:10,
              width: i===page ? 24 : 10,
              borderRadius:999,
              background: i===page ? C.dotActive(isDark) : C.dotInactive(isDark),
              border:"none", cursor:"pointer",
              transition:"all 0.25s",
              boxShadow: i===page ? C.accentGlow(isDark) : "none",
            }} />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          onMouseEnter={() => setHovRight(true)}
          onMouseLeave={() => setHovRight(false)}
          style={{
            width:40, height:40, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            background: page===totalPages-1 ? "rgba(255,255,255,0.03)" : (hovRight ? arr.hoverBg : arr.bg),
            border: `1px solid ${page===totalPages-1 ? "rgba(255,255,255,0.08)" : arr.border}`,
            color: page===totalPages-1 ? "rgba(255,255,255,0.20)" : arr.text,
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

// ── Reusable glass card ────────────────────────────────────────────────────────
function GlassCard({ isDark, children, style = {}, ...rest }) {
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
      {...rest}
    >
      {children}
    </div>
  );
}

export default function AboutUs() {
  const { isDark } = useTheme();
  const [team,    setTeam]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [page,    setPage]    = useState(0);

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true); setError(null);
        const res  = await fetch(NOTION_PROXY_URL);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const members = (data.results || []).map((p, i) => {
          const parsed = parseNotionTeamMember(p);
          return { ...parsed, img: parsed.image || getAvatar(parsed.name, i) };
        });
        members.sort((a, b) => {
          const aL = /leader/i.test(a.role), bL = /leader/i.test(b.role);
          return aL && !bL ? -1 : !aL && bL ? 1 : 0;
        });
        setTeam(members);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const totalPages  = Math.ceil(team.length / PER_PAGE);
  const currentTeam = team.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div style={{ padding: "4rem 1.5rem" }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", marginBottom:"4rem", maxWidth:"48rem", margin:"0 auto 4rem" }}>
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
          Who We Are
        </span>

        <h2 style={{
          fontSize:"clamp(2rem, 5vw, 3.2rem)",
          fontWeight:800, lineHeight:1.1,
          color: C.heading(isDark),
          textShadow: C.textShadow(isDark),
          margin:"0 0 1.2rem",
        }}>
          We Build{" "}
          <span style={{ color: C.accent(isDark), textShadow: C.accentGlow(isDark) }}>
            Systems
          </span>
          {" "}That Work While You Sleep
        </h2>

        <p style={{
          fontSize:"1.05rem", lineHeight:1.7,
          color: C.body(isDark),
          textShadow: C.textShadow(isDark),
        }}>
          Notionnik is a team of automation specialists, Notion experts, and systems thinkers
          dedicated to helping businesses eliminate repetitive work and operate at a higher level.
        </p>
      </div>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth:"72rem", margin:"0 auto 4rem",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",
        gap:"1.25rem",
      }}>
        {values.map((v) => (
          <GlassCard key={v.title} isDark={isDark} style={{ padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <span style={{ fontSize:"2rem" }}>{v.icon}</span>
            <h3 style={{ fontWeight:700, fontSize:"1.1rem", color: C.heading(isDark), margin:0, textShadow: C.textShadow(isDark) }}>
              {v.title}
            </h3>
            <p style={{ fontSize:"0.88rem", lineHeight:1.6, color: C.body(isDark), margin:0 }}>
              {v.desc}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:"72rem", margin:"0 auto 4rem" }}>
        <h2 style={{
          fontWeight:700, fontSize:"1.5rem",
          textAlign:"center", marginBottom:"2rem",
          color: C.heading(isDark),
          textShadow: C.textShadow(isDark),
        }}>
          👥 Meet the Team
        </h2>

        {error && (
          <div style={{ textAlign:"center", padding:"2.5rem 0" }}>
            <p style={{ color:"#f87171", fontSize:"0.875rem", marginBottom:"0.25rem" }}>⚠️ Failed to load team from Notion</p>
            <p style={{ color: C.muted(isDark), fontSize:"0.75rem" }}>{error}</p>
          </div>
        )}

        {loading && !error && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"1.5rem" }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} isDark={isDark} />)}
          </div>
        )}

        {!loading && !error && team.length === 0 && (
          <p style={{ textAlign:"center", fontSize:"0.875rem", color: C.muted(isDark) }}>
            No team members found in Notion database.
          </p>
        )}

        {!loading && !error && team.length > 0 && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"1.5rem" }}>
              {currentTeam.map((m, i) => (
                <GlassCard key={m.name + i} isDark={isDark} style={{
                  padding:"1.5rem",
                  display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:"1rem",
                }}>
                  {/* Avatar */}
                  <div style={{
                    width:96, height:96, borderRadius:"50%", overflow:"hidden",
                    border: `3px solid ${C.avatarBorder(isDark)}`,
                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,100,130,0.30)",
                    boxShadow: isDark ? "0 0 20px rgba(180,80,255,0.25)" : "0 0 20px rgba(0,200,240,0.30)",
                    flexShrink:0,
                  }}>
                    <img src={m.img} alt={m.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>

                  <div>
                    <h3 style={{ fontWeight:700, fontSize:"1.1rem", color: C.heading(isDark), margin:"0 0 0.3rem", textShadow: C.textShadow(isDark) }}>
                      {m.name}
                    </h3>
                    <span style={{
                      display:"inline-block",
                      background: C.tagBg(isDark),
                      border: `1px solid ${C.tagBorder(isDark)}`,
                      color: C.tagText(isDark),
                      fontSize:"0.72rem", fontWeight:600,
                      padding:"0.25rem 0.75rem", borderRadius:999,
                      marginBottom:"0.75rem",
                      letterSpacing:"0.05em",
                    }}>
                      {m.role}
                    </span>
                    <p style={{ fontSize:"0.85rem", lineHeight:1.6, color: C.body(isDark), margin:0 }}>
                      {m.description}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} isDark={isDark} />
          </>
        )}
      </div>

      {/* ── Mission & Approach ────────────────────────────────────────── */}
      <div style={{
        maxWidth:"72rem", margin:"0 auto",
        display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",
        gap:"1.5rem",
      }}>
        {[
          {
            emoji:"🎯", title:"Our Mission",
            text:"To eliminate manual, repetitive work from every business we touch. Your time is too valuable to be spent on tasks a well-built system can handle. We engineer those systems so you can focus on growing — not grinding.",
          },
          {
            emoji:"🚀", title:"Our Approach",
            text:"We start by understanding your workflow, then design a custom automation strategy using the best tools for your needs — Notion, n8n, Make, Google Apps, or AI. Every solution is built to scale as your business grows.",
          },
        ].map((card) => (
          <GlassCard key={card.title} isDark={isDark} style={{ padding:"2rem" }}>
            <h3 style={{
              fontSize:"1.4rem", fontWeight:700, marginBottom:"0.75rem",
              color: C.heading(isDark), textShadow: C.textShadow(isDark),
            }}>
              {card.emoji} {card.title}
            </h3>
            <p style={{ lineHeight:1.75, color: C.body(isDark), margin:0, fontSize:"0.95rem" }}>
              {card.text}
            </p>
          </GlassCard>
        ))}
      </div>

    </div>
  );
}
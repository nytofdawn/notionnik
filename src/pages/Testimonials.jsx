import { useState } from "react";
import { useTheme } from "./ThemeContext";

const TESTIMONIALS = [
  { name: "Sarah Johnson",    company: "Bloom & Co.",           feedback: "Notionnik completely transformed how we manage our projects. The automation they built saves us at least 10 hours every week. Absolutely worth it.",         rating: 5, avatar: "SJ" },
  { name: "Marcus Reyes",     company: "Reyes Digital Agency",   feedback: "We went from chaos to clarity in two weeks. Our Notion workspace is now something the whole team actually enjoys using.",                                     rating: 5, avatar: "MR" },
  { name: "Lena Park",        company: "Park Consulting",        feedback: "The invoice automation alone paid for the service in the first month. Fast, reliable, and genuinely helpful team.",                                           rating: 5, avatar: "LP" },
  { name: "Tom Westra",       company: "Westra Logistics",       feedback: "I was skeptical at first but the results speak for themselves. Our reporting workflow is now fully automated.",                                               rating: 4, avatar: "TW" },
  { name: "Anika Sharma",     company: "GrowthLab PH",           feedback: "Super responsive team and they really took time to understand our business before building anything. Highly recommend.",                                      rating: 5, avatar: "AS" },
  { name: "Daniel Cruz",      company: "Cruz E-Commerce",        feedback: "The Shopify uploader they built handles hundreds of products without a single error. Game changer for our store.",                                            rating: 5, avatar: "DC" },
  { name: "Priya Menon",      company: "Menon Studios",          feedback: "Our content pipeline used to take days. Now it runs on autopilot. The video generation workflow they set up is incredible.",                                  rating: 5, avatar: "PM" },
  { name: "James Okafor",     company: "Okafor Ventures",        feedback: "Straightforward process, clear communication, and the end result exceeded expectations. Will definitely work with them again.",                               rating: 5, avatar: "JO" },
  { name: "Camille Fontaine", company: "Fontaine Creative",      feedback: "They built us a Google Sheets to document pipeline that saves our team hours every single week. Brilliant work.",                                            rating: 4, avatar: "CF" },
  { name: "Ryan Matsuda",     company: "Matsuda & Partners",     feedback: "Our meeting notes used to pile up and never get actioned. Now they're summarized and pushed to Notion automatically. Life-changing.",                         rating: 5, avatar: "RM" },
  { name: "Elena Vasquez",    company: "Vasquez Marketing",      feedback: "The team really listens. They built exactly what we needed without overcomplicating things. Clean, reliable automation.",                                     rating: 5, avatar: "EV" },
  { name: "Ben Thornton",     company: "Thornton Real Estate",   feedback: "We use their invoice generation system daily. It triggers automatically from our bookings and we never have to think about it.",                             rating: 5, avatar: "BT" },
  { name: "Fatima Al-Rashid", company: "Al-Rashid Group",        feedback: "Professional, fast, and the results were exactly what we needed. Our entire back-office is now systemized thanks to Notionnik.",                             rating: 5, avatar: "FA" },
  { name: "Lucas Brandt",     company: "Brandt Tech",            feedback: "I've worked with other automation agencies before but none came close to the quality and attention to detail Notionnik delivers.",                           rating: 5, avatar: "LB" },
  { name: "Soo-Yeon Kim",     company: "Kim Advisory",           feedback: "Notion used to be a mess for us. Now it's a proper system our whole team depends on. The setup was smooth and well-documented.",                            rating: 4, avatar: "SK" },
  { name: "Omar Hassan",      company: "Hassan Imports",         feedback: "They automated our entire product listing workflow. What used to take a full day now happens in minutes. Exceptional service.",                              rating: 5, avatar: "OH" },
  { name: "Nina Castillo",    company: "Castillo Events",        feedback: "Every event we run now has a fully automated debrief workflow. Notionnik nailed exactly what we asked for and delivered ahead of schedule.",                 rating: 5, avatar: "NC" },
  { name: "David Lowe",       company: "Lowe & Associates",      feedback: "From the first call to final delivery, everything was smooth. The automation they built has genuinely changed how we operate day to day.",                   rating: 5, avatar: "DL" },
];

const PER_PAGE = 6;

const AVATAR_COLORS = [
  ["#6366f1","#818cf8"],
  ["#ec4899","#f472b6"],
  ["#14b8a6","#2dd4bf"],
  ["#f59e0b","#fbbf24"],
  ["#8b5cf6","#a78bfa"],
  ["#10b981","#34d399"],
];

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
  divider:     (d) => d ? "rgba(255,255,255,0.08)": "rgba(0,200,230,0.15)",
  quoteMark:   (d) => d ? "rgba(255,255,255,0.08)": "rgba(0,200,230,0.18)",
  dotActive:   (d) => d ? "#a855f7"               : "#22d3ee",
  dotInactive: (d) => d ? "rgba(255,255,255,0.20)": "rgba(0,210,240,0.25)",
  accentGlow:  (d) => d ? "0 0 28px rgba(192,132,252,0.55)" : "0 0 28px rgba(34,211,238,0.50)",
  textShadow:  (d) => d ? "0 2px 20px rgba(0,0,0,0.8)"     : "0 2px 20px rgba(0,15,30,0.9)",
  starEmpty:   (d) => d ? "rgba(255,255,255,0.15)"          : "rgba(0,200,230,0.25)",
  arrowBtn:    (d) => d
    ? { bg:"rgba(255,255,255,0.10)", border:"rgba(255,255,255,0.18)", text:"#fff",    hoverBg:"rgba(255,255,255,0.18)", disabledText:"rgba(255,255,255,0.18)" }
    : { bg:"rgba(0,60,80,0.40)",     border:"rgba(0,210,240,0.35)",   text:"#b0f0ff", hoverBg:"rgba(0,90,120,0.55)",   disabledText:"rgba(0,200,230,0.18)"   },
};

function StarRating({ rating, isDark }) {
  return (
    <div style={{ display:"flex", gap:"0.2rem" }}>
      {[1,2,3,4,5].map((star) => (
        <svg key={star} width="16" height="16" viewBox="0 0 24 24"
          fill={star <= rating ? "#fbbf24" : C.starEmpty(isDark)}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function AvatarInitials({ initials, index }) {
  const [from, to] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div style={{
      width:44, height:44, borderRadius:"50%",
      display:"flex", alignItems:"center", justifyContent:"center",
      background: `linear-gradient(135deg, ${from}, ${to})`,
      color:"#fff", fontWeight:700, fontSize:"0.85rem",
      flexShrink:0,
      boxShadow:`0 2px 12px ${from}66`,
    }}>
      {initials}
    </div>
  );
}

function GlassCard({ isDark, children, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:"relative",
        background: hov ? C.cardHoverBg(isDark) : C.cardBg(isDark),
        border: `1px solid ${C.cardBorder(isDark)}`,
        borderRadius:"1rem",
        backdropFilter:"blur(14px)",
        WebkitBackdropFilter:"blur(14px)",
        boxShadow: hov
          ? (isDark ? "0 8px 40px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,30,50,0.45)")
          : (isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,20,40,0.30)"),
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition:"all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pagination({ page, totalPages, setPage, isDark }) {
  const [hovL, setHovL] = useState(false);
  const [hovR, setHovR] = useState(false);
  const arr = C.arrowBtn(isDark);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.65rem", marginTop:"2.5rem" }}>
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
            transition:"all 0.2s",
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
            transition:"all 0.2s",
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

export default function Testimonials() {
  const { isDark } = useTheme();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
  const current    = TESTIMONIALS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div style={{ padding:"4rem 1.5rem" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign:"center", marginBottom:"3rem" }}>
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
          What Clients Say
        </span>

        <h2 style={{
          fontSize:"clamp(2rem, 5vw, 3.2rem)",
          fontWeight:800, lineHeight:1.1,
          color: C.heading(isDark),
          textShadow: C.textShadow(isDark),
          margin:"0 0 1rem",
        }}>
          <span style={{ color: C.accent(isDark), textShadow: C.accentGlow(isDark) }}>
            Testimonials
          </span>
        </h2>

        <p style={{
          fontSize:"1.05rem", lineHeight:1.7,
          color: C.body(isDark),
          textShadow: C.textShadow(isDark),
          maxWidth:"40rem", margin:"0 auto",
        }}>
          Real feedback from businesses we've helped systemize and scale.
        </p>
      </div>

      {/* ── Cards grid ──────────────────────────────────────────────────── */}
      <div style={{
        maxWidth:"72rem", margin:"0 auto",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",
        gap:"1.5rem",
      }}>
        {current.map((t, i) => (
          <GlassCard key={t.name} isDark={isDark} style={{
            padding:"1.75rem",
            display:"flex", flexDirection:"column", gap:"1rem",
          }}>
            {/* Decorative quote mark */}
            <span style={{
              position:"absolute", top:"1rem", right:"1.25rem",
              fontSize:"4.5rem", fontFamily:"Georgia, serif", lineHeight:1,
              color: C.quoteMark(isDark),
              userSelect:"none", pointerEvents:"none",
            }}>
              "
            </span>

            <StarRating rating={t.rating} isDark={isDark} />

            <p style={{
              fontSize:"0.875rem", lineHeight:1.7,
              color: C.body(isDark),
              flex:1, margin:0,
              textShadow: C.textShadow(isDark),
            }}>
              "{t.feedback}"
            </p>

            {/* Divider */}
            <div style={{ height:1, background: C.divider(isDark) }} />

            {/* Author */}
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <AvatarInitials initials={t.avatar} index={page * PER_PAGE + i} />
              <div>
                <p style={{
                  fontWeight:700, fontSize:"0.9rem",
                  color: C.heading(isDark),
                  textShadow: C.textShadow(isDark),
                  margin:0,
                }}>
                  {t.name}
                </p>
                <p style={{
                  fontSize:"0.75rem",
                  color: C.muted(isDark),
                  margin:0,
                }}>
                  {t.company}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────────── */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} isDark={isDark} />

    </div>
  );
}
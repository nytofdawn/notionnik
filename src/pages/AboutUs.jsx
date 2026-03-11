import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";
const NOTION_PROXY_URL = `${API_BASE}/api/notion-services`;

const AVATAR_SEEDS = ["Alex", "Jordan", "Morgan", "Taylor", "Sam", "Casey", "Riley", "Drew"];
const AVATAR_COLORS = ["b6e3f4", "c0aede", "d1f4d1", "ffd5dc", "ffdfbf", "c1e1c5", "d4c5f9", "f4d1b6"];

function getAvatar(name, index) {
  const seed = encodeURIComponent(name || AVATAR_SEEDS[index % AVATAR_SEEDS.length]);
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${color}`;
}

// Parses a Notion page's properties into { name, role, description }
function parseNotionTeamMember(page) {
  const props = page.properties;

  const name =
    props.Name?.title?.[0]?.plain_text ||
    props.name?.title?.[0]?.plain_text ||
    "Unknown";

  const role =
    props.Role?.rich_text?.[0]?.plain_text ||
    props.role?.rich_text?.[0]?.plain_text ||
    props.Role?.select?.name ||
    props.role?.select?.name ||
    "";

  const description =
    props.Description?.rich_text?.[0]?.plain_text ||
    props.description?.rich_text?.[0]?.plain_text ||
    props.Description?.rich_text?.map((r) => r.plain_text).join("") ||
    "";

  // ── Image (Files & Media) ──
  const imageFile = props.Image?.files?.[0] || props.image?.files?.[0];
  const image =
    imageFile?.type === "external"
      ? imageFile.external.url
      : imageFile?.file?.url || null;

  return { name, role, description, image };
}

const values = [
  { icon: "⚡", title: "Speed",       desc: "We build fast and deploy faster — your systems go live without the long wait." },
  { icon: "🎯", title: "Precision",   desc: "Every automation is tested, documented, and built to work exactly as intended." },
  { icon: "🔒", title: "Reliability", desc: "We design for uptime. Your workflows run 24/7 without breaking." },
  { icon: "🤝", title: "Partnership", desc: "We don't just deliver and disappear — we stay with you as your systems grow." },
];

// ─── SKELETON CARD ─────────────────────────────────────────────────────────
function SkeletonCard({ isDark }) {
  const bg = isDark ? "bg-white/5 border-white/8" : "bg-white/60 border-blue-200";
  const shimmer = isDark ? "bg-white/10" : "bg-blue-100";
  return (
    <div className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center gap-4 animate-pulse ${bg}`}>
      <div className={`w-24 h-24 rounded-full ${shimmer}`} />
      <div className="w-full flex flex-col items-center gap-2">
        <div className={`h-4 w-32 rounded-full ${shimmer}`} />
        <div className={`h-3 w-20 rounded-full ${shimmer}`} />
        <div className={`h-3 w-full rounded ${shimmer}`} />
        <div className={`h-3 w-5/6 rounded ${shimmer}`} />
      </div>
    </div>
  );
}

export default function AboutUs() {
  const { isDark } = useTheme();

  const textMain   = isDark ? "text-white"        : "text-blue-950";
  const textSub    = isDark ? "text-white/60"      : "text-blue-900/80";
  const cardBg     = isDark ? "bg-white/5"         : "bg-white/60";
  const cardBorder = isDark ? "border-white/8"     : "border-blue-200";
  const cardHover  = isDark ? "hover:bg-white/10"  : "hover:bg-white";
  const tagBg      = isDark
    ? "bg-white/8 border-white/12 text-white/60"
    : "bg-blue-100 border-blue-200 text-blue-700";
  const glow       = isDark ? "0 0 40px rgba(180,60,100,0.5)" : "none";

  const [team, setTeam]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        setError(null);

        // ── Fetches from your backend proxy ──
        const res = await fetch(NOTION_PROXY_URL);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        // data.results = Notion pages array
        const members = (data.results || []).map((page, i) => {
          const parsed = parseNotionTeamMember(page);
          return {
            ...parsed,
            img: parsed.image || getAvatar(parsed.name, i), // Notion image, fallback to avatar
          };
        });

        setTeam(members);
      } catch (err) {
        console.error("Failed to fetch Notion team:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  return (
    <div className="relative min-h-screen py-16 px-6">
      <PageBackground />

      <div className="relative z-10">
        {/* ── Header ── */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
            Who We Are
          </span>
          <h1 className={`text-5xl font-bold mb-5 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
            We Build Systems That Work While You Sleep
          </h1>
          <p className={`text-lg leading-relaxed ${textSub}`}>
            Notionnik is a team of automation specialists, Notion experts, and systems thinkers
            dedicated to helping businesses eliminate repetitive work and operate at a higher
            level — through smart workflows, clean integrations, and powerful tools.
          </p>
        </div>

        {/* ── Values ── */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {values.map((v) => (
            <div key={v.title}
              className={`backdrop-blur-md border rounded-2xl p-5 flex flex-col gap-3 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg ${cardBg} ${cardBorder}`}>
              <span className="text-3xl">{v.icon}</span>
              <h3 className={`font-bold text-lg ${textMain}`}>{v.title}</h3>
              <p className={`text-sm leading-relaxed ${textSub}`}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Team ── */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className={`font-bold text-2xl mb-8 text-center ${textMain}`} style={{ textShadow: glow }}>
            👥 Meet the Team
          </h2>

          {/* Error state */}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-400 text-sm mb-1">⚠️ Failed to load team from Notion</p>
              <p className="text-white/30 text-xs">{error}</p>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} isDark={isDark} />
              ))}
            </div>
          )}

          {/* Loaded team */}
          {!loading && !error && team.length === 0 && (
            <p className={`text-center text-sm ${textSub}`}>No team members found in Notion database.</p>
          )}

          {!loading && !error && team.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((m) => (
                <div key={m.name}
                  className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center text-center gap-4 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg ${cardBg} ${cardBorder}`}>
                  <div className={`w-24 h-24 rounded-full overflow-hidden border-4 shadow-md bg-white/10 ${isDark ? "border-white/15" : "border-blue-200"}`}>
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className={`font-bold text-xl ${textMain}`}>{m.name}</h2>
                    <span className={`inline-block mt-1 mb-3 text-xs font-semibold border rounded-full px-3 py-1 ${tagBg}`}>
                      {m.role}
                    </span>
                    <p className={`text-sm leading-relaxed ${textSub}`}>{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Mission & Approach ── */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`backdrop-blur-md border rounded-2xl p-8 shadow-xl ${cardBg} ${cardBorder}`}>
            <h2 className={`text-2xl font-bold mb-3 ${textMain}`} style={{ textShadow: glow }}>🎯 Our Mission</h2>
            <p className={`leading-relaxed ${textSub}`}>
              To eliminate manual, repetitive work from every business we touch.
              Your time is too valuable to be spent on tasks a well-built system can handle.
              We engineer those systems so you can focus on growing — not grinding.
            </p>
          </div>
          <div className={`backdrop-blur-md border rounded-2xl p-8 shadow-xl ${cardBg} ${cardBorder}`}>
            <h2 className={`text-2xl font-bold mb-3 ${textMain}`} style={{ textShadow: glow }}>🚀 Our Approach</h2>
            <p className={`leading-relaxed ${textSub}`}>
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
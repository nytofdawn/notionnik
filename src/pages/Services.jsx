import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";
import { useState, useEffect } from "react";


const API_BASE = import.meta.env.VITE_API_URL || "";
const NOTION_PROXY_URL = `${API_BASE}/api/notion-services`;

function parseService(page) {
  const props = page.properties;

  const title =
    props.Title?.title?.[0]?.plain_text ||
    props.title?.title?.[0]?.plain_text ||
    "Untitled";

  const desc =
    props["Service Description"]?.rich_text?.map((r) => r.plain_text).join("") ||
    props["service description"]?.rich_text?.map((r) => r.plain_text).join("") ||
    "";

  const icon = page.icon?.emoji || "🔧";

  // ── Logo (Files & Media) ──
  const logoFile = props.Logo?.files?.[0] || props.logo?.files?.[0];
  const logo =
    logoFile?.type === "external"
      ? logoFile.external.url
      : logoFile?.file?.url || null;

  return { title, desc, icon, logo };
}

function SkeletonCard({ cardBg, cardBorder }) {
  return (
    <div className={`animate-pulse backdrop-blur-md border rounded-2xl p-6 flex flex-col gap-3 ${cardBg} ${cardBorder}`}>
      <div className="w-10 h-10 rounded-lg bg-white/10" />
      <div className="h-4 w-32 rounded-full bg-white/10" />
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-3 w-5/6 rounded bg-white/10" />
    </div>
  );
}

export default function Services() {
  const { isDark } = useTheme();

  const textMain   = isDark ? "text-white"        : "text-blue-950";
  const textSub    = isDark ? "text-white/60"      : "text-blue-900/80";
  const cardBg     = isDark ? "bg-white/5"         : "bg-white/60";
  const cardBorder = isDark ? "border-white/8"     : "border-blue-200";
  const cardHover  = isDark ? "hover:bg-white/10"  : "hover:bg-white";
  const btnStyle   = isDark
    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/18"
    : "bg-blue-600 text-white hover:bg-blue-700";
  const glow = isDark ? "0 0 40px rgba(180,60,100,0.5)" : "none";

  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(NOTION_PROXY_URL);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setServices((data.results || []).map(parseService));
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="relative min-h-screen py-16 px-6">
      <PageBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
            What We Offer
          </span>
          <h1 className={`text-5xl font-bold mb-4 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
            Our Services
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textSub}`}>
            From Notion workspaces to full automation pipelines — we build systems
            that save time, reduce errors, and scale with your business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Loading skeletons */}
          {loading && [...Array(6)].map((_, i) => (
            <SkeletonCard key={i} cardBg={cardBg} cardBorder={cardBorder} />
          ))}

          {/* Error state */}
          {error && (
            <div className="col-span-full text-center py-10">
              <p className="text-red-400 text-sm mb-1">⚠️ Failed to load services from Notion</p>
              <p className="text-white/30 text-xs">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && services.length === 0 && (
            <p className={`col-span-full text-center text-sm ${textSub}`}>
              No services found in Notion database.
            </p>
          )}

          {/* Loaded services */}
          {!loading && !error && services.map((s) => (
            <div key={s.title}
            className={`backdrop-blur-md border rounded-2xl p-6 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-3 group ${cardBg} ${cardBorder}`}>

            {/* Logo or emoji fallback */}
            {s.logo ? (
              <img
                src={s.logo}
                alt={s.title}
                className="w-12 h-12 object-contain rounded-lg"
              />
            ) : (
              <span className="text-4xl">{s.icon}</span>
            )}

            <h2 className={`font-bold text-xl group-hover:opacity-80 transition-opacity ${textMain}`}>
              {s.title}
            </h2>
            <p className={`text-sm leading-relaxed ${textSub}`}>{s.desc}</p>
          </div>
          ))}

        </div>

        {/* CTA */}
        <div className={`max-w-6xl mx-auto mt-14 backdrop-blur-md border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${cardBg} ${cardBorder}`}>
          <div>
            <h3 className={`font-bold text-2xl mb-1 ${textMain}`} style={{ textShadow: glow }}>
              Need a custom automation?
            </h3>
            <p className={textSub}>Tell us what you need — we'll build it for you.</p>
          </div>
          <a href="/book"
            className={`font-bold px-8 py-3 rounded-xl hover:-translate-y-1 transition-all duration-200 shadow-lg whitespace-nowrap ${btnStyle}`}>
            📅 Book a Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
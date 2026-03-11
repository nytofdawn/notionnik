import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";

const API_BASE              = import.meta.env.VITE_API_URL || "";
const NOTION_TEAM_URL       = `${API_BASE}/api/notion-team`;
const NOTION_SERVICES_URL   = `${API_BASE}/api/notion-services`;

const AVATAR_SEEDS  = ["Alex","Jordan","Morgan","Taylor","Sam","Casey","Riley","Drew"];
const AVATAR_COLORS = ["b6e3f4","c0aede","d1f4d1","ffd5dc","ffdfbf","c1e1c5","d4c5f9","f4d1b6"];

function getAvatar(name, index) {
  const seed  = encodeURIComponent(name || AVATAR_SEEDS[index % AVATAR_SEEDS.length]);
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${color}`;
}

function parseNotionTeamMember(page) {
  const props = page.properties;
  const name  = props.Name?.title?.[0]?.plain_text  || props.name?.title?.[0]?.plain_text  || "Unknown";
  const role  = props.Role?.rich_text?.[0]?.plain_text || props.role?.rich_text?.[0]?.plain_text
             || props.Role?.select?.name             || props.role?.select?.name            || "";
  const description =
    props.Description?.rich_text?.[0]?.plain_text ||
    props.description?.rich_text?.[0]?.plain_text ||
    props.Description?.rich_text?.map((r) => r.plain_text).join("") || "";
  const imageFile = props.Image?.files?.[0] || props.image?.files?.[0];
  const image = imageFile?.type === "external"
    ? imageFile.external.url
    : imageFile?.file?.url || null;
  return { name, role, description, image };
}

function SkeletonCard({ isDark }) {
  const bg      = isDark ? "bg-white/5 border-white/8"   : "bg-white/60 border-blue-200";
  const shimmer = isDark ? "bg-white/10"                  : "bg-blue-100";
  return (
    <div className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center gap-4 animate-pulse ${bg}`}>
      <div className={`w-20 h-20 rounded-full ${shimmer}`} />
      <div className="w-full flex flex-col items-center gap-2">
        <div className={`h-4 w-32 rounded-full ${shimmer}`} />
        <div className={`h-3 w-20 rounded-full ${shimmer}`} />
        <div className={`h-3 w-full rounded ${shimmer}`} />
        <div className={`h-3 w-5/6 rounded ${shimmer}`} />
      </div>
    </div>
  );
}

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

function ServiceSkeletonCard({ cardBg, cardBorder }) {
  return (
    <div className={`animate-pulse backdrop-blur-md border rounded-2xl p-6 flex flex-col gap-3 ${cardBg} ${cardBorder}`}>
      <div className="w-10 h-10 rounded-lg bg-white/10" />
      <div className="h-4 w-32 rounded-full bg-white/10" />
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-3 w-5/6 rounded bg-white/10" />
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CASE_STUDIES = [
  { icon:"🛍️", title:"Shopify Product Uploader",  desc:"Automated bulk product uploads to your Shopify store — no manual entry, no errors.",                    tag:"E-Commerce Automation" },
  { icon:"🗒️", title:"Meeting Summary to Notion", desc:"Auto-generate meeting summaries and push them directly into your Notion database.",                       tag:"Notion Integration" },
  { icon:"🎬", title:"Video Generation",           desc:"AI-powered automated video creation pipelines for content, marketing, and social media.",                 tag:"AI Automation" },
  { icon:"📄", title:"Google Sheet to Document",  desc:"Automatically populate document templates from Google Sheets data — reports, proposals, and more.",        tag:"Google Workspace" },
  { icon:"🧾", title:"Invoice Generation",        desc:"Auto-generate and send professional invoices triggered by bookings, forms, or spreadsheet entries.",       tag:"Business Automation" },
];


const VALUES = [
  { icon:"⚡", title:"Speed",       desc:"We build fast and deploy faster — your systems go live without the long wait." },
  { icon:"🎯", title:"Precision",   desc:"Every automation is tested, documented, and built to work exactly as intended." },
  { icon:"🔒", title:"Reliability", desc:"We design for uptime. Your workflows run 24/7 without breaking." },
  { icon:"🤝", title:"Partnership", desc:"We don't just deliver and disappear — we stay with you as your systems grow." },
];

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionDivider({ isDark }) {
  return (
    <div className="w-full max-w-6xl mx-auto flex items-center gap-4 px-6 my-2">
      <div className={`flex-1 h-px ${isDark ? "bg-white/8" : "bg-black/10"}`} />
      <div className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/20" : "bg-black/20"}`} />
      <div className={`flex-1 h-px ${isDark ? "bg-white/8" : "bg-black/10"}`} />
    </div>
  );
}

// ─── Calendly Section ─────────────────────────────────────────────────────────
function BookSection({ isDark }) {
  const calendlyRef = useRef(null);

  const textMain   = isDark ? "text-white"       : "text-black";
  const textSub    = isDark ? "text-white/60"    : "text-black/80";
  const cardBg     = isDark ? "bg-white/5"       : "bg-white/10";
  const cardBorder = isDark ? "border-white/10"  : "border-white/20";
  const glow       = isDark ? "0 0 30px rgba(180,60,100,0.5)" : "none";

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
    <section id="book" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20 flex flex-col items-center">
      <div className="text-center mb-4">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-1 ${textMain}`} style={{ textShadow: glow }}>
          Book a Session
        </h2>
        <p className={`text-sm sm:text-base max-w-md mx-auto ${textSub}`}>
          Pick a time that works for you — it'll sync directly to Google Calendar.
        </p>
      </div>

      <div className={`w-full max-w-md rounded-2xl backdrop-blur-md border overflow-hidden shadow-lg ${cardBg} ${cardBorder}`}>
        <div ref={calendlyRef} className="w-full h-[400px] sm:h-[480px] md:h-[520px]" />
      </div>
    </section>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Dashboard() {
  const { isDark } = useTheme();

  const textMain   = isDark ? "text-white"        : "text-black";
  const textSub    = isDark ? "text-white/65"     : "text-black/70";
  const cardBg     = isDark ? "bg-white/5"        : "bg-white/60";
  const cardBorder = isDark ? "border-white/8"    : "border-black/10";
  const cardHover  = isDark ? "hover:bg-white/10" : "hover:bg-white/80";
  const tagBg      = isDark ? "bg-white/8 border-white/12 text-white/60" : "bg-black/5 border-black/10 text-black/60";
  const btnPrimary = isDark
    ? "bg-white/10 border border-white/20 text-white hover:bg-white/18"
    : "bg-black text-white hover:bg-black/80";
  const btnSec     = isDark
    ? "bg-white/5 border border-white/12 text-white/80 hover:bg-white/10"
    : "bg-white/40 border border-black/10 text-black hover:bg-white/70";
  const glow = isDark ? "0 0 40px rgba(180,60,100,0.5), 0 2px 8px rgba(0,0,0,0.9)" : "none";

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // ── Notion services fetch ──
  const [services,        setServices]        = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError,   setServicesError]   = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setServicesLoading(true);
        setServicesError(null);
        const res  = await fetch(NOTION_SERVICES_URL);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setServices((data.results || []).map(parseService));
      } catch (err) {
        console.error("Failed to fetch Notion services:", err);
        setServicesError(err.message);
      } finally {
        setServicesLoading(false);
      }
    }
    fetchServices();
  }, []);

  // ── Notion team fetch ──
  const [team,        setTeam]        = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError,   setTeamError]   = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        setTeamLoading(true);
        setTeamError(null);
        const res  = await fetch(NOTION_TEAM_URL);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const members = (data.results || []).map((page, i) => {
          const parsed = parseNotionTeamMember(page);
          return { ...parsed, img: parsed.image || getAvatar(parsed.name, i) };
        });
        setTeam(members);
      } catch (err) {
        console.error("Failed to fetch Notion team:", err);
        setTeamError(err.message);
      } finally {
        setTeamLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <PageBackground />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section id="home" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 flex flex-col items-center text-center scroll-mt-20">
          <span className={`inline-block bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold px-4 py-1 rounded-full mb-5 tracking-wide ${textMain}`}>
            Notion & Automation Specialist
          </span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight max-w-3xl ${textMain}`} style={{ textShadow: glow }}>
            Build Smarter Systems.<br className="hidden sm:block" />
            Work Less. Do More.
          </h1>
          <p className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8 ${textSub}`}>
            We design powerful Notion workspaces and automation workflows that help
            businesses run on autopilot — so you can focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo("book")}
              className={`font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 ${btnPrimary}`}>
              📅 Book a Free Call
            </button>
            <button onClick={() => scrollTo("services")}
              className={`font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${btnSec}`}>
              Explore Services ↓
            </button>
          </div>
          {/* scroll hint */}
          <div className={`mt-16 flex flex-col items-center gap-1.5 animate-bounce ${textSub} opacity-40`}>
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </section>

        <SectionDivider isDark={isDark} />

        {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
        <section id="services" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
          <div className="text-center mb-12">
            <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
              What We Offer
            </span>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
              Our Services
            </h2>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textSub}`}>
              From Notion workspaces to full automation pipelines — we build systems
              that save time, reduce errors, and scale with your business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeletons */}
            {servicesLoading && [...Array(6)].map((_, i) => (
              <ServiceSkeletonCard key={i} cardBg={cardBg} cardBorder={cardBorder} />
            ))}
            {/* Error */}
            {servicesError && (
              <div className="col-span-full text-center py-10">
                <p className="text-red-400 text-sm mb-1">⚠️ Failed to load services from Notion</p>
                <p className="text-white/30 text-xs">{servicesError}</p>
              </div>
            )}
            {/* Empty */}
            {!servicesLoading && !servicesError && services.length === 0 && (
              <p className={`col-span-full text-center text-sm ${textSub}`}>No services found in Notion database.</p>
            )}
            {/* Loaded */}
            {!servicesLoading && !servicesError && services.map((s, i) => (
              <div key={s.title + i}
                className={`backdrop-blur-md border rounded-2xl p-6 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-3 group ${cardBg} ${cardBorder}`}>
                {s.logo
                  ? <img src={s.logo} alt={s.title} className="w-12 h-12 object-contain rounded-lg" />
                  : <span className="text-4xl">{s.icon}</span>
                }
                <h3 className={`font-bold text-xl group-hover:opacity-80 transition-opacity ${textMain}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed ${textSub}`}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* mini CTA */}
          <div className="flex justify-center mt-10">
            <button onClick={() => scrollTo("book")}
              className={`font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 ${btnPrimary}`}>
              📅 Book a Consultation
            </button>
          </div>
        </section>

        <SectionDivider isDark={isDark} />

        {/* ══ CASE STUDIES ══════════════════════════════════════════════════════ */}
        <section id="case-studies" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
          <div className="text-center mb-12">
            <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
              Real Results
            </span>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
              Case Studies
            </h2>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textSub}`}>
              Real projects, real impact — automation systems and Notion solutions
              we've built for our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((study) => (
              <div key={study.title}
                className={`backdrop-blur-md border rounded-2xl p-6 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-4 group ${cardBg} ${cardBorder}`}>
                <span className="text-4xl">{study.icon}</span>
                <span className={`self-start text-xs font-semibold border rounded-full px-3 py-1 ${tagBg}`}>
                  {study.tag}
                </span>
                <h3 className={`font-bold text-xl ${textMain}`}>{study.title}</h3>
                <p className={`text-sm leading-relaxed ${textSub}`}>{study.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <button onClick={() => scrollTo("book")}
              className={`font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 ${btnPrimary}`}>
              📅 Book a Free Call
            </button>
          </div>
        </section>

        <SectionDivider isDark={isDark} />

        {/* ══ ABOUT ═════════════════════════════════════════════════════════════ */}
        <section id="about" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
          <div className="text-center mb-12">
            <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
              Who We Are
            </span>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-5 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
              We Build Systems That<br className="hidden sm:block" /> Work While You Sleep
            </h2>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textSub}`}>
              Notionnik is a team of automation specialists, Notion experts, and systems thinkers
              dedicated to helping businesses eliminate repetitive work and operate at a higher level.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {VALUES.map((v) => (
              <div key={v.title}
                className={`backdrop-blur-md border rounded-2xl p-5 flex flex-col gap-3 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg ${cardBg} ${cardBorder}`}>
                <span className="text-3xl">{v.icon}</span>
                <h3 className={`font-bold text-lg ${textMain}`}>{v.title}</h3>
                <p className={`text-sm leading-relaxed ${textSub}`}>{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <h3 className={`font-bold text-2xl mb-8 text-center ${textMain}`} style={{ textShadow: glow }}>
            👥 Meet the Team
          </h3>

          {/* Error */}
          {teamError && (
            <div className="text-center py-8 mb-14">
              <p className="text-red-400 text-sm mb-1">⚠️ Failed to load team from Notion</p>
              <p className="text-white/30 text-xs">{teamError}</p>
            </div>
          )}

          {/* Skeletons */}
          {teamLoading && !teamError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} isDark={isDark} />)}
            </div>
          )}

          {/* Empty */}
          {!teamLoading && !teamError && team.length === 0 && (
            <p className={`text-center text-sm mb-14 ${textSub}`}>No team members found in Notion database.</p>
          )}

          {/* Loaded */}
          {!teamLoading && !teamError && team.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              {team.map((m, i) => (
                <div key={m.name + i}
                  className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center text-center gap-4 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg ${cardBg} ${cardBorder}`}>
                  <div className={`w-20 h-20 rounded-full overflow-hidden border-4 shadow-md bg-white/10 ${isDark ? "border-white/15" : "border-black/10"}`}>
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${textMain}`}>{m.name}</h4>
                    <span className={`inline-block mt-1 mb-3 text-xs font-semibold border rounded-full px-3 py-1 ${tagBg}`}>
                      {m.role}
                    </span>
                    <p className={`text-sm leading-relaxed ${textSub}`}>{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mission & Approach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`backdrop-blur-md border rounded-2xl p-8 shadow-xl ${cardBg} ${cardBorder}`}>
              <h3 className={`text-2xl font-bold mb-3 ${textMain}`} style={{ textShadow: glow }}>🎯 Our Mission</h3>
              <p className={`leading-relaxed ${textSub}`}>
                To eliminate manual, repetitive work from every business we touch.
                Your time is too valuable to be spent on tasks a well-built system can handle.
                We engineer those systems so you can focus on growing — not grinding.
              </p>
            </div>
            <div className={`backdrop-blur-md border rounded-2xl p-8 shadow-xl ${cardBg} ${cardBorder}`}>
              <h3 className={`text-2xl font-bold mb-3 ${textMain}`} style={{ textShadow: glow }}>🚀 Our Approach</h3>
              <p className={`leading-relaxed ${textSub}`}>
                We start by understanding your workflow, then design a custom automation
                strategy using the best tools for your needs — Notion, n8n, Make,
                Google Apps, or AI. Every solution is built to scale as your business grows.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider isDark={isDark} />

        {/* ══ BOOK ══════════════════════════════════════════════════════════════ */}
        <BookSection isDark={isDark} />

        {/* ══ FINAL CTA ═════════════════════════════════════════════════════════ */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className={`backdrop-blur-sm border rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left ${cardBg} ${cardBorder}`}>
            <div>
              <h3 className={`font-bold text-2xl sm:text-3xl mb-2 ${textMain}`} style={{ textShadow: glow }}>
                Ready to systemize your business?
              </h3>
              <p className={`text-base ${textSub}`}>Let's build your dream Notion workspace together.</p>
            </div>
            <button onClick={() => scrollTo("book")}
              className={`font-bold px-9 py-3.5 rounded-xl transition-all duration-200 shadow-lg whitespace-nowrap hover:-translate-y-0.5 ${btnPrimary}`}>
              📅 Book Now
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
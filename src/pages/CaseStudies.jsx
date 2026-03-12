import { useTheme } from "./ThemeContext";
import { useState } from "react";

const PER_PAGE = 6;

// ✏️ Add / edit case studies here
const CASE_STUDIES = [
  { icon:"🛍️", title:"Shopify Product Uploader",  desc:"Automated bulk product uploads to your Shopify store — no manual entry, no errors.",                   tag:"E-Commerce Automation" },
  { icon:"🗒️", title:"Meeting Summary to Notion", desc:"Auto-generate meeting summaries and push them directly into your Notion database.",                      tag:"Notion Integration" },
  { icon:"🎬", title:"Video Generation",           desc:"AI-powered automated video creation pipelines for content, marketing, and social media.",                tag:"AI Automation" },
  { icon:"📄", title:"Google Sheet to Document",  desc:"Automatically populate document templates from Google Sheets data — reports, proposals, and more.",       tag:"Google Workspace" },
  { icon:"🧾", title:"Invoice Generation",        desc:"Auto-generate and send professional invoices triggered by bookings, forms, or spreadsheet entries.",      tag:"Business Automation" },
];

function Pagination({ page, totalPages, setPage, isDark }) {
  if (totalPages <= 1) return null;
  const arrowBase = "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer";
  const arrowOn   = isDark ? "bg-white/10 border-white/20 text-white hover:bg-white/20" : "bg-white/60 border-blue-200 text-blue-900 hover:bg-white";
  const arrowOff  = isDark ? "bg-white/3 border-white/8 text-white/20 cursor-not-allowed" : "bg-black/3 border-black/8 text-black/20 cursor-not-allowed";
  const textMuted = isDark ? "text-white/35" : "text-blue-900/50";

  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      <div className="flex items-center gap-4">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          className={`${arrowBase} ${page === 0 ? arrowOff : arrowOn}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === page
                  ? isDark ? "w-6 h-2.5 bg-white/70" : "w-6 h-2.5 bg-blue-500"
                  : isDark ? "w-2.5 h-2.5 bg-white/20 hover:bg-white/40" : "w-2.5 h-2.5 bg-blue-200 hover:bg-blue-400"
              }`} />
          ))}
        </div>

        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
          className={`${arrowBase} ${page === totalPages - 1 ? arrowOff : arrowOn}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className={`text-xs ${textMuted}`}>{page + 1} / {totalPages}</p>
    </div>
  );
}

export default function CaseStudies() {
  const { isDark } = useTheme();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(CASE_STUDIES.length / PER_PAGE);
  const current    = CASE_STUDIES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const textMain   = isDark ? "text-white"        : "text-blue-950";
  const textSub    = isDark ? "text-white/60"     : "text-blue-900/80";
  const cardBg     = isDark ? "bg-white/5"        : "bg-white/60";
  const cardBorder = isDark ? "border-white/8"    : "border-blue-200";
  const cardHover  = isDark ? "hover:bg-white/10" : "hover:bg-white";
  const tagBg      = isDark ? "bg-white/8 border-white/12 text-white/60" : "bg-blue-100 border-blue-200 text-blue-700";
  const btnStyle   = isDark
    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/18"
    : "bg-blue-600 text-white hover:bg-blue-700";
  const glow = isDark ? "0 0 40px rgba(180,60,100,0.5)" : "none";

  const scrollToBook = () => {
    const el  = document.getElementById("book");
    const nav = document.querySelector("nav");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 76) - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="py-16 px-6">
      {/* Header */}
      <div className="text-center mb-14">
        <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
          Real Results
        </span>
        <h2 className={`text-5xl font-bold mb-4 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
          Case Studies
        </h2>
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textSub}`}>
          Real projects, real impact — automation systems and Notion solutions we've built for our clients.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {current.map((study, i) => (
          <div key={study.title + i}
            className={`backdrop-blur-md border rounded-2xl p-6 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-4 group ${cardBg} ${cardBorder}`}>
            <span className="text-4xl">{study.icon}</span>
            <span className={`self-start text-xs font-semibold border rounded-full px-3 py-1 ${tagBg}`}>
              {study.tag}
            </span>
            <h3 className={`font-bold text-xl group-hover:opacity-80 transition-opacity ${textMain}`}>{study.title}</h3>
            <p className={`text-sm leading-relaxed ${textSub}`}>{study.desc}</p>
          </div>
        ))}
      </div>

      {/* Pagination — only shows if more than 6 case studies */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} isDark={isDark} />

      {/* CTA */}
      <div className={`max-w-6xl mx-auto mt-14 backdrop-blur-md border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${cardBg} ${cardBorder}`}>
        <div>
          <h3 className={`font-bold text-2xl mb-1 ${textMain}`} style={{ textShadow: glow }}>Want results like these?</h3>
          <p className={textSub}>Let's build your next automation system together.</p>
        </div>
        <button onClick={scrollToBook}
          className={`font-bold px-8 py-3 rounded-xl hover:-translate-y-1 transition-all duration-200 shadow-lg whitespace-nowrap ${btnStyle}`}>
          📅 Book a Free Call
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useTheme } from "./ThemeContext";

// ✏️ 18 testimonials — edit freely
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
  ["#6366f1", "#818cf8"],
  ["#ec4899", "#f472b6"],
  ["#14b8a6", "#2dd4bf"],
  ["#f59e0b", "#fbbf24"],
  ["#8b5cf6", "#a78bfa"],
  ["#10b981", "#34d399"],
];

function StarRating({ rating, isDark }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className="w-4 h-4"
          fill={star <= rating ? "#fbbf24" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}
          viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function AvatarInitials({ initials, index }) {
  const [from, to] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
      {initials}
    </div>
  );
}

export default function Testimonials() {
  const { isDark } = useTheme();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
  const current    = TESTIMONIALS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const textMain   = isDark ? "text-white"        : "text-blue-950";
  const textSub    = isDark ? "text-white/60"     : "text-blue-900/80";
  const textMuted  = isDark ? "text-white/35"     : "text-blue-900/50";
  const cardBg     = isDark ? "bg-white/5"        : "bg-white/60";
  const cardBorder = isDark ? "border-white/8"    : "border-blue-200";
  const cardHover  = isDark ? "hover:bg-white/10" : "hover:bg-white";
  const quoteMark  = isDark ? "text-white/10"     : "text-blue-200";
  const glow       = isDark ? "0 0 40px rgba(180,60,100,0.5)" : "none";

  const arrowBase = "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer";
  const arrowOn   = isDark
    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
    : "bg-white/60 border-blue-200 text-blue-900 hover:bg-white";
  const arrowOff  = isDark
    ? "bg-white/3 border-white/8 text-white/20 cursor-not-allowed"
    : "bg-black/3 border-black/8 text-black/20 cursor-not-allowed";

  return (
    <div className="py-16 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
          What Clients Say
        </span>
        <h2 className={`text-4xl sm:text-5xl font-bold mb-4 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
          Testimonials
        </h2>
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textSub}`}>
          Real feedback from businesses we've helped systemize and scale.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {current.map((t, i) => (
          <div key={t.name}
            className={`relative backdrop-blur-md border rounded-2xl p-6 flex flex-col gap-4 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg ${cardBg} ${cardBorder}`}>
            {/* Quote mark */}
            <span className={`absolute top-4 right-5 text-6xl font-serif leading-none select-none ${quoteMark}`}>"</span>

            <StarRating rating={t.rating} isDark={isDark} />

            <p className={`text-sm leading-relaxed flex-1 ${textSub}`}>"{t.feedback}"</p>

            <div className={`h-px w-full ${isDark ? "bg-white/8" : "bg-blue-100"}`} />

            <div className="flex items-center gap-3">
              <AvatarInitials initials={t.avatar} index={page * PER_PAGE + i} />
              <div>
                <p className={`font-bold text-sm ${textMain}`}>{t.name}</p>
                <p className={`text-xs ${textMuted}`}>{t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-10">
        {/* Prev */}
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`${arrowBase} ${page === 0 ? arrowOff : arrowOn}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === page
                  ? isDark ? "w-6 h-2.5 bg-white/70" : "w-6 h-2.5 bg-blue-500"
                  : isDark ? "w-2.5 h-2.5 bg-white/20 hover:bg-white/40" : "w-2.5 h-2.5 bg-blue-200 hover:bg-blue-400"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className={`${arrowBase} ${page === totalPages - 1 ? arrowOff : arrowOn}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Page counter */}
      <p className={`text-center text-xs mt-3 ${textMuted}`}>
        {page + 1} / {totalPages}
      </p>
    </div>
  );
}
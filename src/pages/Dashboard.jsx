import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";

// ── Section imports ──
import AboutUs     from "./AboutUs";
import Services    from "./Services";
import CaseStudies from "./CaseStudies";
import Testimonials from "./Testimonials";
import Book        from "./Book";

export default function Dashboard() {
  const { isDark } = useTheme();

  const textMain   = isDark ? "text-white"        : "text-black";
  const textSub    = isDark ? "text-white/65"     : "text-black/70";
  const cardBg     = isDark ? "bg-white/5"        : "bg-white/60";
  const cardBorder = isDark ? "border-white/8"    : "border-black/10";
  const btnPrimary = isDark
    ? "bg-white/10 border border-white/20 text-white hover:bg-white/18"
    : "bg-black text-white hover:bg-black/80";
  const btnSec = isDark
    ? "bg-white/5 border border-white/12 text-white/80 hover:bg-white/10"
    : "bg-white/40 border border-black/10 text-black hover:bg-white/70";
  const glow = isDark
    ? "0 0 40px rgba(180,60,100,0.5), 0 2px 8px rgba(0,0,0,0.9)"
    : "none";

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    const nav = document.querySelector("nav");
    const navHeight = nav?.offsetHeight || 76;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <PageBackground />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section id="home" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 flex flex-col items-center text-center">
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
          <div className={`mt-16 flex flex-col items-center gap-1.5 animate-bounce ${textSub} opacity-40`}>
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
        <section id="services" className="w-full">
          <Services />
        </section>

        {/* ══ CASE STUDIES ══════════════════════════════════════════════════════ */}
        <section id="case-studies" className="w-full">
          <CaseStudies />
        </section>

        {/* ══ ABOUT ═════════════════════════════════════════════════════════════ */}
        <section id="about" className="w-full">
          <AboutUs />
        </section>

        <section id="testimonials" className="w-full">
          <Testimonials />
        </section>

        {/* ══ BOOK ══════════════════════════════════════════════════════════════ */}
        <section id="book" className="w-full">
          <Book />
        </section>

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
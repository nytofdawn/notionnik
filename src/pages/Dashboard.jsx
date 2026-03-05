import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";

export default function Dashboard() {
  const { isDark } = useTheme();

  const services = [
    { title: "Notion Setup",     desc: "Custom workspace design tailored to your workflow.",    icon: "📝" },
    { title: "Automation",       desc: "Zapier, Make, and n8n automations to save you hours.",  icon: "⚡" },
    { title: "CRM Build",        desc: "Full CRM systems inside Notion for managing clients.",  icon: "🗂️" },
    { title: "Dashboard Design", desc: "Beautiful Notion dashboards for data and analytics.",   icon: "📊" },
    { title: "SOP Creation",     desc: "Standard operating procedures documented in Notion.",   icon: "📋" },
    { title: "Team Wikis",       desc: "Centralized knowledge bases for your entire team.",     icon: "🌐" },
  ];

  const textMain  = isDark ? "text-white"     : "text-black";
  const textSub   = isDark ? "text-white/65"  : "text-black/80";
  const cardBg    = isDark ? "bg-white/5"     : "bg-white/10";
  const cardBorder= isDark ? "border-white/8" : "border-white/20";
  const cardHover = isDark ? "hover:bg-white/10" : "hover:bg-white/20";
  const btnPrimary= isDark
    ? "bg-white/10 border border-white/20 text-white hover:bg-white/18"
    : "bg-white text-black hover:bg-gray-100";
  const btnSec    = isDark
    ? "bg-white/5 border border-white/12 text-white/80 hover:bg-white/10"
    : "bg-white/10 border border-white/20 text-black hover:bg-white/20";
  const glow      = isDark ? "0 0 40px rgba(180,60,100,0.5), 0 2px 8px rgba(0,0,0,0.9)" : "none";

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">
      <PageBackground />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Hero */}
        <div className="text-center mb-10 max-w-3xl">
          <span className={`inline-block bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textMain}`}>
            Notion & Automation Specialist
          </span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight ${textMain}`}
            style={{ textShadow: glow }}>
            Build Smarter Systems.<br className="hidden sm:block" />
            Work Less. Do More.
          </h1>
          <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${textSub}`}>
            We design powerful Notion workspaces and automation workflows that help
            businesses run on autopilot — so you can focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/book" className={`font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg ${btnPrimary}`}>
              📅 Book a Free Call
            </Link>
            <Link to="/services" className={`font-semibold px-6 py-3 rounded-xl transition-all duration-200 ${btnSec}`}>
              View Services
            </Link>
          </div>
        </div>

        {/* Services */}
        <div className="w-full max-w-6xl mb-12">
          <h2 className={`font-bold text-xl sm:text-2xl mb-6 ${textMain}`} style={{ textShadow: glow }}>
            🚀 What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div key={service.title}
                className={`backdrop-blur-sm border rounded-2xl p-5 sm:p-6 ${cardHover} transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col gap-3 ${cardBg} ${cardBorder}`}>
                <span className="text-3xl">{service.icon}</span>
                <h3 className={`font-bold text-base sm:text-lg ${textMain}`}>{service.title}</h3>
                <p className={`text-sm ${textSub}`}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`w-full max-w-6xl backdrop-blur-sm border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left ${cardBg} ${cardBorder}`}>
          <div>
            <h3 className={`font-bold text-xl sm:text-2xl mb-1 ${textMain}`} style={{ textShadow: glow }}>
              Ready to systemize your business?
            </h3>
            <p className={`text-sm sm:text-base ${textSub}`}>
              Let's build your dream Notion workspace together.
            </p>
          </div>
          <Link to="/book" className={`font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg whitespace-nowrap ${btnPrimary}`}>
            📅 Book Now
          </Link>
        </div>

      </div>
    </div>
  );
}
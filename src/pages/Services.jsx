import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";

export default function Services() {
  const { isDark } = useTheme();

  const textMain   = isDark ? "text-white"    : "text-blue-950";
  const textSub    = isDark ? "text-white/60" : "text-blue-900/80";
  const cardBg     = isDark ? "bg-white/5"    : "bg-white/60";
  const cardBorder = isDark ? "border-white/8": "border-blue-200";
  const cardHover  = isDark ? "hover:bg-white/10" : "hover:bg-white";
  const btnStyle   = isDark
    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/18"
    : "bg-blue-600 text-white hover:bg-blue-700";
  const glow       = isDark ? "0 0 40px rgba(180,60,100,0.5)" : "none";

  const services = [
    { icon:"🧠", title:"Consulting",         desc:"Strategic advice on systems, workflows, and tools to help your business scale efficiently." },
    { icon:"💻", title:"Web Development",    desc:"Clean, modern websites and web apps built to perform and convert." },
    { icon:"🔁", title:"N8N Automation",     desc:"Self-hosted automation pipelines using n8n to connect your apps and eliminate manual work." },
    { icon:"⚡", title:"Make Automation",    desc:"Visual automation workflows with Make (formerly Integromat) for seamless app integrations." },
    { icon:"📜", title:"Google App Scripts", desc:"Custom scripts to automate Google Sheets, Docs, Gmail, and more within your Google Workspace." },
    { icon:"📝", title:"Notion Automation",  desc:"Automate your Notion databases, pages, and workflows to keep everything organized and updated." },
  ];

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
          {services.map((s) => (
            <div key={s.title}
              className={`backdrop-blur-md border rounded-2xl p-6 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-3 group ${cardBg} ${cardBorder}`}>
              <span className="text-4xl">{s.icon}</span>
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
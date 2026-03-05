import { useTheme } from "./ThemeContext";
import PageBackground from "./PageBackground";

export default function CaseStudies() {
  const { isDark } = useTheme();

  const textMain   = isDark ? "text-white"    : "text-blue-950";
  const textSub    = isDark ? "text-white/60" : "text-blue-900/80";
  const cardBg     = isDark ? "bg-white/5"    : "bg-white/60";
  const cardBorder = isDark ? "border-white/8": "border-blue-200";
  const cardHover  = isDark ? "hover:bg-white/10" : "hover:bg-white";
  const tagBg      = isDark ? "bg-white/8 border-white/12 text-white/60" : "bg-blue-100 border-blue-200 text-blue-700";
  const btnStyle   = isDark
    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/18"
    : "bg-blue-600 text-white hover:bg-blue-700";
  const glow       = isDark ? "0 0 40px rgba(180,60,100,0.5)" : "none";

  const caseStudies = [
    { icon:"🛍️", title:"Shopify Product Uploader",   desc:"Automated bulk product uploads to your Shopify store — no manual entry, no errors.",                          tag:"E-Commerce Automation" },
    { icon:"🗒️", title:"Meeting Summary to Notion",  desc:"Auto-generate meeting summaries and push them directly into your Notion database.",                           tag:"Notion Integration" },
    { icon:"🎬", title:"Video Generation",            desc:"AI-powered automated video creation pipelines for content, marketing, and social media.",                     tag:"AI Automation" },
    { icon:"📄", title:"Google Sheet to Document",   desc:"Automatically populate document templates from Google Sheets data — reports, proposals, and more.",            tag:"Google Workspace" },
    { icon:"🧾", title:"Invoice Generation",         desc:"Auto-generate and send professional invoices triggered by bookings, forms, or spreadsheet entries.",           tag:"Business Automation" },
  ];

  return (
    <div className="relative min-h-screen py-16 px-6">
      <PageBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className={`inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide ${textSub}`}>
            Real Results
          </span>
          <h1 className={`text-5xl font-bold mb-4 tracking-tight ${textMain}`} style={{ textShadow: glow }}>
            Case Studies
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textSub}`}>
            Here's a look at some of the automation systems and Notion solutions
            we've built for our clients — real projects, real impact.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study) => (
            <div key={study.title}
              className={`backdrop-blur-md border rounded-2xl p-6 ${cardHover} hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-4 group ${cardBg} ${cardBorder}`}>
              <span className="text-4xl">{study.icon}</span>
              <span className={`self-start text-xs font-semibold border rounded-full px-3 py-1 ${tagBg}`}>
                {study.tag}
              </span>
              <h2 className={`font-bold text-xl group-hover:opacity-80 transition-opacity ${textMain}`}>
                {study.title}
              </h2>
              <p className={`text-sm leading-relaxed ${textSub}`}>{study.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`max-w-6xl mx-auto mt-14 backdrop-blur-md border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${cardBg} ${cardBorder}`}>
          <div>
            <h3 className={`font-bold text-2xl mb-1 ${textMain}`} style={{ textShadow: glow }}>
              Want results like these?
            </h3>
            <p className={textSub}>Let's build your next automation system together.</p>
          </div>
          <a href="/book"
            className={`font-bold px-8 py-3 rounded-xl hover:-translate-y-1 transition-all duration-200 shadow-lg whitespace-nowrap ${btnStyle}`}>
            📅 Book a Free Call
          </a>
        </div>
      </div>
    </div>
  );
}
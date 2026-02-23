export default function CaseStudies() {
    const caseStudies = [
        {
            icon: "🛍️",
            title: "Shopify Product Uploader",
            desc: "Automated bulk product uploads to your Shopify store — no manual entry, no errors.",
            tag: "E-Commerce Automation",
        },
        {
            icon: "🗒️",
            title: "Meeting Summary to Notion",
            desc: "Auto-generate meeting summaries and push them directly into your Notion database.",
            tag: "Notion Integration",
        },
        {
            icon: "🎬",
            title: "Video Generation",
            desc: "AI-powered automated video creation pipelines for content, marketing, and social media.",
            tag: "AI Automation",
        },
        {
            icon: "📄",
            title: "Google Sheet to Document",
            desc: "Automatically populate document templates from Google Sheets data — reports, proposals, and more.",
            tag: "Google Workspace",
        },
        {
            icon: "🧾",
            title: "Invoice Generation",
            desc: "Auto-generate and send professional invoices triggered by bookings, forms, or spreadsheet entries.",
            tag: "Business Automation",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-950 py-16 px-6">

            {/* Header */}
            <div className="text-center mb-14">
                <span className="inline-block bg-white/10 border border-white/20 text-green-200 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
                    Real Results
                </span>
                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Case Studies</h1>
                <p className="text-green-200 text-lg max-w-2xl mx-auto leading-relaxed">
                    Here's a look at some of the automation systems and Notion solutions
                    we've built for our clients — real projects, real impact.
                </p>
            </div>

            {/* Case Study Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map((study) => (
                    <div
                        key={study.title}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-4 group"
                    >
                        {/* Icon */}
                        <span className="text-4xl">{study.icon}</span>

                        {/* Tag */}
                        <span className="self-start text-xs font-semibold text-green-300 bg-green-900/50 border border-green-500/30 rounded-full px-3 py-1">
                            {study.tag}
                        </span>

                        {/* Content */}
                        <h2 className="text-white font-bold text-xl group-hover:text-green-200 transition-colors">
                            {study.title}
                        </h2>
                        <p className="text-green-200/80 text-sm leading-relaxed">{study.desc}</p>
                    </div>
                ))}
            </div>

            {/* CTA Banner */}
            <div className="max-w-6xl mx-auto mt-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-white font-bold text-2xl mb-1">Want results like these?</h3>
                    <p className="text-green-200">Let's build your next automation system together.</p>
                </div>
                <a
                    href="/book"
                    className="bg-white text-green-800 font-bold px-8 py-3 rounded-xl hover:bg-green-100 transition-all duration-200 hover:-translate-y-1 shadow-lg whitespace-nowrap"
                >
                    📅 Book a Free Call
                </a>
            </div>

        </div>
    );
}
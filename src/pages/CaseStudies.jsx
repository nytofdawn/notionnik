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
        <div className="min-h-screen bg-gradient-to-br from-[#B0E0E6] via-[#A7D8EB] to-[#9AD0EC] py-16 px-6">

            {/* Header */}
            <div className="text-center mb-14">
                <span className="inline-block bg-white/50 border border-blue-200 text-blue-900 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
                    Real Results
                </span>
                <h1 className="text-5xl font-bold text-blue-950 mb-4 tracking-tight">
                    Case Studies
                </h1>
                <p className="text-blue-900/80 text-lg max-w-2xl mx-auto leading-relaxed">
                    Here's a look at some of the automation systems and Notion solutions
                    we've built for our clients — real projects, real impact.
                </p>
            </div>

            {/* Case Study Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map((study) => (
                    <div
                        key={study.title}
                        className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-6
                                   hover:bg-white hover:-translate-y-1 transition-all duration-300
                                   shadow-lg flex flex-col gap-4 group"
                    >
                        {/* Icon */}
                        <span className="text-4xl">{study.icon}</span>

                        {/* Tag */}
                        <span className="self-start text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-3 py-1">
                            {study.tag}
                        </span>

                        {/* Content */}
                        <h2 className="text-blue-950 font-bold text-xl group-hover:text-blue-700 transition-colors">
                            {study.title}
                        </h2>
                        <p className="text-blue-900/80 text-sm leading-relaxed">
                            {study.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* CTA Banner */}
            <div className="max-w-6xl mx-auto mt-14 bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-8
                            flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-blue-950 font-bold text-2xl mb-1">
                        Want results like these?
                    </h3>
                    <p className="text-blue-900/80">
                        Let's build your next automation system together.
                    </p>
                </div>
                <a
                    href="/book"
                    className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl
                               hover:bg-blue-700 transition-all duration-200
                               hover:-translate-y-1 shadow-lg whitespace-nowrap"
                >
                    📅 Book a Free Call
                </a>
            </div>

        </div>
    );
}
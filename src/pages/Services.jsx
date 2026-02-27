export default function Services() {
    const services = [
        {
            icon: "🧠",
            title: "Consulting",
            desc: "Strategic advice on systems, workflows, and tools to help your business scale efficiently.",
        },
        {
            icon: "💻",
            title: "Web Development",
            desc: "Clean, modern websites and web apps built to perform and convert.",
        },
        {
            icon: "🔁",
            title: "N8N Automation",
            desc: "Self-hosted automation pipelines using n8n to connect your apps and eliminate manual work.",
        },
        {
            icon: "⚡",
            title: "Make Automation",
            desc: "Visual automation workflows with Make (formerly Integromat) for seamless app integrations.",
        },
        {
            icon: "📜",
            title: "Google App Scripts",
            desc: "Custom scripts to automate Google Sheets, Docs, Gmail, and more within your Google Workspace.",
        },
        {
            icon: "📝",
            title: "Notion Automation",
            desc: "Automate your Notion databases, pages, and workflows to keep everything organized and updated.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#B0E0E6] via-[#A7D8EB] to-[#9AD0EC] py-16 px-6">

            {/* Header */}
            <div className="text-center mb-14">
                <span className="inline-block bg-white/50 border border-blue-200 text-blue-900 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
                    What We Offer
                </span>
                <h1 className="text-5xl font-bold text-blue-950 mb-4 tracking-tight">
                    Our Services
                </h1>
                <p className="text-blue-900/80 text-lg max-w-2xl mx-auto leading-relaxed">
                    From Notion workspaces to full automation pipelines — we build systems
                    that save time, reduce errors, and scale with your business.
                </p>
            </div>

            {/* Services Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.title}
                        className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-6
                                   hover:bg-white hover:-translate-y-1 transition-all duration-300
                                   shadow-lg flex flex-col gap-3 group"
                    >
                        <span className="text-4xl">{service.icon}</span>
                        <h2 className="text-blue-950 font-bold text-xl group-hover:text-blue-700 transition-colors">
                            {service.title}
                        </h2>
                        <p className="text-blue-900/80 text-sm leading-relaxed">
                            {service.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* CTA Banner */}
            <div className="max-w-6xl mx-auto mt-14 bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-8
                            flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-blue-950 font-bold text-2xl mb-1">
                        Need a custom automation?
                    </h3>
                    <p className="text-blue-900/80">
                        Tell us what you need — we'll build it for you.
                    </p>
                </div>
                <a
                    href="/book"
                    className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl
                               hover:bg-blue-700 transition-all duration-200
                               hover:-translate-y-1 shadow-lg whitespace-nowrap"
                >
                    📅 Book a Consultation
                </a>
            </div>

        </div>
    );
}
import { Link } from "react-router-dom";

export default function Dashboard() {
    const services = [
        { title: "Notion Setup", desc: "Custom workspace design tailored to your workflow.", icon: "📝" },
        { title: "Automation", desc: "Zapier, Make, and n8n automations to save you hours.", icon: "⚡" },
        { title: "CRM Build", desc: "Full CRM systems inside Notion for managing clients.", icon: "🗂️" },
        { title: "Dashboard Design", desc: "Beautiful Notion dashboards for data and analytics.", icon: "📊" },
        { title: "SOP Creation", desc: "Standard operating procedures documented in Notion.", icon: "📋" },
        { title: "Team Wikis", desc: "Centralized knowledge bases for your entire team.", icon: "🌐" },
    ];

    return (
       <div className="min-h-screen bg-gradient-to-br from-[#00F0FF] to-[#B0E0E6] flex flex-col items-center py-10 px-6">

            {/* Hero Header */}
            <div className="text-center mb-12 max-w-3xl">
                <span className="inline-block bg-white/10 border border-white/20 text-black text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
                    Notion & Automation Specialist
                </span>
                <h1 className="text-5xl font-bold text-black mb-4 tracking-tight leading-tight">
                    Build Smarter Systems.<br />Work Less. Do More.
                </h1>
                <p className="text-black text-lg leading-relaxed">
                    We design powerful Notion workspaces and automation workflows that help
                    businesses run on autopilot — so you can focus on what matters most.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                    <Link
                        to="/book"
                        className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:-translate-y-1 shadow-lg"
                    >
                        📅 Book a Free Call
                    </Link>
                    <Link
                        to="/services"
                        className="bg-white/10 border border-white/20 text-black font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 hover:-translate-y-1"
                    >
                        View Services
                    </Link>
                </div>
            </div>

            {/* Services Grid */}
            <div className="w-full max-w-6xl mb-10">
                <h2 className="text-black font-bold text-2xl mb-6">🚀 What We Do</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col gap-3"
                        >
                            <span className="text-3xl">{service.icon}</span>
                            <h3 className="text-black font-bold text-lg">{service.title}</h3>
                            <p className="text-black/80 text-sm">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className="w-full max-w-6xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-black font-bold text-2xl mb-1">Ready to systemize your business?</h3>
                    <p className="text-black/80">Let's build your dream Notion workspace together.</p>
                </div>
                <Link
                    to="/book"
                    className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:-translate-y-1 shadow-lg whitespace-nowrap"
                >
                    📅 Book Now
                </Link>
            </div>

        </div>
    );
}
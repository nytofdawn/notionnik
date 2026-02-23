export default function AboutUs() {
    const team = [
        {
            name: "Alex Rivera",
            role: "Automation Architect",
            desc: "Specializes in building end-to-end automation pipelines using n8n, Make, and Zapier for businesses of all sizes.",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4"
        },
        {
            name: "Jordan Lee",
            role: "Notion Specialist",
            desc: "Expert in designing Notion workspaces, CRM systems, and SOPs that streamline how teams operate daily.",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=c0aede"
        },
        {
            name: "Morgan Chen",
            role: "Systems Integrator",
            desc: "Connects APIs, databases, and third-party tools to create seamless data flows across your entire tech stack.",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan&backgroundColor=d1f4d1"
        },
        {
            name: "Taylor Smith",
            role: "AI & Workflow Engineer",
            desc: "Builds AI-powered workflows for document generation, meeting summaries, video creation, and smart reporting.",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor&backgroundColor=ffd5dc"
        },
    ];

    const values = [
        { icon: "⚡", title: "Speed", desc: "We build fast and deploy faster — your systems go live without the long wait." },
        { icon: "🎯", title: "Precision", desc: "Every automation is tested, documented, and built to work exactly as intended." },
        { icon: "🔒", title: "Reliability", desc: "We design for uptime. Your workflows run 24/7 without breaking." },
        { icon: "🤝", title: "Partnership", desc: "We don't just deliver and disappear — we stay with you as your systems grow." },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-950 py-16 px-6">

            {/* Header */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <span className="inline-block bg-white/10 border border-white/20 text-green-200 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
                    Who We Are
                </span>
                <h1 className="text-5xl font-bold text-white mb-5 tracking-tight">
                    We Build Systems That Work While You Sleep
                </h1>
                <p className="text-green-200 text-lg leading-relaxed">
                    Notionnik is a team of automation specialists, Notion experts, and systems
                    thinkers dedicated to helping businesses eliminate repetitive work and operate
                    at a higher level — through smart workflows, clean integrations, and powerful tools.
                </p>
            </div>

            {/* Values */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                {values.map((v) => (
                    <div
                        key={v.title}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                    >
                        <span className="text-3xl">{v.icon}</span>
                        <h3 className="text-white font-bold text-lg">{v.title}</h3>
                        <p className="text-green-200/80 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                ))}
            </div>

            {/* Team */}
            <div className="max-w-6xl mx-auto mb-16">
                <h2 className="text-white font-bold text-2xl mb-8 text-center">👥 Meet the Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member) => (
                        <div
                            key={member.name}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                        >
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-md bg-white">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-xl">{member.name}</h2>
                                <span className="inline-block mt-1 mb-3 text-xs font-semibold text-green-300 bg-green-900/50 border border-green-500/30 rounded-full px-3 py-1">
                                    {member.role}
                                </span>
                                <p className="text-green-200/80 text-sm leading-relaxed">{member.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-3">🎯 Our Mission</h2>
                    <p className="text-green-200 leading-relaxed">
                        To eliminate manual, repetitive work from every business we touch. We believe
                        your time is too valuable to be spent on tasks a well-built system can handle.
                        We engineer those systems so you can focus on growing — not grinding.
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-3">🚀 Our Approach</h2>
                    <p className="text-green-200 leading-relaxed">
                        We start by understanding your current workflow, then design a custom automation
                        strategy using the best tools for your needs — whether that's Notion, n8n, Make,
                        Google Apps, or AI. Every solution is built to scale as your business grows.
                    </p>
                </div>
            </div>

        </div>
    );
}
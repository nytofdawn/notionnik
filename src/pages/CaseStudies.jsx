export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Case Studies</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Project Alpha", desc: "Delivered a complete web solution for a fintech startup." },
          { title: "Project Beta", desc: "Redesigned the UI/UX for an e-commerce platform." },
          { title: "Project Gamma", desc: "Implemented marketing strategy for a global brand." },
        ].map((caseStudy) => (
          <div key={caseStudy.title} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="font-semibold text-xl mb-2">{caseStudy.title}</h2>
            <p className="text-gray-500">{caseStudy.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
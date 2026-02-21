export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Services</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          "Consulting",
          "Web Development",
          "N8N Automation",
          "Make Automation",
          "Google App Scripts",
          "Notion Automation",
        ].map((service) => (
          <div key={service} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="font-semibold text-xl mb-2">{service}</h2>
            <p className="text-gray-500">High-quality {service.toLowerCase()} tailored to your needs.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
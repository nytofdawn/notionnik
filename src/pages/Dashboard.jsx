export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-gray-600 text-lg text-center max-w-xl">
                Welcome to Notionnik! Navigate through the Links to explore.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                    { title: "About Us", desc: "Learn more about our team and mission", link:"/about" },
                    { title: "Services", desc: "Learn more about our team and mission", link:"/services" },
                    { title: "Case Studies", desc: "Learn more about our team and mission", link:"/case-studies" },
                    { title: "Book", desc: "Learn more about our team and mission", link:"/book" }
                ].map((card) => (
                    <a
                    key={card.title}
                    href={card.link}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex felx-col"
                    >
                        <h2 className="font-semihold text-xl mb-2">{card.title}</h2>
                        <p className="text-gray-500">{card.desc}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}
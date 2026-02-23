import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-r from-blue-800 to-blue-950 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo + Brand Name */}
                <NavLink to="/" className="flex items-center gap-3">
                    <img
                        src="/notionnik.svg"
                        alt="Notionnik Logo"
                        className="h-8 w-auto object-contain"
                    />
                    <span className="text-white font-bold text-xl tracking-wide">Notionnik</span>
                </NavLink>

                {/* Right Side — Nav Links + Book Now */}
                <div className="flex items-center gap-4">

                    {/* Nav Links */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex space-x-2">
                        {[
                            { label: "About Us", to: "/about" },
                            { label: "Services", to: "/services" },
                            { label: "Case Studies", to: "/case-studies" },
                        ].map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) =>
                                    `font-medium text-sm px-3 py-1 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-green-800 shadow-md scale-105"
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Book Now CTA */}
                    <NavLink
                        to="/book"
                        className={({ isActive }) =>
                            `font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? "bg-green-200 text-green-900 shadow-md scale-105"
                                    : "bg-white text-green-800 hover:bg-green-100"
                            }`
                        }
                    >
                        Book Now
                    </NavLink>

                </div>
            </div>
        </nav>
    );
}
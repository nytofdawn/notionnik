import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "About Us", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "Case Studies", to: "/case-studies" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/notionnik.svg"
            alt="Notionnik Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-white font-bold text-xl tracking-wide">
            Notionnik
          </span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex space-x-2">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `font-medium text-sm px-3 py-1 rounded-lg transition-all ${
                    isActive
                      ? "bg-white text-green-800 shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <NavLink
            to="/book"
            className={({ isActive }) =>
              `font-semibold px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-green-200 text-green-900"
                  : "bg-white text-green-800 hover:bg-green-100"
              }`
            }
          >
            Book Now
          </NavLink>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col gap-2">

            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-white text-green-800"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-2 bg-white text-green-800 font-semibold text-center px-4 py-2 rounded-lg hover:bg-green-100 transition"
            >
              Book Now
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
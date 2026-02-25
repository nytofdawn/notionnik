import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#00F0FF] to-[#B0E0E6] border-t border-blue-200 text-black-900 py-5 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">


                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2">
                        <img
                            src="/notionnik.svg"
                            alt="Notionnik Logo"
                            className="h-8 w-auto object-contain"
                        />
                        <span className="font-bold text-xl tracking-wide">
                            Notionnik
                        </span>
                    </div>
                    <p className="text-green-800 text-sm mt-2">
                        © 2026 Notionnik. All rights reserved.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    {[
                        { label: "Dashboard", to: "/" },
                        { label: "About Us", to: "/about" },
                        { label: "Services", to: "/services" },
                        { label: "Case Studies", to: "/case-studies" },
                        { label: "Book Now", to: "/book" },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className="text-blue-800/80 hover:text-blue-950 transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-3">
                    <p className="text-blue-800 text-sm font-semibold tracking-wide uppercase">
                        Follow Us
                    </p>

                    <div className="flex gap-4">

                        <a
                            href="https://www.facebook.com/notionnik/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/40 hover:bg-blue-500 border border-blue-300 rounded-xl p-3 transition-all duration-200 hover:-translate-y-1"
                            aria-label="Facebook"
                        >
                            <svg className="w-5 h-5 fill-blue-900 hover:fill-white transition-colors duration-200"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H8.08V12h2.36v-2.05c0-2.33 1.39-3.62 3.51-3.62.69 0 1.53.12 2.22.24v2.44h-1.25c-1.23 0-1.61.76-1.61 1.55V12h2.74l-.44 2.89h-2.3v6.99A10 10 0 0 0 22 12z"/>
                            </svg>
                        </a>

                        <a
                            href="https://www.linkedin.com/company/103721418/admin/dashboard/LinkedIn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/40 hover:bg-blue-600 border border-blue-300 rounded-xl p-3 transition-all duration-200 hover:-translate-y-1"
                            aria-label="LinkedIn"
                        >
                            <svg className="w-5 h-5 fill-blue-900 hover:fill-white transition-colors duration-200"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/>
                            </svg>
                        </a>

                        <a
                            href="https://www.upwork.com/agencies/1768339692736311296/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/40 hover:bg-green-500 border border-blue-300 rounded-xl p-3 transition-all duration-200 hover:-translate-y-1"
                            aria-label="Upwork"
                        >
                            <svg className="w-5 h-5 fill-blue-900 hover:fill-white transition-colors duration-200"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path d="M18.56 12.67c-1.1 0-2.13-.42-2.93-1.09l.22-1.02.01-.07c.19-1.07.78-2.87 2.7-2.87a2.53 2.53 0 0 1 2.53 2.53 2.53 2.53 0 0 1-2.53 2.52zm0-7.1c-2.6 0-4.63 1.7-5.48 4.46-.79-1.41-1.39-3.1-1.74-4.53H8.87v5.5a2.36 2.36 0 0 1-2.35 2.35 2.36 2.36 0 0 1-2.36-2.35V5.5H1.69v5.5a4.84 4.84 0 0 0 4.83 4.84 4.84 4.84 0 0 0 4.84-4.84v-.92c.34.73.76 1.47 1.25 2.14L10.9 18.5h2.42l1.09-4.01c.96.62 2.07.98 3.24.98 3.05 0 5.2-2.23 5.2-5.02a5.02 5.02 0 0 0-5.02-5.02z" />
                            </svg>
                        </a>

                    </div>
                </div>

            </div>
        </footer>
    );
}
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md" >
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">Notionnik</h1>
                <div className="space x-6">
                    <Link to="/" className="hover:text-blue-500">Dashboard</Link>
                    <Link to="/about" className="hover:text-blue-500">About Us</Link>
                    <Link to="/services" className="hover:text-blue-500">Services</Link>
                    <Link to="/case-studies" className="hover:text-blue-500">Case Studies</Link>
                    <Link to="/book" className="hover:text-blue-500">Book Now</Link>
                </div>
            </div>
        </nav>
    );
}
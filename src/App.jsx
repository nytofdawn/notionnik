import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import Book from "./pages/Book";
import ChatBot from "./components/Chatboot";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/case-studies" element={<CaseStudies/>} />
          <Route path="/book" element={<Book />} />
        </Routes>
        <Footer />
        <ChatBot />
    </Router>
  );
}

export default App;
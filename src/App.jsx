import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./pages/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import Book from "./pages/Book";
import ChatBot from "./components/Chatboot";
import CustomCursor from "./components/customcursor";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CustomCursor />
        <Navbar />
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/about"       element={<AboutUs />} />
          <Route path="/services"    element={<Services />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/book"        element={<Book />} />
        </Routes>
        <Footer />
        <ChatBot />
      </ThemeProvider>
    </Router>
  );
}

export default App;
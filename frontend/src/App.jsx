import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ParticleBg from "./components/ParticleBg";
import TimeDisplay from "./components/TimeDisplay";
import ScrollToTop from "./components/ScrollToTop";
import LoadingScreen from "./components/LoadingScreen";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

export default function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  return (
    <BrowserRouter>
      {/* Dynamic 4-Second Typing Loader Screen */}
      <LoadingScreen onComplete={() => setIsLoadingComplete(true)} />

      {isLoadingComplete && (
        <div id="page-content" className="relative min-h-screen flex flex-col bg-black overflow-x-hidden">
          {/* Global Ambient Interactive Canvas Background */}
          <ParticleBg />

          {/* Persistent Standard Header Nav */}
          <Header />

          {/* Floating Time Display Unit */}
          <TimeDisplay />

          {/* Core Routes Container */}
          <main className="flex-grow flex flex-col relative z-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/index.html" element={<Navigate to="/" replace />} />
                
                <Route path="/about" element={<About />} />
                <Route path="/about.html" element={<Navigate to="/about" replace />} />
                
                <Route path="/skills" element={<Skills />} />
                <Route path="/skills.html" element={<Navigate to="/skills" replace />} />
                
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects.html" element={<Navigate to="/projects" replace />} />
                
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact.html" element={<Navigate to="/contact" replace />} />

                <Route path="/admin" element={<Admin />} />

                {/* Catch-all route mapping to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>

          {/* Back to top scroll widget */}
          <ScrollToTop />

          {/* Master Layout Footing */}
          <Footer />
        </div>
      )}
    </BrowserRouter>
  );
}

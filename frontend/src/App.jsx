import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import PaperTexture from "./components/PaperTexture";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Experience from "./pages/Experience";

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div id="page-content" className="relative min-h-screen flex flex-col bg-paper overflow-x-hidden">
      {/* Paper Texture and Dust Background */}
      <PaperTexture />
      
      {/* Custom DOM Cursor (kept from original) */}
      <CustomCursor />
      
      {/* Persistent Standard Header Nav */}
      <Header />

      {/* Main Page Layout Container */}
      <main className="flex-grow flex flex-col relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/about.html" element={<Navigate to="/about" replace />} />
            
            <Route path="/skills" element={<Skills />} />
            <Route path="/skills.html" element={<Navigate to="/skills" replace />} />
            
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects.html" element={<Navigate to="/projects" replace />} />
            
            <Route path="/experience" element={<Experience />} />
            <Route path="/experience.html" element={<Navigate to="/experience" replace />} />
            
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact.html" element={<Navigate to="/contact" replace />} />

            <Route path="/admin" element={<Admin />} />

            {/* Catch-all route mapping to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* Master Layout Footing */}
      <Footer />
    </div>
  );
}

export default function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  return (
    <BrowserRouter>
      {/* Editorial Premium Loading Screen */}
      {!isLoadingComplete && <LoadingScreen onComplete={() => setIsLoadingComplete(true)} />}

      {isLoadingComplete && <AppLayout />}
    </BrowserRouter>
  );
}

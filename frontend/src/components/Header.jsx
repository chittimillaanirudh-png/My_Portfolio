import React, { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Logo from "./Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const handleHireMe = () => {
    setIsOpen(false);
    navigate("/contact");
  };

  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isHome ? 'bg-transparent' : 'bg-paper/85 backdrop-blur-md navbar-fade'}`}>
        <div className="flex justify-between items-center px-6 lg:px-12 py-5 max-w-7xl mx-auto">
          {/* Logo - click opens admin panel */}
          <Link
            to="/admin"
            className="text-ink hover:opacity-70 transition-opacity flex items-center gap-2 -ml-2 lg:-ml-6"
          >
            <Logo className="w-9 h-9 md:w-16 md:h-16" />
            <span className="font-bebas text-lg md:text-4xl tracking-wider pt-1">AC.</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8 font-inter text-sm font-medium text-ink">
            {navItems.map((item) => (
               <NavLink
                 key={item.name}
                 to={item.path}
                 className={({ isActive }) =>
                   `transition-all duration-300 pb-1 border-b-2 ${
                     isActive
                       ? "border-ink"
                       : "border-transparent hover:border-ink/30"
                   }`
                 }
               >
                 {item.name}
               </NavLink>
            ))}
          </div>

          {/* Hire Me Button */}
          <button
            onClick={handleHireMe}
            className="hidden md:flex items-center gap-2 btn-outline px-6 py-2 rounded text-sm font-inter font-medium text-ink uppercase tracking-wide group"
          >
            Hire Me
            <span className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-paper">
              ↗
            </span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-ink focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Left side) */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-paper shadow-2xl z-[9999] flex flex-col items-start justify-start pt-28 gap-8 px-8 transform transition-transform duration-500 drawer-fade-left ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `font-bebas text-2xl tracking-wide w-full transition-all duration-300 ${
                isActive ? "text-ink opacity-100" : "text-ink opacity-60 hover:opacity-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
        
        <button
          onClick={handleHireMe}
          className="btn-outline px-8 py-4 rounded text-lg font-inter font-medium text-ink uppercase tracking-wide w-full mt-4 flex justify-between items-center group"
        >
          Hire Me
          <span className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-paper">
            ↗
          </span>
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-[9998] transition-opacity duration-500"
        />
      )}
    </>
  );
}

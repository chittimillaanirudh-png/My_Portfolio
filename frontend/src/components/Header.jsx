import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

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

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-[#484848]/20 shadow-[0_0_40px_rgba(255,138,122,0.1)]">
        <div className="flex justify-between items-center px-8 py-6 max-w-[1440px] mx-auto">
          {/* Logo - click opens admin panel */}
          <Link
            to="/admin"
            className="text-xl font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] font-headline hover:scale-105 transition-transform"
          >
            AC
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-10 font-headline font-light tracking-wide uppercase text-[10px] md:text-xs">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `transition-colors duration-300 pb-1 ${
                    isActive
                      ? "text-[#ff8a7a] font-medium border-b border-[#ff8a7a]"
                      : "text-[#acabaa] hover:text-[#ff8a7a]"
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
            className="hidden md:block bg-transparent border border-outline-variant/30 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest text-[#ff8a7a] hover:shadow-[0_0_15px_-2px_#ff8a7a] hover:border-[#ff8a7a] transition-all duration-300 scale-95 active:scale-90 font-headline"
          >
            Hire Me
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#ff8a7a] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] max-w-[280px] overflow-hidden bg-[#131313]/90 backdrop-blur-2xl border-l border-[#484848]/30 z-[9999] flex flex-col items-start justify-start pt-28 gap-8 px-8 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={handleHireMe}
          className="bg-transparent border border-outline-variant/30 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest text-[#ff8a7a] hover:shadow-[0_0_15px_-2px_#ff8a7a] hover:border-[#ff8a7a] transition-all duration-300 scale-95 active:scale-90 font-headline w-full mb-2"
        >
          Hire Me
        </button>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `font-headline text-[12px] uppercase tracking-widest w-full transition-all duration-300 ${
                isActive
                  ? "text-[#ff8a7a] border-b border-[#ff8a7a] pb-1 font-medium"
                  : "text-[#acabaa] hover:text-[#ff8a7a]"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-500"
        />
      )}
    </>
  );
}

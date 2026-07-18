import React from "react";
import { useLocation } from "react-router-dom";
import { Mail } from "lucide-react";

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className={`w-full bg-transparent relative z-10 ${isHome ? 'lg:absolute lg:bottom-0 lg:left-0 lg:max-w-[55vw]' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`border-t border-ink/20 py-8 flex flex-col md:flex-row justify-between items-center gap-6 ${isHome ? 'lg:border-t-0 lg:py-4 lg:pt-0' : ''}`}>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-ink font-inter text-sm font-medium">
              © 2026 Anirudh Chittimilla. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              className="text-ink hover:text-ink/60 transition-colors duration-300"
              href="https://github.com/chittimillaanirudh-png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
            <a
              className="text-ink hover:text-ink/60 transition-colors duration-300"
              href="https://www.linkedin.com/in/anirudh-chittimilla-a74360341"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              className="text-ink hover:text-ink/60 transition-colors duration-300"
              href="https://www.instagram.com/ch_anirudh37_official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a
              className="text-ink hover:text-ink/60 transition-colors duration-300"
              href="mailto:chittimillaanirudh@gmail.com"
              aria-label="Email"
            >
              <Mail size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

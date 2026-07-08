import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 bg-[#131313] relative z-10 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline font-light tracking-widest text-[#ff8a7a] text-xs uppercase">
            Building the future with code
          </span>
          <span className="text-[#acabaa] text-[10px] tracking-widest uppercase font-body">
            © 2026 ANIRUDH CHITTIMILLA • ALL RIGHTS RESERVED
          </span>
        </div>
        <div className="flex gap-8">
          <a
            className="font-headline text-sm tracking-tighter text-[#acabaa] hover:text-[#c0ee91] underline-offset-8 hover:underline decoration-[#c0ee91] transition-all duration-500"
            href="https://www.instagram.com/ch_anirudh37_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            className="font-headline text-sm tracking-tighter text-[#acabaa] hover:text-[#c0ee91] underline-offset-8 hover:underline decoration-[#c0ee91] transition-all duration-500"
            href="https://www.linkedin.com/in/anirudh-chittimilla-a74360341"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="font-headline text-sm tracking-tighter text-[#acabaa] hover:text-[#c0ee91] underline-offset-8 hover:underline decoration-[#c0ee91] transition-all duration-500"
            href="https://github.com/chittimillaanirudh-png"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

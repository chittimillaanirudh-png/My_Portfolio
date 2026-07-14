import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code, Link as LinkIcon } from "lucide-react";
import API_BASE from "../utils/api";

export default function Home() {
  const [banner, setBanner] = useState({
    title: "ANIRUDH CHITTIMILLA",
    subtitle: "Building Digital Experiences",
    roles: "B.Tech Student | Developer | Problem Solver",
    description: "Passionate developer focused on building modern, efficient, and scalable digital solutions. I enjoy transforming ideas into real-world applications through clean code, creative design, and continuous learning.",
    imageUrl: "https://ik.imagekit.io/y3evpdae0/freepik_br_ee1db127-e0c6-4d46-afd5-449ad2120392.png"
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load");
      })
      .then((data) => {
        if (data.homeBanner) {
          setBanner(data.homeBanner);
        }
      })
      .catch((err) => console.error("Error loading home banner:", err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex-grow flex items-center pt-32 pb-24 px-8 md:px-16 lg:px-24 max-w-[1440px] mx-auto z-10 w-full"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        {/* Main Hero Header Info */}
        <div className="lg:col-span-6 order-1 lg:order-1 space-y-4 text-center lg:text-left w-full">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block label-md uppercase tracking-[0.2em] text-secondary font-headline text-[10px] md:text-xs"
          >
            {banner.subtitle}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-headline font-light tracking-tight signature-gradient break-words leading-tight uppercase"
          >
            {banner.title}
          </motion.h1>
        </div>

        {/* Cinematic Portrait with Parallax Blur Background */}
        <div className="lg:col-span-6 lg:row-span-2 home-right lg:justify-end order-2 lg:order-2 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="home-image-wrap mx-auto"
          >
            <img
              alt="Professional portrait of Anirudh"
              src={banner.imageUrl}
              className="relative z-10 filter grayscale brightness-90 hover:grayscale-0 transition-all duration-700 max-h-[480px] object-contain mx-auto"
            />
          </motion.div>
        </div>

        {/* Detailed Secondary Segment */}
        <div className="lg:col-span-6 order-3 lg:order-3 space-y-8 text-center lg:text-left w-full">
          <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span className="w-8 h-[1px] bg-outline-variant/40"></span>
              <p className="text-sm md:text-base font-medium text-on-surface-variant font-body">
                {banner.roles}
              </p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg md:text-xl text-on-surface/80 font-light leading-relaxed font-body"
            >
              {banner.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 text-primary font-headline font-light italic text-sm tracking-wide justify-center lg:justify-start"
            >
              <ArrowRight size={14} className="text-primary" />
              <span>Explore My Portfolio</span>
            </motion.div>
          </div>

          {/* Quick CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-wrap gap-6 pt-4 justify-center lg:justify-start"
          >
            <Link
              to="/projects"
              className="px-8 py-4 bg-transparent rounded-full border border-outline-variant/30 text-on-surface font-headline uppercase text-xs tracking-widest hover:border-primary hover:text-primary hover:shadow-[0_0_15px_-2px_#ff8e7f] transition-all duration-300 scale-95 active:scale-90"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent rounded-full border border-outline-variant/30 text-on-surface font-headline uppercase text-xs tracking-widest hover:border-secondary hover:text-secondary hover:shadow-[0_0_15px_-2px_#c0ee91] transition-all duration-300 scale-95 active:scale-90"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Sidebar Social Links on desktop */}
      <div className="fixed left-8 bottom-0 hidden xl:flex flex-col items-center gap-6 pb-12 z-50">
        <a
          className="group flex flex-col items-center gap-1 text-[#acabaa] hover:text-primary transition-all duration-300"
          href="https://github.com/chittimillaanirudh-png"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-[9px] font-headline uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 mb-4 opacity-50">
            GitHub
          </span>
          <Code size={16} />
        </a>
        <a
          className="group flex flex-col items-center gap-1 text-[#acabaa] hover:text-secondary transition-all duration-300"
          href="https://www.linkedin.com/in/anirudh-chittimilla-a74360341"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-[9px] font-headline uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 mb-4 opacity-50">
            LinkedIn
          </span>
          <LinkIcon size={16} />
        </a>
        <a
          className="group flex flex-col items-center gap-1 text-[#acabaa] hover:text-tertiary transition-all duration-300"
          href="https://www.instagram.com/ch_anirudh37_official"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-[9px] font-headline uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 mb-4 opacity-50">
            Instagram
          </span>
          <svg
            className="w-4 h-4 text-inherit"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <div className="w-[1px] h-24 bg-outline-variant/30 mt-4"></div>
      </div>
    </motion.div>
  );
}

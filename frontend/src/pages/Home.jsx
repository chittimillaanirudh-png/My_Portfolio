import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, ArrowDown } from "lucide-react";
import API_BASE from "../utils/api";

export default function Home() {
  const [banner, setBanner] = useState({
    title: "ANIRUDH CHITTIMILLA",
    subtitle: "Hello, I'm",
    roles: "DEVELOPER | DESIGNER | PROBLEM SOLVER",
    description: "I'm a B.Tech CSE (AI & ML) student who loves turning ideas into real-world solutions. I build full-stack applications and explore AI to create impactful experiences.",
    imageUrl: "https://res.cloudinary.com/dqsl62kr9/image/upload/v1784382887/portfolio_zy6lxy.png" // User will update via admin or file upload
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex-grow flex flex-col justify-center pt-32 pb-12 w-full"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        {/* Text Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 xl:col-span-6 space-y-6 z-10 lg:pr-8"
        >
          <motion.p variants={itemVariants} className="text-ink font-inter text-lg md:text-xl font-medium">
            {banner.subtitle || "Hello, I'm"}
          </motion.p>
          
          <motion.h1 
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bebas text-ink leading-[0.85] tracking-tight"
          >
            {banner.title.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </motion.h1>

          <motion.h2 variants={itemVariants} className="text-ink font-inter font-bold text-sm md:text-base tracking-widest uppercase mt-4">
            {banner.roles}
          </motion.h2>

          {/* Portrait (Mobile only) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="block lg:hidden w-full h-[45vh] min-h-[320px] overflow-hidden rounded-2xl border border-ink/20 mt-6 relative z-10"
          >
            <img
              alt={banner.title}
              src={banner.imageUrl}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          <motion.p variants={itemVariants} className="text-ink/80 font-inter text-base md:text-lg max-w-lg leading-relaxed mt-6">
            {banner.description}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-6">
            <Link
              to="/projects"
              className="group flex items-center justify-center gap-2 btn-outline bg-ink text-paper px-8 py-4 text-sm font-inter font-medium tracking-wider uppercase min-w-[200px]"
            >
              View My Work
              <ArrowUpRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <a
              href="#"
              download
              className="group flex items-center justify-center gap-2 btn-outline px-8 py-4 text-sm font-inter font-medium tracking-wider uppercase text-ink hover:text-paper min-w-[200px]"
            >
              Download CV
              <Download size={18} className="transform transition-transform duration-300 group-hover:translate-y-1" />
            </a>
          </motion.div>
        </motion.div>

        {/* Portrait */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="hidden lg:block fixed right-0 top-0 w-[45vw] h-screen z-0 overflow-hidden"
        >
          <img
            alt={banner.title}
            src={banner.imageUrl}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Pill, Globe2 } from "lucide-react";
import API_BASE from "../utils/api";

const projectData = [
  {
    id: "lmtu",
    title: "LMTU",
    subtitle: "MEDICINE REMINDER SYSTEM",
    description: "LMTU is an AI-powered medicine reminder and tracking system that helps users manage their medications, get timely reminders, and track daily intake across multiple profiles.",
    points: [
      "Multi-profile support",
      "Smart reminders & notifications",
      "Medicine tracking & history",
      "AI report analysis & insights"
    ],
    tech: ["React", "Node.js", "MongoDB", "AI / Gemini", "Tailwind CSS"],
    icon: <Pill size={36} strokeWidth={1.5} />,
    illustration: "pill",
    liveUrl: "https://lmt-u-app.vercel.app"
  },
  {
    id: "gp",
    title: "GLOBAL PRICE",
    subtitle: "STANDARDIZING PRODUCT VALUE GLOBALLY",
    description: "Global Price (GP) is a platform that standardizes product value across different countries by analyzing market trends, currency variations, and regional factors.",
    points: [
      "Global price comparison",
      "Real-time market analysis",
      "Currency & region adjustments",
      "Data-driven pricing insights"
    ],
    tech: ["React", "Firebase", "Charts.js", "REST API", "Tailwind CSS"],
    icon: <Globe2 size={36} strokeWidth={1.5} />,
    illustration: "globe",
    liveUrl: "https://global-price-gp.vercel.app"
  }
];

export default function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-transparent py-24 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div>
            <div className="mb-4">
              <span className="font-inter font-medium text-sm tracking-widest uppercase text-ink border-b border-ink/20 inline-block pb-1">
                MY WORK
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bebas leading-[0.85] tracking-tight text-ink">
              PROJECTS I'VE BUILT.
            </h2>
          </div>
          <div className="lg:max-w-md">
            <p className="text-ink/80 font-inter text-base leading-relaxed">
              Here are some of the projects I've worked on.<br/>Each one taught me something new and<br/>pushed me to grow.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {projectData.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group border border-ink/20 rounded-xl p-8 lg:p-10 bg-paper/50 hover:bg-paper hover:border-ink/40 transition-colors duration-300 relative flex flex-col h-full overflow-hidden"
            >
              {/* Top Link Icon */}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-8 right-8 text-ink/40 hover:text-ink hover:scale-110 group-hover:text-ink/70 transition-all duration-300 z-30"
                title="View Live Site"
              >
                <ArrowUpRight size={24} />
              </a>

              {/* Title Header */}
              <div className="flex items-center gap-4 mb-6 relative z-10 border-b border-ink/20 pb-6 w-full lg:w-[65%]">
                <div className="w-16 h-16 border border-ink/20 rounded-xl flex items-center justify-center bg-paper text-ink">
                  {project.icon}
                </div>
                <div>
                  <h3 className="font-bebas text-4xl tracking-wide text-ink">{project.title}</h3>
                  <p className="font-inter text-[10px] md:text-xs font-bold tracking-widest uppercase text-ink/70">
                    {project.subtitle}
                  </p>
                </div>
              </div>

              {/* Content & Illustration Container */}
              <div className="flex flex-col lg:flex-row flex-1 relative">
                
                {/* Text Content */}
                <div className="flex-1 lg:w-[60%] lg:pr-6 z-10">
                  <p className="font-inter text-sm md:text-base text-ink/80 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {project.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 font-inter text-sm text-ink/90">
                        <span className="text-ink/50 mt-0.5">→</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 border border-ink/30 text-ink text-[10px] font-inter font-bold uppercase tracking-wider rounded bg-paper/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Illustration (Simulated with large icons since we don't have the image assets) */}
                <div className="hidden lg:flex w-[40%] absolute right-0 bottom-0 top-0 items-end justify-end opacity-20 pointer-events-none">
                   {project.illustration === 'pill' ? (
                     <Pill size={250} strokeWidth={0.5} className="text-ink -mr-10 -mb-10" />
                   ) : (
                     <Globe2 size={250} strokeWidth={0.5} className="text-ink -mr-10 -mb-10" />
                   )}
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}

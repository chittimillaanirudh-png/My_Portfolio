import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import API_BASE from "../utils/api";

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      title: "LMT.U",
      subtitle: "Let Me Tell You",
      category: "Live Project",
      desc: "A modern medicine management and family health tracking platform. In the spirit of complete transparency, this entire application was built, architected, and deployed using advanced AI orchestration. It showcases my ability to leverage prompt engineering, system design, and AI tools (Gemini, ChatGPT, and Claude) to bring a full-stack concept to life without traditional manual coding.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      tags: [
        "AI-Driven Development",
        "Prompt Engineering",
        "Gemini",
        "ChatGPT",
        "Claude",
        "Vercel",
      ],
      link: "https://lmt-u-app.vercel.app",
    },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load");
      })
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="relative pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full"
    >
      <section className="relative mb-20">
        <div className="orbital-path w-[800px] h-[800px] -top-64 -left-32 hidden md:block"></div>
        <div className="max-w-3xl">
          <span className="label-md uppercase tracking-[0.2rem] text-secondary font-semibold mb-4 block font-headline text-xs">
            Portfolio
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-headline font-light tracking-tight mb-6 bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] bg-clip-text text-transparent leading-tight">
            My Projects
          </h1>
          <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl font-body">
            A showcase of my recent work and experiments. Exploring the boundaries between creative expression and technical precision.
          </p>
        </div>
      </section>

      {/* Projects Grid/Rows */}
      <section className="mt-20 space-y-24">
        {projects.map((project, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-7 order-1"
            >
              <div className="aspect-video bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-30 transition-opacity" />
                <img
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 scale-105 group-hover:scale-100"
                  alt={`${project.title} — ${project.subtitle}`}
                  src={project.image}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-5 order-2"
            >
              <span className="label-md uppercase tracking-[0.2rem] text-secondary mb-4 block font-headline text-xs">
                {project.category}
              </span>
              <h3 className="text-4xl font-headline font-light mb-2">
                {project.title}
              </h3>
              <p className="text-on-surface-variant text-sm tracking-widest uppercase mb-6 font-headline">
                {project.subtitle}
              </p>
              <p className="text-on-surface-variant leading-relaxed mb-6 font-body text-base">
                {project.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-outline-variant/30 text-on-surface-variant font-headline"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15rem] font-bold text-primary hover:text-secondary transition-all duration-300 group/btn"
              >
                View Live App
                <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
              <div className="w-12 h-[1px] bg-outline-variant mt-8"></div>
            </motion.div>
          </div>
        ))}
      </section>
    </motion.div>
  );
}

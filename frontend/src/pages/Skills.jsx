import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Database, Terminal, Cpu, Monitor, BrainCircuit } from "lucide-react";
import API_BASE from "../utils/api";

const skillCards = [
  {
    icon: <div className="font-bebas text-5xl font-bold">C</div>, // Custom 'C' letter or icon
    percentage: "90%",
    title: "C LANGUAGE",
    description: "Strong foundation in C programming, data structures, algorithms and problem solving.",
    progress: 90
  },
  {
    icon: <div className="w-10 h-10 border-4 border-ink rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-ink rounded-tl-full rounded-br-full" />
    </div>, // Python like icon
    percentage: "90%",
    title: "PYTHON",
    description: "Building efficient programs, automations and solving real-world problems with Python.",
    progress: 90
  },
  {
    icon: <div className="w-12 h-10 border-2 border-ink rounded-lg flex items-center justify-center font-bold text-xs">&lt;/&gt;</div>,
    percentage: "90%",
    title: "DATA STRUCTURES",
    description: "Strong grasp of data structures and algorithms to write optimized and efficient code.",
    progress: 90
  },
  {
    icon: <div className="font-bebas text-4xl font-bold flex items-center">C<span className="text-2xl mt-1">++</span></div>,
    percentage: "85%",
    title: "C++",
    description: "Object oriented programming, STL, and building efficient applications.",
    progress: 85
  },
  {
    icon: <div className="w-12 h-12 bg-ink text-paper rounded-full flex items-center justify-center font-bold text-sm">&lt;/&gt;</div>,
    percentage: "80%",
    title: "VIBE CODING",
    description: "Solving problems on coding platforms and improving logic and problem solving speed.",
    progress: 80
  },
  {
    icon: <BrainCircuit size={40} strokeWidth={1.5} />,
    percentage: "85%",
    title: "PROMPT ENGINEERING",
    description: "Designing effective prompts and leveraging AI models to build smart and useful solutions.",
    progress: 85
  }
];

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-transparent py-24 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-8">

        {/* Left Side Content */}
        <div className="flex-1 lg:max-w-md xl:max-w-lg pr-4">
          <div className="mb-8">
            <span className="font-inter font-medium text-sm tracking-widest uppercase text-ink border-b border-ink/20 inline-block pb-1">
              MY SKILLS
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bebas leading-[0.85] tracking-tight text-ink mb-6">
            TOOLS I USE.<br />PROBLEMS I SOLVE.
          </h2>
          <p className="text-ink/80 font-inter text-base md:text-lg leading-relaxed mb-10">
            I enjoy turning ideas into efficient, scalable and impactful solutions. Here are the core skills I use to build and solve.
          </p>
          <button className="group flex items-center justify-center gap-2 btn-outline border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper px-6 py-3 font-inter text-xs font-bold tracking-widest uppercase transition-all duration-300">
            KEEP LEARNING, KEEP BUILDING
            <ArrowUpRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>

        {/* Right Side Cards Grid */}
        <div className="flex-1 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {skillCards.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col justify-between border border-ink/20 rounded-xl p-6 bg-paper/50 hover:bg-paper hover:border-ink/40 transition-colors duration-300 h-64"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-ink">
                      {skill.icon}
                    </div>
                    <span className="font-inter text-xs font-bold text-ink/70 mt-2">
                      {skill.percentage}
                    </span>
                  </div>
                  <h3 className="font-bebas text-2xl tracking-wide text-ink mb-2">
                    {skill.title}
                  </h3>
                  <p className="font-inter text-xs text-ink/80 leading-relaxed line-clamp-3">
                    {skill.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 flex items-center h-2 w-full border border-ink/20 rounded-full overflow-hidden bg-transparent">
                  <div
                    className="h-full bg-ink rounded-full"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}

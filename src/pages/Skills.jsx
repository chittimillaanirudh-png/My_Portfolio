import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Code2, Network, Globe, Sparkles } from "lucide-react";

const iconMap = {
  Terminal,
  Cpu,
  Code2,
  Network,
  Globe,
  Sparkles
};

export default function Skills() {
  const [skills, setSkills] = useState([
    {
      id: "01",
      title: "C",
      desc: "Strong foundation in programming concepts, memory management, and procedural logic implementation.",
      iconName: "Terminal",
      color: "hover:border-primary-dim/40 hover:shadow-[0_20px_40px_rgba(238,125,110,0.05)]",
      textColor: "text-primary"
    },
    {
      id: "02",
      title: "C++",
      desc: "Object-oriented programming, STL mastery, and high-performance problem solving for competitive coding.",
      iconName: "Cpu",
      color: "hover:border-secondary/40 hover:shadow-[0_20px_40px_rgba(192,238,145,0.05)]",
      textColor: "text-secondary"
    },
    {
      id: "03",
      title: "Python",
      desc: "Scripting, logic building, and application development with a focus on clean, readable, and efficient code.",
      iconName: "Code2",
      color: "hover:border-tertiary/40 hover:shadow-[0_20px_40px_rgba(243,167,125,0.05)]",
      textColor: "text-tertiary"
    },
    {
      id: "04",
      title: "DSA",
      desc: "Efficient problem-solving using advanced data structures and optimized algorithms for complex challenges.",
      iconName: "Network",
      color: "hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)]",
      textColor: "text-primary"
    },
    {
      id: "05",
      title: "Web Development",
      desc: "Acting as a system architect to build modern, responsive web applications. Creating highly customized, interactive UIs focusing on seamless front-end design and strong user experience.",
      iconName: "Globe",
      color: "hover:border-[#c0ee91]/40 hover:shadow-[0_20px_40px_rgba(192,238,145,0.05)]",
      textColor: "text-[#c0ee91]"
    },
    {
      id: "06",
      title: "Prompt Engineering",
      desc: "Expertly orchestrating advanced AI tools (Gemini, ChatGPT, Claude) for precise code generation, rapid debugging, and building complex web applications without manual hardcoding.",
      iconName: "Sparkles",
      color: "hover:border-[#ff8e7f]/40 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)]",
      textColor: "text-[#ff8e7f]"
    }
  ]);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load");
      })
      .then((data) => {
        if (data.skills && data.skills.length > 0) {
          setSkills(data.skills);
        }
      })
      .catch((err) => console.error("Error loading skills:", err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="relative pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen w-full"
    >
      {/* Background Orbs */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none"></div>

      <section className="max-w-4xl mx-auto mb-20 text-center md:text-left">
        <div className="inline-block px-3 py-1 mb-6 border border-outline-variant/20 rounded-full">
          <span className="label-md uppercase tracking-[0.2em] text-secondary text-[10px] font-headline">
            Expertise & Technical Stack
          </span>
        </div>
        <h1 className="font-headline font-light text-5xl md:text-8xl leading-tight mb-8 hero-gradient">
          My Skills
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-4">
          I focus on building strong fundamentals in programming and continuously improving my problem-solving abilities through practice and real-world applications.
        </p>
        <p className="font-headline font-medium text-secondary text-sm tracking-widest uppercase">
          Always learning, always improving.
        </p>
      </section>

      {/* Grid container with parallax cascade animations */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto"
      >
        {skills.map((skill, index) => {
          const IconComponent = iconMap[skill.iconName || "Terminal"] || Terminal;
          const isLarge = index === 4 || index === 5;
          return (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              className={`group relative p-8 rounded-xl bg-surface-container-low border border-outline-variant/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
                isLarge ? "md:col-span-6" : index % 2 === 0 ? "md:col-span-5" : "md:col-span-7"
              } ${skill.color}`}
            >
              {isLarge && (
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity ${
                  index === 4 ? "bg-[#c0ee91]" : "bg-[#ff8e7f]"
                }`} />
              )}
              <div className="flex justify-between items-start mb-12">
                <div className="p-4 rounded-lg bg-surface-container-high relative z-10">
                  <IconComponent className={`${skill.textColor}`} size={32} />
                </div>
                <span className={`label-md font-mono tracking-tighter relative z-10 ${skill.textColor} opacity-60`}>
                  {skill.id}
                </span>
              </div>
              <h3 className="font-headline font-light text-3xl text-on-surface mb-4 relative z-10">
                {skill.title}
              </h3>
              <p className="text-on-surface-variant font-light leading-relaxed font-body relative z-10">
                {skill.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Footer Banner */}
      <section className="mt-32 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/5"
        >
          <img
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            alt="Futuristic neural network banner"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU4EVBgo1w7Fe1MDOmiZa01aOht1Btmyf30iYQPaZUhFvXYZqL8Nvm_gyNeTnbFZP949JaHBcSGP5l0DtTIXpFLoMcVx-Gh_NnaQn20uukRQvN5BZZ3YckxvSFd0NFOKSccF5MBrRrAICIUAo7UmUBDJI1dbAVQAnHcMdmF-ey_sWU6_FCSs7Uipwdf3mj6OOtudBCL5WR_bTsoYIv8i0DBpAXI-IJSN7YZrtFMS5RPjh3Panl9fXwHvQKWWaCX1HXLUyJb3vUqKnC"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
            <Sparkles className="text-secondary mb-6 animate-pulse" size={48} />
            <h2 className="font-headline text-3xl md:text-5xl font-extralight text-on-surface tracking-tighter max-w-2xl leading-tight">
              Architecture of the <span className="text-primary italic">Digital Frontier</span>
            </h2>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

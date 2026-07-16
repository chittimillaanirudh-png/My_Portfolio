import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import API_BASE from "../utils/api";

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load");
      })
      .then((data) => {
        if (data.experience) {
          setExperience(data.experience);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading experience:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="relative pt-32 pb-24 px-8 max-w-[1440px] mx-auto z-10 w-full min-h-[70vh] flex flex-col"
    >
      <header className="mb-16 space-y-6">
        <span className="label-md uppercase tracking-[0.2em] text-secondary font-headline text-[10px] block">
          Professional Journey
        </span>
        <h1 className="text-5xl md:text-7xl font-headline font-light leading-tight gradient-text tracking-tight">
          Experience
        </h1>
      </header>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-[#acabaa] font-headline tracking-widest uppercase text-xs animate-pulse">Loading...</p>
        </div>
      ) : experience.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center space-y-6 text-center opacity-60">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/10">
            <Briefcase className="text-on-surface-variant" size={32} />
          </div>
          <h2 className="text-2xl font-headline font-light text-on-surface">
            No Experience Yet
          </h2>
          <p className="text-on-surface-variant font-body max-w-md">
            I am currently focusing on building my skills and portfolio. Open to opportunities and exciting projects.
          </p>
        </div>
      ) : (
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/20 before:to-transparent">
          {experience.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/30 bg-surface-container-high text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Briefcase size={16} />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-secondary/30 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                  <h3 className="font-headline text-xl text-on-surface font-medium">{item.role}</h3>
                  <span className="text-[10px] font-headline uppercase tracking-widest text-secondary/80 bg-secondary/10 px-3 py-1 rounded-full whitespace-nowrap">
                    {item.duration}
                  </span>
                </div>
                <div className="text-primary text-sm font-headline uppercase tracking-wider mb-4">
                  {item.company}
                </div>
                <p className="text-on-surface-variant font-body text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

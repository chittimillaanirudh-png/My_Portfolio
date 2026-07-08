import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="relative pt-32 pb-24 px-8 max-w-[1440px] mx-auto z-10 w-full"
    >
      <section className="mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1 space-y-8">
            <span className="label-md uppercase tracking-[0.2em] text-secondary font-headline text-xs block">
              Curating the Future
            </span>
            <h1 className="text-5xl md:text-8xl font-headline font-light leading-tight gradient-text">
              About Me
            </h1>
            <p className="text-xl md:text-2xl text-on-surface font-light leading-relaxed max-w-2xl font-body">
              I am a dedicated and passionate B.Tech student with a strong interest in software development and problem-solving. I enjoy building efficient, scalable, and user-friendly applications that solve real-world challenges.
            </p>
            <p className="text-xl md:text-2xl text-on-surface font-light leading-relaxed max-w-2xl font-body">
              My journey in technology started with curiosity and has grown into a deep passion for coding, system design, and continuous improvement. I constantly explore new tools, technologies, and best practices to enhance my skills.
            </p>
            <p className="text-xl md:text-2xl text-on-surface font-light leading-relaxed max-w-2xl font-body">
              I believe in writing clean, maintainable code and creating impactful digital experiences. My goal is to become a skilled developer who can contribute to innovative and meaningful projects.
            </p>
          </div>

          <div className="home-right w-full md:w-2/5 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="home-image-wrap"
            >
              <div className="home-image-bg absolute inset-0 bg-[#ff8a7a]/5 rounded-full blur-[60px]" />
              <img
                alt="Cinematic portrait of Anirudh Chittimilla"
                src="https://ik.imagekit.io/y3evpdae0/ChatGPT%20Image%20Mar%2031,%202026,%2005_49_42%20PM.png"
                className="rounded-2xl border border-outline-variant/10 relative z-10 filter grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
        {/* Creative Journey card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-8 p-8 md:p-12 rounded-xl bg-surface-container-low border border-outline-variant/20 relative overflow-hidden group hover:bg-surface-container transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32 rounded-full"></div>
          <Sparkles className="text-primary mb-6" size={32} />
          <h3 className="text-2xl font-headline font-medium mb-6 text-on-surface">
            The Creative Journey
          </h3>
          <p className="text-on-surface-variant text-lg leading-relaxed font-light font-body">
            My journey in technology started with curiosity and has grown into a deep passion for coding, system design, and continuous improvement. I constantly explore new tools, technologies, and best practices to enhance my skills. I believe in writing clean, maintainable code and creating impactful digital experiences. My goal is to become a skilled developer who can contribute to innovative and meaningful projects.
          </p>
        </motion.div>

        {/* Mission card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-4 p-8 rounded-xl bg-surface-container-high border border-outline-variant/20 flex flex-col justify-center relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
        >
          <div className="orbital-line top-1/4"></div>
          <div className="orbital-line bottom-1/4"></div>
          <span className="label-md uppercase tracking-widest text-[#acabaa] mb-4 text-[10px] block">
            Mission
          </span>
          <h4 className="text-2xl font-headline font-light italic leading-snug text-primary-dim">
            "To leverage my technical skills and creativity to build impactful software solutions while continuously learning and growing in the field of technology."
          </h4>
        </motion.div>

        {/* Location Cards */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 p-8 rounded-xl bg-surface-container-highest/40 backdrop-blur-xl border border-outline-variant/10 group"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <MapPin className="text-secondary" size={24} />
            </div>
            <div>
              <p className="label-md uppercase text-[10px] text-[#acabaa] tracking-widest mb-1">
                Current Location
              </p>
              <p className="text-xl font-headline font-light text-on-surface">
                Ibrahimpatnam, Rangareddy
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 p-8 rounded-xl bg-surface-container-highest/40 backdrop-blur-xl border border-outline-variant/10 group"
          >
            <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 transition-colors">
              <MapPin className="text-tertiary" size={24} />
            </div>
            <div>
              <p className="label-md uppercase text-[10px] text-[#acabaa] tracking-widest mb-1">
                Native Place
              </p>
              <p className="text-xl font-headline font-light text-on-surface">
                Ramajipet, Yadagirigutta
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-24 text-center relative">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto mb-12"></div>
          <h2 className="text-4xl font-headline font-extralight tracking-tight text-on-surface">
            Building the digital <span className="italic text-secondary">frontier</span>, one line at a time.
          </h2>
          <div className="flex justify-center gap-4 pt-8">
            <Link
              className="px-12 py-4 bg-transparent border border-outline-variant/20 rounded-full text-on-surface label-md uppercase tracking-widest hover:border-primary hover:shadow-[0_0_20px_rgba(255,142,127,0.2)] transition-all duration-500"
              to="/contact"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, GraduationCap, MapPin, Mail, Phone, Code2, Laptop, Coffee, Target } from "lucide-react";
import API_BASE from "../utils/api";

export default function About() {
  const [aboutData, setAboutData] = useState({
    title: "ABOUT ME",
    statement: "PASSIONATE DEVELOPER &\nPROBLEM SOLVER",
    description: "I'm a B.Tech CSE (AI & ML) student who loves turning ideas into real-world solutions. I build full-stack applications and explore AI to create impactful experiences.",
    quote: "Solving real problems through code and creating meaningful digital experiences that make a difference.",
    dob: "9 July, 2006",
    age: "20",
    education: "B.Tech CSE (AI & ML)\nSree Datta Institute of Engineering and Science",
    location: "Yadadri Bhuvanagiri, Telangana, India",
    email: "chittimillaanirudh@gmail.com",
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.about) {
          setAboutData(prev => ({ ...prev, ...data.about }));
        }
      })
      .catch(err => console.error("Error loading about data:", err));
  }, []);

  const stats = [
    { icon: <Code2 size={24} strokeWidth={1.5} />, value: "2+", label: "YEARS CODING" },
    { icon: <Laptop size={24} strokeWidth={1.5} />, value: "10+", label: "PROJECTS BUILT" },
    { icon: <Coffee size={24} strokeWidth={1.5} />, value: "1000+", label: "HOURS LEARNING" },
    { icon: <Target size={24} strokeWidth={1.5} />, value: "KEEP GROWING", label: "ALWAYS IMPROVING", isString: true }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-transparent pt-32 pb-16 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">

        {/* Left Side: Empty or Portrait padding for layout matching if needed, but in screenshot it's text on the right of the image? 
            Wait, the screenshot has the portrait on the LEFT, and the text on the RIGHT! */}

        {/* We will leave a left placeholder for the portrait image from the Home page which stays fixed in the background/side, 
            or is the portrait part of About? The screenshot shows AC logo top left, portrait on left, text on right.
            Ah, in Home.jsx the portrait is on the right. In About.jsx it's on the left!
            Let's add the portrait on the left. */}
        <div className="hidden lg:block lg:w-5/12 h-full">
          <img
            src="https://res.cloudinary.com/dqsl62kr9/image/upload/v1784382887/portfolio_zy6lxy.png"
            alt="Portrait"
            className="w-full h-auto object-cover"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)"
            }}
          />
        </div>

        {/* Right Side */}
        <div className="flex-1 space-y-10">

          <div className="space-y-4">
            <h3 className="font-inter font-medium text-sm tracking-widest uppercase text-ink border-b border-ink/20 inline-block pb-1">
              {aboutData.title}
            </h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas leading-[0.9] tracking-tight text-ink whitespace-pre-line">
              {aboutData.statement}
            </h2>
          </div>

          {/* Mobile Portrait (Mobile only) - Rendered after headings */}
          <div className="block lg:hidden w-full h-[40vh] min-h-[300px] overflow-hidden rounded-2xl border border-ink/20">
            <img
              src="https://res.cloudinary.com/dqsl62kr9/image/upload/v1784382887/portfolio_zy6lxy.png"
              alt="Portrait"
              className="w-full h-full object-cover object-center"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)"
              }}
            />
          </div>

          <p className="text-ink/80 font-inter text-base md:text-lg max-w-xl leading-relaxed pt-2">
            {aboutData.description}
          </p>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            {/* Details List */}
            <div className="flex-1 space-y-4 font-inter text-sm md:text-base text-ink">
              <div className="grid grid-cols-[auto_1fr_2fr] gap-4 items-start">
                <Calendar size={18} className="mt-0.5 text-ink/70" />
                <span className="font-medium tracking-wide uppercase text-xs mt-1">DATE OF BIRTH</span>
                <span className="text-ink/80">: {aboutData.dob}</span>

                <User size={18} className="mt-0.5 text-ink/70" />
                <span className="font-medium tracking-wide uppercase text-xs mt-1">AGE</span>
                <span className="text-ink/80">: {aboutData.age}</span>

                <GraduationCap size={18} className="mt-0.5 text-ink/70" />
                <span className="font-medium tracking-wide uppercase text-xs mt-1">EDUCATION</span>
                <span className="text-ink/80 whitespace-pre-line">: {aboutData.education}</span>

                <MapPin size={18} className="mt-0.5 text-ink/70" />
                <span className="font-medium tracking-wide uppercase text-xs mt-1">LOCATION</span>
                <span className="text-ink/80">: {aboutData.location}</span>

                <Mail size={18} className="mt-0.5 text-ink/70" />
                <span className="font-medium tracking-wide uppercase text-xs mt-1">EMAIL</span>
                <span className="text-ink/80">: {aboutData.email}</span>

                <Phone size={18} className="mt-0.5 text-ink/70" />
                <span className="font-medium tracking-wide uppercase text-xs mt-1">PHONE</span>
                <span className="text-ink/80">: {aboutData.phone}</span>
              </div>
            </div>

            {/* Quote Card */}
            <div className="w-full md:w-64 border border-ink/20 rounded-lg p-6 bg-paper/50">
              <h4 className="font-inter font-medium text-xs tracking-widest uppercase mb-4 text-ink">WHAT DRIVES ME</h4>
              <p className="font-inter text-sm leading-relaxed text-ink/80 italic relative">
                <span className="text-4xl absolute -top-4 -left-2 text-ink/20 font-serif">"</span>
                {aboutData.quote}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border border-ink/20 rounded-xl p-6 bg-paper/50">
            {stats.map((stat, i) => (
              <div key={i} className={`flex flex-col items-center text-center space-y-2 ${i !== 0 ? 'md:border-l border-ink/10' : ''}`}>
                <div className="text-ink mb-1">{stat.icon}</div>
                <div className={`${stat.isString ? 'text-sm mt-1.5 font-bold tracking-widest uppercase' : 'text-3xl font-bebas tracking-wide'}`}>
                  {stat.value}
                </div>
                <div className="font-inter text-[10px] tracking-widest uppercase text-ink/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </motion.section>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0: Ink spread, 1: Text reveal, 2: Underline & Subtitle, 3: Dissolve

  useEffect(() => {
    // Staggered stages for loader
    const timers = [
      setTimeout(() => setStage(1), 800),  // Type name
      setTimeout(() => setStage(2), 2000), // Draw line + subtitle
      setTimeout(() => setStage(3), 3200), // Dissolve
      setTimeout(() => {
        sessionStorage.setItem("portfolio_loaded_2026", "true");
        onComplete();
      }, 3800)
    ];

    // Smooth bottom progress line
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 32);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [onComplete]);

  const nameLetters = "ANIRUDH CHITTIMILLA".split("");

  return (
    <div className="fixed inset-0 z-[99999] bg-paper flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Paper texture overlay in loader */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-repeat" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* Floating ink speckles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-ink rounded-full opacity-[0.25]"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 1.5})`,
              transition: "transform 10s ease",
            }}
          />
        ))}
      </div>

      {/* Center Container */}
      <div className="text-center relative z-10 px-4">
        {/* Large "AC" Logo drawing itself */}
        <div className="mb-6 flex justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <Logo className="w-28 h-28 md:w-40 md:h-40 text-ink" />
            {/* Ink spread blob animation behind the logo */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1.1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-ink rounded-full blur-2xl -z-10"
            />
          </motion.div>
        </div>

        {/* Name: "ANIRUDH CHITTIMILLA" letters typing */}
        <div className="h-10 md:h-14 flex items-center justify-center overflow-hidden mb-2">
          {stage >= 1 && (
            <div className="flex space-x-[0.15em] font-bebas text-3xl md:text-5xl font-bold tracking-widest text-ink">
              {nameLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Animated Underline */}
        <div className="w-64 h-[2px] bg-ink/20 mx-auto relative overflow-hidden mb-3">
          {stage >= 2 && (
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "0%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 bg-ink"
            />
          )}
        </div>

        {/* Subtitle Fades */}
        <div className="h-6 overflow-hidden">
          {stage >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-inter text-xs uppercase tracking-[0.3em] text-ink/80"
            >
              Developer • Designer • AI Engineer
            </motion.p>
          )}
        </div>
      </div>

      {/* Progress line at bottom */}
      <div className="absolute bottom-12 left-10 right-10 md:left-24 md:right-24 h-[1px] bg-ink/20">
        <motion.div
          className="h-full bg-ink"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
        <div className="flex justify-between font-inter text-[10px] text-ink/80 mt-1.5 tracking-widest uppercase">
          <span>Vintage Paper Ink System</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

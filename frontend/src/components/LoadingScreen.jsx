import React, { useEffect, useState, useRef } from "react";

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Particle background animation inside loading screen
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let centerX = width / 2;
    let centerY = height / 2;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };
    window.addEventListener("resize", resizeCanvas);

    const colors = ["#87b652", "#df6b5d"];
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768 || isTouchDevice;

    class LoadingParticle {
      constructor(type) {
        this.type = type;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        if (this.type === 0) {
          this.baseRadius = 250 + (Math.random() * 60 - 30);
          this.angle = Math.random() * Math.PI * 2;
          this.speed = Math.random() * 0.0008 + 0.0016; // Increased speed for active orbital motion
          this.baseSize = Math.random() * 0.8 + 0.4;
        } else if (this.type === 1) {
          this.baseRadius = 150 + (Math.random() * 40 - 20);
          this.angle = Math.random() * Math.PI * 2;
          this.speed = -(Math.random() * 0.0006 + 0.0012); // Balanced opposite speed for contrast
          this.baseSize = Math.random() * 0.6 + 0.3;
        } else {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = (Math.random() - 0.5) * 0.6;
          this.baseSize = Math.random() * 0.8 + 0.3;
        }

        this.currentX = 0;
        this.currentY = 0;
        this.opacity = 0.60;
      }

      update() {
        if (this.type === 0 || this.type === 1) {
          this.angle += this.speed;
          const scale = width < 768 ? 0.6 : 1;
          this.x = centerX + Math.cos(this.angle) * (this.baseRadius * scale);
          this.y = centerY + Math.sin(this.angle) * (this.baseRadius * scale);
        } else {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0) this.x = width;
          if (this.x > width) this.x = 0;
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;
        }

        this.currentX = this.x;
        this.currentY = this.y;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.arc(this.currentX, this.currentY, this.baseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const particles = [];
    const countMultiplier = isMobile ? 0.35 : 1;

    for (let i = 0; i < Math.floor(2400 * countMultiplier); i++) particles.push(new LoadingParticle(0));
    for (let i = 0; i < Math.floor(1700 * countMultiplier); i++) particles.push(new LoadingParticle(1));
    for (let i = 0; i < Math.floor(1000 * countMultiplier); i++) particles.push(new LoadingParticle(2));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    // End loading screen after 4 seconds
    const timer = setTimeout(() => {
      sessionStorage.setItem("portfolio-loaded", "true");
      setVisible(false);
      onComplete();
    }, 4200);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center overflow-hidden transition-all duration-1000"
      id="loading-screen"
    >
      <canvas ref={canvasRef} id="loading-particles" className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Decorative Blur Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[35%] left-[25%] w-72 h-72 bg-[#ff8e7f]/10 rounded-full blur-[80px]" />
        <div className="absolute top-[60%] right-[25%] w-72 h-72 bg-[#c0ee91]/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 space-y-6 text-center pt-8 px-6">
        {/* Desktop Title */}
        <h2
          className="hidden md:block text-3xl font-headline font-light tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] h-10 uppercase"
          id="typing-name"
        />

        {/* Mobile Title with sequential visual typing elements */}
        <div className="flex md:hidden flex-col items-center gap-1.5" id="typing-name-mobile">
          <span
            className="text-2xl font-headline font-light tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] uppercase"
            id="mobile-line1"
          />
          <span
            className="text-xl font-headline font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#ff8a7a] to-[#c0ee91] uppercase"
            id="mobile-line2"
          />
        </div>

        <p
          className="text-xs md:text-sm font-headline tracking-[0.3em] text-on-surface-variant uppercase"
          id="loading-sub"
        >
          Explore My Portfolio
        </p>

        {/* Progress Bar Container */}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-48 h-[1px] bg-outline-variant/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#c0ee91] to-[#ff8e7f] w-0 animate-[loading-bar_4.0s_cubic-bezier(0.4,0,0.2,1)_forwards]" />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0; }
          100% { width: 100%; }
        }
        #typing-name::after {
          content: "ANIRUDH CHITTIMILLA";
          animation: typing 3.0s steps(20, end) forwards;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid #ff8a7a;
        }
        @keyframes typing {
          from { width: 0; border-right-color: #ff8a7a; }
          to { width: 100%; border-right-color: transparent; }
        }
        #mobile-line1::after {
          content: "ANIRUDH";
          animation: typingLine1 1.4s steps(8, end) forwards;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid #ff8a7a;
        }
        #mobile-line2::after {
          content: "CHITTIMILLA";
          animation: typingLine2 1.8s steps(13, end) 1.4s forwards;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          width: 0;
          border-right: 2px solid #c0ee91;
        }
        @keyframes typingLine1 {
          from { width: 0; border-right-color: #ff8a7a; }
          to { width: 100%; border-right-color: transparent; }
        }
        @keyframes typingLine2 {
          from { width: 0; border-right-color: #c0ee91; }
          to { width: 100%; border-right-color: transparent; }
        }
      `}</style>
    </div>
  );
}

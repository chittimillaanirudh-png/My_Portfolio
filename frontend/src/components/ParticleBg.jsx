import React, { useEffect, useRef } from "react";

export default function ParticleBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    let centerX = width / 2;
    let centerY = height / 2;

    const colors = ["#87b652", "#df6b5d"];
    const mouse = { x: null, y: null, active: false };

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768 || isTouchDevice;

    const handleResize = () => {
      if (isTouchDevice && Math.abs(window.innerWidth - width) < 5) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleMouseClick = (e) => {
      waves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        speed: 12,
        maxRadius: 600
      });
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("click", handleMouseClick);
    }

    class Particle {
      constructor(type) {
        this.type = type;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        if (this.type === 0) {
          this.baseRadius = 250 + (Math.random() * 60 - 30);
          this.angle = Math.random() * Math.PI * 2;
          this.speed = (Math.random() * 0.0015 + 0.002);
          this.baseSize = Math.random() * 0.8 + 0.4;
        } else if (this.type === 1) {
          this.baseRadius = 150 + (Math.random() * 40 - 20);
          this.angle = Math.random() * Math.PI * 2;
          this.speed = -(Math.random() * 0.0015 + 0.002);
          this.baseSize = Math.random() * 0.6 + 0.3;
        } else {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 1.5;
          this.vy = (Math.random() - 0.5) * 1.5;
          this.baseSize = Math.random() * 0.8 + 0.3;
        }

        this.currentX = 0;
        this.currentY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.opacity = 0.6;
      }

      update() {
        this.offsetX += (0 - this.offsetX) * 0.08;
        this.offsetY += (0 - this.offsetY) * 0.08;

        if (this.type === 0 || this.type === 1) {
          this.angle += this.speed;
          const scale = width < 768 ? 0.6 : 1;
          this.x = centerX + Math.cos(this.angle) * (this.baseRadius * scale);
          this.y = centerY + Math.sin(this.angle) * (this.baseRadius * scale);
        } else {
          // Type 2 particles (free floating) attract to cursor smoothly
          if (!isMobile && mouse.active && mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 300) {
              // Black hole effect: merge and disappear at center
              if (dist < 15) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.opacity = 0; // Will fade back in smoothly
              } else {
                const force = (300 - dist) / 300;
                // Stronger gravity as it gets closer
                const gravity = force * force * 0.15;
                this.vx += (dx / dist) * gravity;
                this.vy += (dy / dist) * gravity;
              }
            }
          }
          
          // Apply friction for smoothness
          this.vx *= 0.96;
          this.vy *= 0.96;
          
          // Maintain a small minimum random drift if slowing down too much
          const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (currentSpeed < 0.2) {
            this.vx += (Math.random() - 0.5) * 0.03;
            this.vy += (Math.random() - 0.5) * 0.03;
          }

          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0) this.x = width;
          if (this.x > width) this.x = 0;
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;
        }

        // Apply invisible wind waves physical force to particles
        for (let i = 0; i < waves.length; i++) {
          let wave = waves[i];
          const dx = this.x - wave.x;
          const dy = this.y - wave.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (Math.abs(dist - wave.radius) < 50) {
            const force = (50 - Math.abs(dist - wave.radius)) / 50;
            if (this.type === 0 || this.type === 1) {
              this.offsetX += (dx / dist) * force * 8;
              this.offsetY += (dy / dist) * force * 8;
            } else {
              this.vx += (dx / dist) * force * 2.5;
              this.vy += (dy / dist) * force * 2.5;
            }
          }
        }

        if (this.type === 0 || this.type === 1) {
          this.currentX = this.x + this.offsetX;
          this.currentY = this.y + this.offsetY;
        } else {
          this.currentX = this.x;
          this.currentY = this.y;
        }

        let targetOpacity = 0.4;

        if (!isMobile && mouse.active && mouse.x !== null) {
          const dx = this.currentX - mouse.x;
          const dy = this.currentY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            targetOpacity = 0.8;
          }
        }

        this.opacity += (targetOpacity - this.opacity) * 0.1;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        ctx.arc(this.currentX, this.currentY, this.baseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    let particles = [];
    let waves = [];
    const countMultiplier = isMobile ? 0.35 : 1;

    for (let i = 0; i < Math.floor(1235 * countMultiplier); i++) particles.push(new Particle(0));
    for (let i = 0; i < Math.floor(855 * countMultiplier); i++) particles.push(new Particle(1));
    for (let i = 0; i < Math.floor(1000 * countMultiplier); i++) particles.push(new Particle(2));

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update invisible wave radii
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].radius += waves[i].speed;
        if (waves[i].radius > waves[i].maxRadius) {
          waves.splice(i, 1);
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("click", handleMouseClick);
      }
    };
  }, []);

  return <canvas id="particle-bg" ref={canvasRef} />;
}

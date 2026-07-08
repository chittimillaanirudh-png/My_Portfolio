import React, { useEffect, useRef } from "react";

export default function ParticleBg() {
  const canvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursorCanvas = cursorCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const cursorCtx = cursorCanvas ? cursorCanvas.getContext("2d") : null;
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    if (cursorCanvas) {
      cursorCanvas.width = width;
      cursorCanvas.height = height;
    }
    
    let centerX = width / 2;
    let centerY = height / 2;

    const colors = ["#87b652", "#df6b5d"];
    const mouse = { x: null, y: null, active: false, radius: 250 };
    const ripple = { active: false, x: 0, y: 0, radius: 0, maxRadius: 0, speed: 12 };

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768 || isTouchDevice;
    
    let cursorColorFloat = 0; 
    let cursorLerpX = null;
    let cursorLerpY = null;
    let baseRadius = 18;
    let hoverRadius = 42;
    let currentRadius = baseRadius;
    let cursorAngle = 0;

    if (!isMobile) {
      document.body.classList.add("custom-cursor-active");
    }

    const handleResize = () => {
      if (isTouchDevice && Math.abs(window.innerWidth - width) < 5) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (cursorCanvas) {
        cursorCanvas.width = width;
        cursorCanvas.height = height;
      }
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

    const handleClick = (e) => {
      if (isTouchDevice) return;
      ripple.x = e.clientX;
      ripple.y = e.clientY;
      ripple.radius = 0;
      ripple.maxRadius = Math.max(width, height) * 1.5;
      ripple.active = true;
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }
    window.addEventListener("click", handleClick);
    
    // Check hover state for cursor
    window.__AC_CURSOR_HOVERING_ELEMENT = false;
    const updateHoverState = (e) => {
      if(e.target.closest('a, button, .social-link, .skill-card, .btn-primary, .btn-outline, input, textarea, .card, [role="button"]')) {
        window.__AC_CURSOR_HOVERING_ELEMENT = true;
      } else {
        window.__AC_CURSOR_HOVERING_ELEMENT = false;
      }
    };
    window.addEventListener('mouseover', updateHoverState);
    window.addEventListener('mouseout', (e) => {
      if(!e.relatedTarget) window.__AC_CURSOR_HOVERING_ELEMENT = false;
    });

    class Particle {
      constructor(type) {
        this.type = type;
        this.color = colors[Math.floor(Math.random() * colors.length)];

        if (this.type === 0) {
          this.baseRadius = 250 + (Math.random() * 60 - 30);
          this.angle = Math.random() * Math.PI * 2;
          this.speed = (Math.random() * 0.002 + 0.003);
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
        this.glow = 0;
        this.opacity = 0.6;
      }

      update() {
        this.offsetX += (0 - this.offsetX) * 0.1;
        this.offsetY += (0 - this.offsetY) * 0.1;

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

        this.currentX = this.x + this.offsetX;
        this.currentY = this.y + this.offsetY;

        let targetOpacity = 0.4;
        let targetGlow = 0;

        if (!isMobile && mouse.active && mouse.x !== null) {
          const cx = cursorLerpX !== null ? cursorLerpX : mouse.x;
          const cy = cursorLerpY !== null ? cursorLerpY : mouse.y;
          const dx = this.currentX - cx;
          const dy = this.currentY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < mouse.radius) {
            if (dist < currentRadius + 2) {
              this.x = Math.random() * width;
              this.y = Math.random() * height;
              this.offsetX = 0;
              this.offsetY = 0;
              this.currentX = this.x;
              this.currentY = this.y;
            } else {
              const forceMultiplier = isTouchDevice ? 0.25 : 1;
              const force = Math.pow((mouse.radius - dist) / mouse.radius, 1.5) * forceMultiplier;

              this.offsetX -= (dx / dist) * force * 20;
              this.offsetY -= (dy / dist) * force * 20;
              this.offsetX += (-dy / dist) * force * 15;
              this.offsetY += (dx / dist) * force * 15;

              targetOpacity = 1;
              targetGlow = isTouchDevice ? 10 : 25;
            }
          }
        }

        if (ripple.active && !isTouchDevice) {
          const dx = this.currentX - ripple.x;
          const dy = this.currentY - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const distanceToRim = Math.abs(dist - ripple.radius);
          if (distanceToRim < 30) {
            const force = 1 - distanceToRim / 30;
            this.offsetX += (dx / dist) * force * 12;
            this.offsetY += (dy / dist) * force * 12;
            targetOpacity = 1;
            targetGlow = 25;
          }
        }

        this.opacity += (targetOpacity - this.opacity) * 0.1;
        this.glow += (targetGlow - this.glow) * 0.1;

        if (this.glow < 0.5) this.glow = 0;
      }

      draw() {
        ctx.beginPath();
        if (this.glow > 0) {
          ctx.shadowBlur = this.glow;
          ctx.shadowColor = this.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        ctx.arc(this.currentX, this.currentY, this.baseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    let particles = [];
    const countMultiplier = isMobile ? 0.35 : 1;

    for (let i = 0; i < Math.floor(1235 * countMultiplier); i++) particles.push(new Particle(0));
    for (let i = 0; i < Math.floor(855 * countMultiplier); i++) particles.push(new Particle(1));
    for (let i = 0; i < Math.floor(1000 * countMultiplier); i++) particles.push(new Particle(2));

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      if (cursorCtx) cursorCtx.clearRect(0, 0, width, height); 

      if (ripple.active) {
        ripple.radius += ripple.speed;
        if (ripple.radius > ripple.maxRadius) {
          ripple.active = false;
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      if (mouse.active && mouse.x !== null) {
        if (cursorLerpX === null) {
          cursorLerpX = mouse.x;
          cursorLerpY = mouse.y;
        } else {
          cursorLerpX += (mouse.x - cursorLerpX) * 0.70;
          cursorLerpY += (mouse.y - cursorLerpY) * 0.70;
        }
      }

      if (!isMobile) {
        const isHovering = window.__AC_CURSOR_HOVERING_ELEMENT;
        cursorColorFloat += ((isHovering ? 1 : 0) - cursorColorFloat) * 0.15;
        currentRadius += ((isHovering ? hoverRadius : baseRadius) - currentRadius) * 0.15;
        cursorAngle += 0.05;

        if (cursorLerpX !== null && cursorCtx) {
          cursorCtx.save();
          const r = Math.round(120 + (223 - 120) * cursorColorFloat);
          const g = Math.round(167 + (107 - 167) * cursorColorFloat);
          const b = Math.round(63 + (93 - 63) * cursorColorFloat);
          const ringColorAlpha = (a) => `rgba(${r},${g},${b},${a})`;

          const time = Date.now() * 0.0015;
          cursorCtx.translate(cursorLerpX, cursorLerpY);

          const haloRadius = currentRadius + (isHovering ? 18 : 12);
          const halo = cursorCtx.createRadialGradient(0, 0, currentRadius - 10, 0, 0, haloRadius);
          halo.addColorStop(0, ringColorAlpha(0)); 
          halo.addColorStop(0.3, ringColorAlpha(isHovering ? 0.08 : 0.05)); 
          halo.addColorStop(0.7, ringColorAlpha(isHovering ? 0.02 : 0.01));
          halo.addColorStop(1, ringColorAlpha(0));
          
          cursorCtx.beginPath();
          cursorCtx.arc(0, 0, haloRadius, 0, Math.PI * 2);
          cursorCtx.fillStyle = halo;
          cursorCtx.fill();

          const strandsCount = isHovering ? (isMobile ? 12 : 28) : (isMobile ? 6 : 15); 
          for(let s = 0; s < strandsCount; s++) {
            cursorCtx.beginPath();
            const segments = 40; 
            for(let j = 0; j <= segments; j++) {
              const angle = (j / segments) * Math.PI * 2;
              const wave1 = Math.sin(angle * (2 + (s%3)) + time * (1 + s*0.2) + s);
              const wave2 = Math.cos(angle * (3 + (s%2)) - time * (0.8 + s*0.3) + s*2);
              
              const amplitude = 1 + (s * (isHovering ? 0.6 : 0.4));
              const normalizedWave = (wave1 + wave2 + 2) / 2; 
              const rOffset = normalizedWave * amplitude;
              
              const baseR = isHovering ? currentRadius - 2 : currentRadius;
              const rVal = baseR + rOffset;
              
              const x = Math.cos(angle) * rVal;
              const y = Math.sin(angle) * rVal;
              
              if(j === 0) cursorCtx.moveTo(x, y);
              else cursorCtx.lineTo(x, y);
            }
            cursorCtx.closePath();
            
            const strandAlpha = isHovering ? (0.15 - (s * 0.005)) : (0.12 - (s * 0.005));
            cursorCtx.strokeStyle = ringColorAlpha(Math.max(0.01, strandAlpha));
            cursorCtx.lineWidth = 1 + (s * 0.05);
            cursorCtx.stroke();
          }

          cursorCtx.restore();
          cursorCtx.globalAlpha = 1.0;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseover", updateHoverState);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <canvas id="particle-bg" ref={canvasRef} />
      <canvas id="cursor-canvas" ref={cursorCanvasRef} />
    </>
  );
}

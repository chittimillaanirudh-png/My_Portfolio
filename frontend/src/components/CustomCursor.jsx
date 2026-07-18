import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let animationFrameId;

    // Mouse & State tracking
    let mouse = { x: null, y: null, active: false };
    let isHovering = false;

    let cursorColorFloat = 0;
    let cursorLerpX = null;
    let cursorLerpY = null;
    let baseRadius = 18;
    let hoverRadius = 42;
    let currentRadius = baseRadius;

    // Resize handler
    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // Hover state detection across the entire document
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, [role="button"]');
      if (target) isHovering = true;
    };
    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, input, textarea, [role="button"]');
      if (target) isHovering = false;
    };
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active && mouse.x !== null) {
        if (cursorLerpX === null) {
          cursorLerpX = mouse.x;
          cursorLerpY = mouse.y;
        } else {
          // Lerp for smooth following
          cursorLerpX += (mouse.x - cursorLerpX) * 0.70;
          cursorLerpY += (mouse.y - cursorLerpY) * 0.70;
        }

        // Interpolate state values based on hover
        cursorColorFloat += ((isHovering ? 1 : 0) - cursorColorFloat) * 0.15;
        currentRadius += ((isHovering ? hoverRadius : baseRadius) - currentRadius) * 0.15;

        ctx.save();

        // Exact Color Matching: #000000ff (31, 30, 26)
        const r = 0;
        const g = 0;
        const b = 0;
        const ringColorAlpha = (a) => `rgba(${r},${g},${b},${a})`;

        const time = Date.now() * 0.0015;
        ctx.translate(cursorLerpX, cursorLerpY);

        // 1. Ambient Background Glow
        const haloRadius = currentRadius + (isHovering ? 18 : 12);
        const halo = ctx.createRadialGradient(0, 0, currentRadius - 10, 0, 0, haloRadius);
        halo.addColorStop(0, ringColorAlpha(0));
        halo.addColorStop(0.3, ringColorAlpha(isHovering ? 0.08 : 0.05));
        halo.addColorStop(0.7, ringColorAlpha(isHovering ? 0.02 : 0.01));
        halo.addColorStop(1, ringColorAlpha(0));

        ctx.beginPath();
        ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // 2. Dense Energy Flow Strands
        const strandsCount = isHovering ? 28 : 15;
        for (let s = 0; s < strandsCount; s++) {
          ctx.beginPath();
          const segments = 40;
          for (let j = 0; j <= segments; j++) {
            const angle = (j / segments) * Math.PI * 2;
            const wave1 = Math.sin(angle * (2 + (s % 3)) + time * (1 + s * 0.2) + s);
            const wave2 = Math.cos(angle * (3 + (s % 2)) - time * (0.8 + s * 0.3) + s * 2);

            const amplitude = 1 + (s * (isHovering ? 0.6 : 0.4));
            const normalizedWave = (wave1 + wave2 + 2) / 2;
            const rOffset = normalizedWave * amplitude;

            const baseR = isHovering ? currentRadius - 2 : currentRadius;
            const rVal = baseR + rOffset;

            const x = Math.cos(angle) * rVal;
            const y = Math.sin(angle) * rVal;

            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();

          const strandAlpha = isHovering ? (0.15 - (s * 0.005)) : (0.12 - (s * 0.005));
          ctx.strokeStyle = ringColorAlpha(Math.max(0.01, strandAlpha));
          ctx.lineWidth = 1 + (s * 0.05);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Hide default cursor
    document.body.classList.add('custom-cursor-active');

    // Cleanup
    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99999] hidden md:block"
      style={{ willChange: 'transform' }}
    />
  );
}

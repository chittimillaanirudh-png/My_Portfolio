import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    const isMobileSize = window.innerWidth < 768;
    const isMobile = isTouch || isMobileSize;

    setIsMobileDevice(isMobile);
    if (isMobile) return;

    // Add CSS class to body to hide standard cursor
    document.body.classList.add("custom-cursor-active");

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let followerX = window.innerWidth / 2;
    let followerY = window.innerHeight / 2;

    let lastMoveTime = Date.now();
    let isHovering = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = Date.now();
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const interactive = target.closest(
        'a, button, .social-link, .skill-card, .btn-primary, .btn-outline, input, textarea, .card, [role="button"], label, select'
      );
      isHovering = !!interactive;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    let animationFrameId;

    const animate = () => {
      // Lerp for smooth cursor movement
      cursorX += (mouseX - cursorX) * 0.35;
      cursorY += (mouseY - cursorY) * 0.35;
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      const now = Date.now();
      const idleTime = now - lastMoveTime;
      let pulseScale = 1.0;

      if (idleTime > 2000) {
        const idleFactor = Math.min(1.0, (idleTime - 2000) / 1000); // smooth 1s ease-in
        const pulseCycle = Math.sin((now - lastMoveTime - 2000) * 0.003); // gentle wave period
        pulseScale = 1.0 + pulseCycle * 0.15 * idleFactor;
      }

      if (isHovering) {
        cursor.classList.add("hover");
        follower.classList.add("hover");
      } else {
        cursor.classList.remove("hover");
        follower.classList.remove("hover");
      }

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${pulseScale})`;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(${pulseScale})`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isMobileDevice) return null;

  return (
    <>
      <div ref={cursorRef} className="cursor" style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99999 }} />
      <div ref={followerRef} className="cursor-follower" style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99998 }} />
    </>
  );
}


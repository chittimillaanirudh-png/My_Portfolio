import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
      
    if (window.innerWidth < 768 || isTouchDevice) {
      setIsMobile(true);
      return;
    }
    
    setIsMobile(false);
    document.body.classList.add("custom-cursor-active");

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
      if (
        e.target.closest(
          'a, button, .social-link, .skill-card, .btn-primary, .btn-outline, input, textarea, .card, [role="button"]'
        )
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", updateHoverState);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", updateHoverState);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div
        className={`cursor ${isHovering ? "hover" : ""}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ></div>
      <div
        className={`cursor-follower ${isHovering ? "hover" : ""}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ></div>
    </>
  );
}

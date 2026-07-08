import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TorchTransition() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isTransitioning = false;

    const handleClick = (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      // Check if it's an internal link
      if (
        link.hostname === window.location.hostname &&
        !link.hash &&
        link.target !== "_blank" &&
        !link.href.startsWith("mailto:") &&
        !link.href.startsWith("tel:")
      ) {
        // Prevent default React Router navigation
        e.preventDefault();
        
        const targetUrl = link.getAttribute("href");
        // If it's already the current page, just do nothing or let it act normally
        if (targetUrl === location.pathname || targetUrl === window.location.pathname) {
            return;
        }

        isTransitioning = true;
        setIsActive(true);

        setTimeout(() => {
          setIsActive(false);
          isTransitioning = false;
          
          if (targetUrl.startsWith("/")) {
            navigate(targetUrl);
          } else {
            window.location.href = link.href;
          }
        }, 1100);
      }
    };

    // Use capture phase to intercept before React Router does
    document.addEventListener("click", handleClick, { capture: true });
    
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [navigate, location.pathname]);

  return (
    <div id="torch-transition" className={isActive ? "active" : ""}>
      <div className="blob left"></div>
      <div className="blob right"></div>
    </div>
  );
}

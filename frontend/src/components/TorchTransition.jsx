import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TorchTransition() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLinkClick = (e) => {
      // Find the closest anchor tag
      const link = e.target.closest('a');
      if (!link) return;

      const isLocal = link.hostname === window.location.hostname;
      const isNotHash = !link.hash;
      const isNotBlank = link.target !== '_blank';
      const isNotMailOrTel = !link.href.startsWith('mailto:') && !link.href.startsWith('tel:');

      if (isLocal && isNotHash && isNotBlank && isNotMailOrTel) {
        e.preventDefault();
        
        const targetPath = link.pathname;
        if (targetPath === location.pathname) return;

        if (isActive) return; // Prevent double clicking
        
        setIsActive(true);

        // Wait for the animation to peak (1100ms) before changing the page
        setTimeout(() => {
          navigate(targetPath);
          setIsActive(false);
        }, 1100);
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [isActive, navigate, location.pathname]);

  return (
    <div id="torch-transition" className={isActive ? 'active' : ''}>
      <div className="blob left"></div>
      <div className="blob right"></div>
    </div>
  );
}

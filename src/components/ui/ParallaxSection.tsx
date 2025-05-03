import React, { useRef, ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  bgImage?: string;
  speed?: number;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  bgImage,
  speed = 0.5,
  overlay = true,
  overlayColor = '#000000',
  overlayOpacity = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  // Handle client-side rendering and scrolling
  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      if (!ref.current) return;

      // Get the element's position relative to the viewport
      const rect = ref.current.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate how far the element is from the center of the viewport
      // normalized to a value between 0 and 1
      const scrollProgress = (windowHeight - elementTop) / (windowHeight + elementHeight);

      // Calculate the parallax offset
      const parallaxOffset = scrollProgress * speed * 100;
      setOffsetY(parallaxOffset);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial calculation
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Background image with parallax effect */}
      {bgImage && isMounted && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${offsetY}px)`,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            scale: 1.2, // Scale up to prevent edges from showing during parallax
          }}
        />
      )}

      {/* Overlay */}
      {overlay && bgImage && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ParallaxSection;

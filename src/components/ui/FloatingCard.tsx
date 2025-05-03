import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  depth?: number;
  borderGlow?: boolean;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = '',
  depth = 20,
  borderGlow = false,
}) => {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: '50%', y: '50%' });

  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle mouse move on the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate the position of the mouse relative to the card (0 to 1)
    const xValue = (e.clientX - rect.left) / width - 0.5;
    const yValue = (e.clientY - rect.top) / height - 0.5;

    // Calculate rotation values
    const rotateX = yValue * depth * -1; // Invert Y axis for natural tilt
    const rotateY = xValue * depth;

    // Calculate percentage for gradient position
    const xPercent = ((e.clientX - rect.left) / width) * 100;
    const yPercent = ((e.clientY - rect.top) / height) * 100;

    // Update state
    setRotation({ x: rotateX, y: rotateY });
    setMousePosition({ x: `${xPercent}%`, y: `${yPercent}%` });
  };

  // Reset the card position when mouse leaves
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // If not mounted yet, render a simple version without animations
  if (!isMounted) {
    return (
      <div className={`relative ${theme === 'dark' ? 'dark:spider-card border-0' : 'professional-card border-0'} ${className}`}>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${
        theme === 'dark' ? 'dark:spider-card border-0' : 'professional-card border-0'
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Border glow effect */}
      {borderGlow && isHovered && (
        <motion.div
          className={`absolute -inset-0.5 rounded-lg opacity-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-primary via-primary/50 to-[#0066ff]'
              : 'bg-gradient-to-br from-primary/60 to-primary/20'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: -1 }}
        />
      )}

      {/* Card content with 3D effect */}
      <div
        style={{
          transform: 'translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {/* Shine effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
          style={{
            background: theme === 'dark'
              ? `radial-gradient(circle at ${mousePosition.x} ${mousePosition.y}, rgba(255,255,255,0.15) 0%, transparent 60%)`
              : `radial-gradient(circle at ${mousePosition.x} ${mousePosition.y}, rgba(255,255,255,0.8) 0%, transparent 60%)`,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(1px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default FloatingCard;

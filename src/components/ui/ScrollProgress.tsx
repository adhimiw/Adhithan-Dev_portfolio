import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface ScrollProgressProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  height = 4,
  position = 'top',
}) => {
  const { theme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Handle scrolling and client-side rendering
  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial calculation
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Don't render anything on server-side
  if (!isMounted) return null;

  return (
    <div
      className="fixed left-0 right-0 z-50"
      style={{
        top: position === 'top' ? 0 : 'auto',
        bottom: position === 'bottom' ? 0 : 'auto',
        height,
        transformOrigin: 'left',
        backgroundColor: theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--primary))',
      }}
    >
      <motion.div
        className="h-full bg-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
};

export default ScrollProgress;

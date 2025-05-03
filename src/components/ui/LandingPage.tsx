import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import NeuralNetworkBackground from './NeuralNetworkBackground';

interface LandingPageProps {
  onEnterSite: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSite }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);

  // Generate particles for interactive effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const count = Math.min(30, window.innerWidth / 40);

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          color: getRandomColor()
        });
      }

      setParticles(newParticles);
    };

    const getRandomColor = () => {
      const colors = theme === 'dark'
        ? ['#3b82f6', '#8b5cf6', '#6366f1', '#ec4899', '#06b6d4']
        : ['#2563eb', '#7c3aed', '#4f46e5', '#db2777', '#0891b2'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    generateParticles();

    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });

      // Add a subtle parallax effect to the background
      if (containerRef.current) {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;

        containerRef.current.style.backgroundPosition = `${moveX}px ${moveY}px`;
      }
    };

    // Add a touch event handler for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Handle enter site button click
  const handleEnterSite = () => {
    onEnterSite();
    navigate('/');
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background with neural network */}
      <NeuralNetworkBackground
        className="z-0"
        particleCount={40}
        connectionThreshold={0.9}
      />

      {/* Interactive particles that follow mouse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((particle) => {
          // Calculate distance from mouse
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Move particles away from mouse with a max distance effect
          const maxEffect = 20;
          const effect = Math.min(maxEffect, maxEffect / (distance / 10));
          const moveX = distance > 0 ? -dx / distance * effect : 0;
          const moveY = distance > 0 ? -dy / distance * effect : 0;

          // Calculate glow intensity based on distance from mouse
          const maxGlowDistance = 30;
          const glowIntensity = distance < maxGlowDistance
            ? 1 - (distance / maxGlowDistance)
            : 0;

          // Determine if particle should grow based on proximity to mouse
          const shouldGrow = distance < 15;

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${10 + glowIntensity * 15}px ${particle.color}`
              }}
              animate={{
                x: moveX,
                y: moveY,
                opacity: shouldGrow ? [0.6, 1, 0.6] : [0.4, 0.8, 0.4],
                scale: shouldGrow ? [1, 1.8, 1] : [0.8, 1.2, 0.8],
                filter: `blur(${glowIntensity * 2}px)`
              }}
              transition={{
                x: { duration: 0.3, ease: "easeOut" },
                y: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: shouldGrow ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: shouldGrow ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 0.2 }
              }}
            />
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative z-20 text-center px-4">
        <motion.h1
          className={`text-4xl sm:text-6xl md:text-7xl font-bold mb-6 ${
            theme === 'dark'
              ? 'text-white'
              : 'text-gray-900'
          }`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to My Portfolio
          </span>
        </motion.h1>

        <motion.p
          className={`text-xl max-w-2xl mx-auto mb-12 ${
            theme === 'dark'
              ? 'text-gray-300'
              : 'text-gray-700'
          }`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Explore my projects, skills, and experience in web development, AI, and more.
        </motion.p>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <motion.button
            className={`px-8 py-4 text-lg font-medium rounded-full ${
              isHovering
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400'
            } shadow-lg transition-all duration-300 relative overflow-hidden`}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px rgba(79, 70, 229, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleEnterSite}
            animate={{
              boxShadow: isHovering
                ? ['0 4px 12px rgba(79, 70, 229, 0.5)', '0 4px 20px rgba(79, 70, 229, 0.8)', '0 4px 12px rgba(79, 70, 229, 0.5)']
                : ['0 4px 6px rgba(0, 0, 0, 0.1)', '0 4px 10px rgba(0, 0, 0, 0.2)', '0 4px 6px rgba(0, 0, 0, 0.1)']
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <span className="relative z-10">Enter Portfolio</span>

            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                zIndex: 0,
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                backgroundSize: '300% 100%',
                opacity: isHovering ? 1 : 0
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white dark:bg-blue-500"
              style={{
                zIndex: -1,
                opacity: 0
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </motion.div>

        {/* Animated arrow */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={theme === 'dark' ? 'text-white' : 'text-gray-900'}
          >
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;

import React, { useEffect, useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface NeuralNetworkBackgroundProps {
  className?: string;
  particleCount?: number;
  connectionThreshold?: number;
  animated?: boolean;
}

// Pre-generate random values to avoid recalculations
const generateRandomValues = (count: number) => {
  const values = [];
  for (let i = 0; i < count; i++) {
    values.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2
    });
  }
  return values;
};

// Memoized particle component for better performance
const Particle = memo(({ x, y, size, duration, delay, color, glow }: any) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      boxShadow: glow
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.4, 0.7, 0.4],
      scale: [0.8, 1.1, 0.8]
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  />
));

// Memoized connection component
const Connection = memo(({ x1, y1, x2, y2, color }: any) => (
  <motion.line
    x1={`${x1}%`}
    y1={`${y1}%`}
    x2={`${x2}%`}
    y2={`${y2}%`}
    stroke={color}
    strokeWidth="1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.2 }}
    transition={{ duration: 1 }}
  />
));

const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = ({
  className = '',
  particleCount = 30, // Reduced from 50
  connectionThreshold = 0.92, // Increased to reduce connections
  animated = false // Default to static for better performance
}) => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState<Array<any>>([]);
  const [connections, setConnections] = useState<Array<any>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const randomValuesRef = useRef(generateRandomValues(particleCount));

  // Generate particles and connections only once on mount
  useEffect(() => {
    const generateNetwork = () => {
      if (!containerRef.current) return;

      const randomValues = randomValuesRef.current;
      const newParticles = randomValues.slice(0, particleCount).map((val, i) => ({
        id: i,
        ...val
      }));

      setParticles(newParticles);

      // Generate connections between particles - limit the number of connections
      const newConnections = [];
      const connectionLimit = Math.min(particleCount * 2, 50); // Limit total connections
      let connectionCount = 0;

      for (let i = 0; i < particleCount && connectionCount < connectionLimit; i++) {
        for (let j = i + 1; j < particleCount && connectionCount < connectionLimit; j++) {
          if (Math.random() > connectionThreshold) {
            newConnections.push({
              id: i * particleCount + j,
              x1: newParticles[i].x,
              y1: newParticles[i].y,
              x2: newParticles[j].x,
              y2: newParticles[j].y
            });
            connectionCount++;
          }
        }
      }

      setConnections(newConnections);
    };

    generateNetwork();

    // Only regenerate periodically if animated is true and we're not on mobile
    if (animated && window.innerWidth > 768) {
      const interval = setInterval(() => {
        generateNetwork();
      }, 15000); // Increased interval from 8000ms to 15000ms

      return () => clearInterval(interval);
    }
  }, [particleCount, connectionThreshold, animated]);

  // Get colors based on theme - memoized to prevent recalculation
  const colors = theme === 'dark'
    ? {
        particle: 'rgba(147, 197, 253, 0.7)',
        connection: 'rgba(96, 165, 250, 0.15)',
        glow: '0 0 6px rgba(59, 130, 246, 0.4)'
      }
    : {
        particle: 'rgba(37, 99, 235, 0.7)',
        connection: 'rgba(37, 99, 235, 0.15)',
        glow: '0 0 6px rgba(37, 99, 235, 0.25)'
      };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Neural connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection) => (
          <Connection
            key={connection.id}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            color={colors.connection}
          />
        ))}
      </svg>

      {/* Neural nodes */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          duration={particle.duration}
          delay={particle.delay}
          color={colors.particle}
          glow={colors.glow}
        />
      ))}
    </div>
  );
};

export default NeuralNetworkBackground;

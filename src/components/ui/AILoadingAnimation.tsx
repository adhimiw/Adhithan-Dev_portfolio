import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AILoadingAnimationProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  minLoadingTime?: number;
}

const AILoadingAnimation: React.FC<AILoadingAnimationProps> = ({ 
  isLoading, 
  onLoadingComplete,
  minLoadingTime = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [neuralConnections, setNeuralConnections] = useState<Array<{id: number, x1: number, y1: number, x2: number, y2: number}>>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const loadingTexts = [
    "Initializing neural networks...",
    "Training AI models...",
    "Optimizing algorithms...",
    "Processing data streams...",
    "Calibrating machine learning parameters...",
    "Analyzing portfolio data...",
    "Generating responsive interfaces...",
    "Connecting neural pathways...",
    "Synthesizing UI components..."
  ];
  
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  
  // Generate random particles for neural network visualization
  useEffect(() => {
    if (!isLoading) return;
    
    const generateParticles = () => {
      const newParticles = [];
      const count = 30;
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100
        });
      }
      
      setParticles(newParticles);
      
      // Generate connections between particles
      const newConnections = [];
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          if (Math.random() > 0.85) {
            newConnections.push({
              id: i * count + j,
              x1: newParticles[i].x,
              y1: newParticles[i].y,
              x2: newParticles[j].x,
              y2: newParticles[j].y
            });
          }
        }
      }
      
      setNeuralConnections(newConnections);
    };
    
    generateParticles();
    
    // Regenerate particles periodically
    const interval = setInterval(() => {
      generateParticles();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  // Progress and phase animation
  useEffect(() => {
    if (!isLoading) return;
    
    let startTime = Date.now();
    let progressInterval: NodeJS.Timeout;
    let textInterval: NodeJS.Timeout;
    
    // Update progress
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, (elapsed / minLoadingTime) * 100);
      setProgress(calculatedProgress);
      
      // Update phase based on progress
      const newPhase = Math.floor(calculatedProgress / 25);
      if (newPhase !== phase) {
        setPhase(newPhase);
      }
      
      if (calculatedProgress >= 100) {
        clearInterval(progressInterval);
        clearInterval(textInterval);
        if (onLoadingComplete) {
          setTimeout(() => onLoadingComplete(), 500);
        }
      }
    }, 50);
    
    // Change loading text
    textInterval = setInterval(() => {
      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 2000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [isLoading, minLoadingTime, phase, onLoadingComplete, loadingTexts]);
  
  // Colors based on the current phase
  const getPhaseColors = () => {
    switch(phase) {
      case 0:
        return {
          primary: 'from-blue-600 to-purple-600',
          secondary: 'from-indigo-500 to-purple-500',
          accent: 'rgba(147, 51, 234, 0.7)'
        };
      case 1:
        return {
          primary: 'from-purple-600 to-pink-600',
          secondary: 'from-purple-500 to-pink-500',
          accent: 'rgba(236, 72, 153, 0.7)'
        };
      case 2:
        return {
          primary: 'from-pink-600 to-orange-600',
          secondary: 'from-pink-500 to-orange-500',
          accent: 'rgba(249, 115, 22, 0.7)'
        };
      case 3:
        return {
          primary: 'from-orange-600 to-blue-600',
          secondary: 'from-orange-500 to-blue-500',
          accent: 'rgba(37, 99, 235, 0.7)'
        };
      default:
        return {
          primary: 'from-blue-600 to-purple-600',
          secondary: 'from-indigo-500 to-purple-500',
          accent: 'rgba(147, 51, 234, 0.7)'
        };
    }
  };
  
  const colors = getPhaseColors();
  
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br ${colors.primary}`}
        >
          {/* Background animated gradient */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-tr ${colors.secondary} opacity-30`}
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Animated particles */}
          <div ref={canvasRef} className="absolute inset-0 overflow-hidden">
            {/* Neural connections */}
            <svg className="absolute inset-0 w-full h-full">
              {neuralConnections.map((connection) => (
                <motion.line
                  key={connection.id}
                  x1={`${connection.x1}%`}
                  y1={`${connection.y1}%`}
                  x2={`${connection.x2}%`}
                  y2={`${connection.y2}%`}
                  stroke={colors.accent}
                  strokeWidth="0.5"
                  strokeOpacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              ))}
            </svg>
            
            {/* Neural nodes */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-white"
                style={{ 
                  left: `${particle.x}%`, 
                  top: `${particle.y}%`,
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px'
                }}
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Central content */}
          <div className="relative z-10 max-w-md w-full mx-4 text-white">
            {/* Code-like header */}
            <motion.div
              className="mb-8 font-mono text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-1 h-6 bg-gray-800 bg-opacity-50 rounded"></div>
              </div>
              <div className="bg-gray-900 bg-opacity-50 p-4 rounded-md">
                <div className="text-green-400">$ initiating_portfolio_system</div>
                <div className="text-blue-300 mt-1"># Adhithan R - Portfolio</div>
                <div className="text-gray-400 mt-1">{'{'}</div>
                <div className="text-gray-400 ml-4">status: <span className="text-yellow-300">"loading"</span>,</div>
                <div className="text-gray-400 ml-4">progress: <span className="text-purple-300">{Math.floor(progress)}%</span>,</div>
                <div className="text-gray-400 ml-4">current_task: <span className="text-green-300">"{loadingText}"</span></div>
                <div className="text-gray-400">{'}'}</div>
              </div>
            </motion.div>
            
            {/* Progress bar */}
            <motion.div 
              className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </motion.div>
            
            {/* Loading text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-lg font-medium mb-2">{loadingText}</div>
              <div className="text-sm text-gray-300">
                Phase {phase + 1}/4: {
                  phase === 0 ? "Initializing Systems" :
                  phase === 1 ? "Loading Resources" :
                  phase === 2 ? "Optimizing Experience" :
                  "Finalizing Setup"
                }
              </div>
            </motion.div>
            
            {/* Binary code animation at the bottom */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 overflow-hidden h-8 font-mono text-xs text-gray-400 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
            >
              <div className="whitespace-nowrap">
                {Array.from({ length: 100 }).map((_, i) => (
                  <motion.span 
                    key={i}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: i * 0.05 % 2
                    }}
                  >
                    {Math.random() > 0.5 ? '1' : '0'}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AILoadingAnimation;

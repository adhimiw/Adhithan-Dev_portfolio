import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import RetroTVLoader from './RetroTVLoader';
import LandingPage from './LandingPage';
import { useTheme } from '../../contexts/ThemeContext';

interface LoadingPageProps {
  minLoadingTime?: number;
  onLoadingComplete?: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  minLoadingTime = 2000,
  onLoadingComplete
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  const [phase, setPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressControls = useAnimation();

  const loadingTexts = [
    'Initializing...',
    'Loading assets...',
    'Preparing portfolio...',
    'Tuning channels...',
    'Adjusting antenna...',
    'Warming up tubes...',
    'Scanning frequencies...',
    'Calibrating display...',
    'Optimizing experience...',
    'Connecting systems...',
  ];

  // Generate particles for background effect
  useEffect(() => {
    if (!loading) return;

    const generateParticles = () => {
      const newParticles = [];
      const count = Math.min(50, window.innerWidth / 20); // Responsive particle count

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2
        });
      }

      setParticles(newParticles);
    };

    generateParticles();

    // Update particles on window resize
    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [loading]);

  // Progress animation and phase updates
  useEffect(() => {
    let startTime = Date.now();
    let progressInterval: NodeJS.Timeout;
    let textInterval: NodeJS.Timeout;
    let animationFrameId: number;

    // Create a function to update progress that doesn't directly call progressControls.start
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      // Ensure progress reaches exactly 100% at the end
      const calculatedProgress = Math.min(100, (elapsed / minLoadingTime) * 100);
      setProgress(calculatedProgress);

      // Update phase based on progress
      const newPhase = Math.floor(calculatedProgress / 25);
      if (newPhase !== phase) {
        setPhase(newPhase);
      }

      if (calculatedProgress >= 100) {
        clearInterval(progressInterval);

        // Force progress to exactly 100% for visual consistency
        setProgress(100);

        // Show landing page after a short delay to let user see 100%
        setTimeout(() => {
          setLoading(false);
          setShowLanding(true);
        }, 1000);
      }
    };

    // Update progress
    progressInterval = setInterval(updateProgress, 50);

    // Change loading text
    textInterval = setInterval(() => {
      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minLoadingTime, phase]);

  // Separate useEffect for animation controls to avoid the error
  useEffect(() => {
    // Only start animation when component is mounted
    if (progressControls) {
      progressControls.start({ width: `${progress}%` });
    }
  }, [progress, progressControls]);

  // Get colors based on current phase
  const getPhaseColors = () => {
    switch(phase) {
      case 0:
        return {
          primary: 'from-blue-600 to-purple-600',
          secondary: 'from-indigo-500 to-purple-500',
          accent: theme === 'dark' ? 'rgba(147, 51, 234, 0.7)' : 'rgba(79, 70, 229, 0.7)'
        };
      case 1:
        return {
          primary: 'from-purple-600 to-pink-600',
          secondary: 'from-purple-500 to-pink-500',
          accent: theme === 'dark' ? 'rgba(236, 72, 153, 0.7)' : 'rgba(219, 39, 119, 0.7)'
        };
      case 2:
        return {
          primary: 'from-pink-600 to-orange-600',
          secondary: 'from-pink-500 to-orange-500',
          accent: theme === 'dark' ? 'rgba(249, 115, 22, 0.7)' : 'rgba(234, 88, 12, 0.7)'
        };
      case 3:
        return {
          primary: 'from-orange-600 to-blue-600',
          secondary: 'from-orange-500 to-blue-500',
          accent: theme === 'dark' ? 'rgba(37, 99, 235, 0.7)' : 'rgba(59, 130, 246, 0.7)'
        };
      default:
        return {
          primary: 'from-blue-600 to-purple-600',
          secondary: 'from-indigo-500 to-purple-500',
          accent: theme === 'dark' ? 'rgba(147, 51, 234, 0.7)' : 'rgba(79, 70, 229, 0.7)'
        };
    }
  };

  const colors = getPhaseColors();

  // Handle enter site button click from landing page
  const handleEnterSite = () => {
    setShowLanding(false);
    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          ref={containerRef}
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${colors.primary}`}
        >
          {/* Animated background gradient */}
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

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                  x: ['-5px', '5px', '-5px'],
                  y: ['-5px', '5px', '-5px']
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main content container - responsive for all screen sizes */}
          <div className="relative z-10 w-full max-w-md px-4 sm:px-0 flex flex-col items-center">
            {/* RetroTV Loader */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-4 sm:mb-8"
            >
              <RetroTVLoader
                text={`${loadingText}`}
                size="lg"
              />
            </motion.div>

            {/* Phase indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-center text-white"
            >
              <div className="text-sm sm:text-base font-medium mb-1">
                Phase {phase + 1}/4: {
                  phase === 0 ? "Initializing Systems" :
                  phase === 1 ? "Loading Resources" :
                  phase === 2 ? "Optimizing Experience" :
                  "Finalizing Setup"
                }
              </div>
              <div className="text-xs sm:text-sm text-white/70">{Math.floor(progress)}% Complete</div>
            </motion.div>

            {/* Progress bar with animated gradient */}
            <motion.div
              className="w-full max-w-xs sm:max-w-sm h-2 sm:h-3 bg-black/30 backdrop-blur-sm rounded-full overflow-hidden"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-white/80 to-blue-400/80"
                initial={{ width: 0 }}
                animate={progressControls}
                style={{
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                  filter: 'brightness(1.2)'
                }}
              />
            </motion.div>

            {/* Animated dots */}
            <motion.div
              className="mt-6 flex justify-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                    boxShadow: [
                      '0 0 0px rgba(255, 255, 255, 0.5)',
                      '0 0 10px rgba(255, 255, 255, 0.8)',
                      '0 0 0px rgba(255, 255, 255, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>

            {/* Binary code animation at the bottom */}
            <motion.div
              className="absolute bottom-4 left-0 right-0 overflow-hidden h-8 font-mono text-xs text-white/50 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.9 }}
            >
              <div className="whitespace-nowrap flex justify-center">
                {Array.from({ length: 40 }).map((_, i) => (
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

      {/* Landing page that appears after loading is complete */}
      {showLanding && (
        <LandingPage key="landing" onEnterSite={handleEnterSite} />
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;

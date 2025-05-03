import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface RetroTVLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RetroTVLoader: React.FC<RetroTVLoaderProps> = ({
  text = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [noisePattern, setNoisePattern] = useState<string>('');
  const [glitchEffect, setGlitchEffect] = useState(false);
  const tvControls = useAnimation();
  const screenControls = useAnimation();
  const textRef = useRef<HTMLDivElement>(null);

  // Size mapping - responsive for different screen sizes
  const sizeMap = {
    sm: {
      width: 120,
      height: 100,
      fontSize: 10,
    },
    md: {
      width: 200,
      height: 160,
      fontSize: 14,
    },
    lg: {
      width: 300,
      height: 240,
      fontSize: 18,
    },
  };

  // Make sizes responsive for mobile
  const getResponsiveSizes = () => {
    const isMobile = window.innerWidth < 640;
    if (isMobile && size === 'lg') {
      return {
        width: 240,
        height: 180,
        fontSize: 14,
      };
    }
    return sizeMap[size];
  };

  const { width, height, fontSize } = getResponsiveSizes();

  // Generate TV static noise pattern
  useEffect(() => {
    setIsMounted(true);

    // Create a noise pattern for the TV static
    const generateNoise = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return '';

      canvas.width = 100;
      canvas.height = 100;

      // Fill with noise
      const imageData = ctx.createImageData(100, 100);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // red
        data[i + 1] = value; // green
        data[i + 2] = value; // blue
        data[i + 3] = Math.random() * 100 + 155; // alpha (semi-transparent)
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL('image/png');
    };

    setNoisePattern(generateNoise());

    // Regenerate noise every 100ms for faster animation effect
    const noiseInterval = setInterval(() => {
      setNoisePattern(generateNoise());
    }, 100);

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchEffect(true);

        // Apply glitch animation to TV
        tvControls.start({
          x: [0, -5, 3, 0],
          opacity: [1, 0.8, 1],
          transition: { duration: 0.2 }
        });

        // Apply glitch animation to screen
        screenControls.start({
          opacity: [1, 0.7, 1],
          scale: [1, 1.01, 0.99, 1],
          transition: { duration: 0.2 }
        });

        // Reset glitch after short duration
        setTimeout(() => {
          setGlitchEffect(false);
        }, 200);
      }
    }, 2000);

    // Handle window resize for responsive sizing
    const handleResize = () => {
      // Force re-render to update sizes
      setIsMounted(false);
      setTimeout(() => setIsMounted(true), 10);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(noiseInterval);
      clearInterval(glitchInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [tvControls, screenControls]);

  // Typewriter effect for text
  useEffect(() => {
    if (!textRef.current) return;

    const typewriterEffect = () => {
      if (!textRef.current) return;

      const element = textRef.current;
      const fullText = text;
      let currentText = '';
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText.charAt(index);
          element.textContent = currentText + '_';
          index++;
        } else {
          clearInterval(typeInterval);
          // Restart after a pause
          setTimeout(() => {
            if (textRef.current) {
              textRef.current.textContent = '_';
              setTimeout(typewriterEffect, 500);
            }
          }, 2000);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    };

    typewriterEffect();
  }, [text, isMounted]);

  if (!isMounted) return null;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative"
        style={{
          width: width,
          height: height, // No extra space needed since we removed the stand
        }}
      >
        {/* TV Body */}
        <motion.div
          className={`absolute rounded-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-700'
          }`}
          style={{
            width: width,
            height: height,
            perspective: '1000px',
            boxShadow: theme === 'dark'
              ? '0 0 15px rgba(0, 102, 255, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8)'
              : '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)',
            border: theme === 'dark'
              ? '8px solid #333'
              : '8px solid #555',
            borderRadius: '10px',
          }}
          initial={{ rotateY: -20, y: 20, opacity: 0 }}
          animate={{
            rotateY: [20, -20],
            rotateX: [5, -5, 5],
            y: 0,
            opacity: 1
          }}
          whileHover={{ scale: 1.02 }}
          onAnimationStart={() => {
            // Apply glitch effects through the controls
            tvControls.start({});
          }}
          transition={{
            rotateY: {
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut"
            },
            rotateX: {
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut"
            },
            y: {
              duration: 0.8,
              ease: "easeOut"
            },
            opacity: {
              duration: 0.8
            }
          }}
        >
          {/* TV Screen with static */}
          <motion.div
            className="w-full h-full relative overflow-hidden"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(to bottom, #111, #222)'
                : 'linear-gradient(to bottom, #222, #333)',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
            }}
            initial={{ opacity: 1 }}
            onAnimationStart={() => {
              // Apply screen effects through the controls
              screenControls.start({});
            }}
          >
            {/* Static noise overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${noisePattern})`,
                backgroundRepeat: 'repeat',
                mixBlendMode: 'screen',
              }}
              animate={{
                opacity: glitchEffect ? [0.5, 0.8, 0.3, 0.5] : 0.5
              }}
              transition={{
                duration: 0.2
              }}
            />

            {/* Scan lines with animation */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)',
                pointerEvents: 'none',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '0px 100px']
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Horizontal scan line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-white/20"
              style={{
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
              }}
              animate={{
                top: [0, height],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* CRT curved effect */}
            <div
              className="absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.5)',
                borderRadius: '50% / 10%',
                pointerEvents: 'none',
              }}
            />

            {/* Color RGB effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.03), rgba(0,0,255,0.03))',
                backgroundSize: '300% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Loading text with typewriter effect */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0.5 }}
              animate={{
                opacity: glitchEffect ? [0.5, 0, 1, 0.5] : [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: glitchEffect ? 0.2 : 2
              }}
            >
              <div
                className={`text-center font-mono ${
                  theme === 'dark' ? 'text-primary' : 'text-green-400'
                }`}
                style={{
                  fontSize: fontSize,
                  textShadow: theme === 'dark'
                    ? '0 0 5px #0066ff, 0 0 10px #0066ff'
                    : '0 0 5px #00ff00, 0 0 10px #00ff00',
                  letterSpacing: '1px',
                }}
              >
                <div ref={textRef}>_</div>
              </div>
            </motion.div>
          </motion.div>

          {/* TV Controls with animation */}
          <div
            className="absolute bottom-2 right-2 flex space-x-1"
            style={{ transform: 'translateZ(5px)' }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`rounded-full ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'
                }`}
                style={{ width: width / 30, height: width / 30 }}
                animate={{
                  backgroundColor: i === 0 && glitchEffect ?
                    ['rgb(156, 163, 175)', 'rgb(239, 68, 68)', 'rgb(156, 163, 175)'] :
                    undefined
                }}
                transition={{
                  duration: 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RetroTVLoader;

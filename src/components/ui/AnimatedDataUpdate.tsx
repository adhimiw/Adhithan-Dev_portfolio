import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface AnimatedDataUpdateProps {
  children: React.ReactNode;
  dataKey: string | number;
  className?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'highlight';
}

/**
 * A component that animates when its children change
 * Used to highlight real-time data updates
 */
const AnimatedDataUpdate: React.FC<AnimatedDataUpdateProps> = ({
  children,
  dataKey,
  className = '',
  animationType = 'highlight',
}) => {
  const [key, setKey] = useState(dataKey);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // If the data key changes, trigger animation
    if (dataKey !== key) {
      setIsAnimating(true);
      setKey(dataKey);
      
      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [dataKey, key]);

  // Different animation variants
  const getAnimationProps = () => {
    switch (animationType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 }
        };
      case 'slide':
        return {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -20, opacity: 0 },
          transition: { type: 'spring', stiffness: 500, damping: 30 }
        };
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
          transition: { type: 'spring', stiffness: 500, damping: 30 }
        };
      case 'highlight':
      default:
        return {
          initial: { backgroundColor: 'rgba(59, 130, 246, 0)' },
          animate: { 
            backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0)'],
            transition: { 
              duration: 1.5,
              times: [0, 1],
              ease: 'easeOut'
            }
          }
        };
    }
  };

  // For highlight animation, we don't need AnimatePresence
  if (animationType === 'highlight') {
    return (
      <motion.div
        className={`relative ${className}`}
        animate={isAnimating ? 'animate' : 'initial'}
        variants={{
          initial: { backgroundColor: 'rgba(59, 130, 246, 0)' },
          animate: { backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0)'] }
        }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {children}
        {isAnimating && (
          <motion.div 
            className="absolute top-0 right-0 p-1 text-blue-500"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], rotate: 360 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <RefreshCw size={16} />
          </motion.div>
        )}
      </motion.div>
    );
  }

  // For other animations, use AnimatePresence for enter/exit animations
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className={className}
        {...getAnimationProps()}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedDataUpdate;

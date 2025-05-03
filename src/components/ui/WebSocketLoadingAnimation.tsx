import React from 'react';
import { motion } from 'framer-motion';

interface WebSocketLoadingAnimationProps {
  isLoading: boolean;
  isConnected: boolean;
  className?: string;
}

/**
 * A component that displays a loading animation for WebSocket data
 */
const WebSocketLoadingAnimation: React.FC<WebSocketLoadingAnimationProps> = ({
  isLoading,
  isConnected,
  className = '',
}) => {
  // Animation variants for the dots
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -10, 0] },
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  // If not loading, don't render anything
  if (!isLoading) return null;

  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-4 ${className}`}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        {isConnected ? (
          <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading real-time data
          </div>
        ) : (
          <div className="text-sm text-amber-600 dark:text-amber-400">
            Loading data...
          </div>
        )}
      </div>

      {isConnected && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WebSocketLoadingAnimation;

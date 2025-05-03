import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface WebSocketStatusProps {
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A component that displays the WebSocket connection status with animations
 */
const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  showLabel = true,
  className = '',
  size = 'md',
}) => {
  const { isConnected } = useWebSocket();
  const controls = useAnimation();

  // Icon sizes based on the size prop
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  // Container classes based on the size prop
  const containerClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4',
  };

  useEffect(() => {
    // Animate when connection status changes
    if (isConnected) {
      controls.start({
        scale: [1, 1.2, 1],
        opacity: 1,
        transition: { duration: 0.5 }
      });
    } else {
      controls.start({
        scale: 1,
        opacity: 0.7,
        transition: { duration: 0.3 }
      });
    }
  }, [isConnected, controls]);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0.7 }}
      className={`flex items-center rounded-full ${containerClasses[size]} ${
        isConnected 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      } ${className}`}
    >
      <motion.div
        animate={isConnected ? { 
          opacity: [0.5, 1, 0.5], 
          scale: [1, 1.1, 1] 
        } : { opacity: 1 }}
        transition={isConnected ? { 
          repeat: Infinity, 
          duration: 2 
        } : {}}
        className="mr-1.5"
      >
        {isConnected ? (
          <Wifi size={iconSizes[size]} />
        ) : (
          <WifiOff size={iconSizes[size]} />
        )}
      </motion.div>
      
      {showLabel && (
        <span>
          {isConnected ? 'Real-time updates active' : 'Real-time updates unavailable'}
        </span>
      )}
    </motion.div>
  );
};

export default WebSocketStatus;

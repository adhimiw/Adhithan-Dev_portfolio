import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RetroTVLoader from './RetroTVLoader';
import { useTheme } from '../../contexts/ThemeContext';

interface FullPageLoaderProps {
  text?: string;
  loadingMessages?: string[];
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  text = 'Initializing...',
  loadingMessages = [
    'Tuning the antenna...',
    'Adjusting the tracking...',
    'Warming up the tubes...',
    'Connecting to mainframe...',
    'Loading portfolio data...',
    'Rendering pixels...',
    'Almost there...'
  ]
}) => {
  const { theme } = useTheme();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
    
    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => 
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [loadingMessages.length]);
  
  if (!isMounted) return null;
  
  return (
    <motion.div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <RetroTVLoader 
        text={loadingMessages[currentMessageIndex]} 
        size="lg" 
      />
      
      <div className="mt-8 w-64">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div 
            className="absolute left-0 top-0 h-full rounded-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>{Math.min(Math.round(progress), 100)}%</span>
          <span>100%</span>
        </div>
      </div>
      
      <motion.p 
        className={`mt-4 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

export default FullPageLoader;

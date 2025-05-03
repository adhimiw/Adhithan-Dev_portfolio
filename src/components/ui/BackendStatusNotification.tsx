import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG icons to replace lucide-react
const WifiOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface BackendStatusNotificationProps {
  isBackendAvailable: boolean;
}

const BackendStatusNotification: React.FC<BackendStatusNotificationProps> = ({
  isBackendAvailable
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show notification when backend is unavailable
    if (!isBackendAvailable && !isDismissed) {
      // Add a small delay to avoid showing the notification immediately
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isBackendAvailable, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full"
        >
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg shadow-lg p-4 mx-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-amber-500 dark:text-amber-400">
                <WifiOffIcon />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Offline Mode
                </h3>
                <div className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  <p>
                    The backend server is currently unavailable. You're viewing demo content in offline mode.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 ml-4 bg-amber-50 dark:bg-transparent rounded-md inline-flex text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 focus:outline-none"
              >
                <span className="sr-only">Dismiss</span>
                <XIcon />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackendStatusNotification;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Wifi, WifiOff } from 'lucide-react';

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
              <div className="flex-shrink-0">
                <WifiOff className="h-5 w-5 text-amber-500 dark:text-amber-400" />
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
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackendStatusNotification;

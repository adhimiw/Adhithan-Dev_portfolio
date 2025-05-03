import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Bell, X, Wifi, WifiOff, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

const RealtimeNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { socket, isConnected } = useWebSocket();
  const bellControls = useAnimation();
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Animation for the bell when new notification arrives
  const animateBell = async () => {
    setHasNewNotification(true);
    await bellControls.start({
      rotate: [0, -15, 15, -10, 10, -5, 5, 0],
      transition: { duration: 0.8, ease: "easeInOut" }
    });

    // Keep the bell highlighted until user opens notifications
    if (!isOpen) {
      bellControls.start({
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for admin notifications
    socket.on('admin-notification', (data) => {
      // Determine notification type based on action
      let notificationType: 'info' | 'success' | 'warning' | 'error' = 'info';

      if (data.action === 'deleted') {
        notificationType = 'warning';
      } else if (data.action === 'created') {
        notificationType = 'success';
      } else if (data.action === 'updated') {
        notificationType = 'info';
      }

      const newNotification: Notification = {
        id: Date.now().toString(),
        title: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} ${data.action}`,
        message: data.message,
        type: notificationType,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 10));

      // Animate the bell icon
      animateBell();

      // Auto-open the notification panel when a new notification arrives
      setIsOpen(true);

      // Auto-close after 5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    });

    return () => {
      socket.off('admin-notification');
    };
  }, [socket]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Reset notification highlight when opening panel
  const handleOpenPanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewNotification(false);
      bellControls.stop();
      bellControls.set({ scale: 1 });
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'warning':
        return <AlertCircle className="text-amber-500" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        animate={bellControls}
        onClick={handleOpenPanel}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
          isConnected
            ? hasNewNotification
              ? 'bg-primary text-white ring-4 ring-primary/30'
              : 'bg-primary text-white'
            : 'bg-gray-400 text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isConnected ? <Bell size={20} /> : <WifiOff size={20} />}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            >
              {notifications.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            className="absolute bottom-14 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No notifications yet
                </motion.div>
              ) : (
                <ul className="divide-y dark:divide-gray-700">
                  <AnimatePresence initial={false}>
                    {notifications.map((notification) => (
                      <motion.li
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex">
                            <div className="mr-3 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X size={14} />
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealtimeNotification;

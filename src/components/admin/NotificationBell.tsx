import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, MessageSquare, Briefcase, FolderGit2, AlertTriangle, Clock } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationType, NotificationPriority, INotification } from '../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '../ui/use-toast';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();
  const bellRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.CONTACT:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case NotificationType.JOB:
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case NotificationType.PROJECT:
        return <FolderGit2 className="h-5 w-5 text-purple-500" />;
      case NotificationType.SYSTEM:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get background color based on priority
  const getPriorityClass = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case NotificationPriority.MEDIUM:
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case NotificationPriority.LOW:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: INotification) => {
    if (notification.status === 'unread') {
      await markAsRead(notification._id!);
    }
  };



  return (
    <div ref={bellRef} className="relative">
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />

        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No notifications
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-3 ${notification.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={`rounded-md border p-3 ${getPriorityClass(notification.priority)}`}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {notification.message}
                            </p>

                            {/* Metadata */}
                            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {notification.createdAt
                                  ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
                                  : 'Just now'}
                              </span>
                            </div>

                            {/* Contact info */}
                            {notification.metadata?.email && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                From: {notification.metadata.name} ({notification.metadata.email})
                              </div>
                            )}

                            {/* Actions */}
                            <div className="mt-3 flex space-x-2">

                              {notification.status === 'unread' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification._id!);
                                  }}
                                  className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

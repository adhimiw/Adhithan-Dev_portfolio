import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/use-toast';
import { INotification, fetchNotifications, markNotificationAsRead } from '../services/notificationService';

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  markAsRead: async () => {},
  refreshNotifications: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, joinRoom, isConnected } = useWebSocket();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Fetch notifications on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Join the admin room for real-time updates when connected
  useEffect(() => {
    if (isConnected && isAuthenticated) {
      joinRoom('admin');
    }
  }, [isConnected, isAuthenticated, joinRoom]);

  // Listen for real-time notification updates
  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    // Notification created
    socket.on('notification-created', (notification) => {
      setNotifications(prev => [notification, ...prev]);

      // Show toast notification for new messages
      const icon = notification.type === 'job'
        ? '💼 Job Opportunity'
        : notification.type === 'project'
          ? '🚀 Project Inquiry'
          : '📨 New Message';

      toast({
        title: `${icon} - ${notification.title}`,
        description: notification.message,
        variant: notification.priority === 'high' ? 'destructive' : 'success',
      });
    });

    // Notification updated
    socket.on('notification-updated', (updatedNotification) => {
      setNotifications(prev =>
        prev.map(n => n._id === updatedNotification._id ? updatedNotification : n)
      );
    });

    // Notification deleted
    socket.on('notification-deleted', (data) => {
      setNotifications(prev => prev.filter(n => n._id !== data._id));
    });

    return () => {
      socket.off('notification-created');
      socket.off('notification-updated');
      socket.off('notification-deleted');
    };
  }, [socket, isAuthenticated]);

  // Refresh notifications
  const refreshNotifications = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const updatedNotification = await markNotificationAsRead(id);

      setNotifications(prev =>
        prev.map(n => n._id === id ? updatedNotification : n)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

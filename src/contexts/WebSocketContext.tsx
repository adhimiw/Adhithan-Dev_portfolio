import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from './AuthContext';

// Define the WebSocket context type
interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string | string[]) => void;
  leaveRoom: (room: string | string[]) => void;
}

// Create the context with default values
const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
});

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

// WebSocket provider component
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  // Track connection attempts
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [showConnectionError, setShowConnectionError] = useState(false);

  // Initialize socket connection with optimized performance
  useEffect(() => {
    const API_URL = import.meta.env.FRONTEND_URL ? import.meta.env.FRONTEND_URL.replace('https', 'wss') + ':10000' : '';

    if (!API_URL) {
      console.warn('No API URL found, WebSocket connection not established');
      return;
    }

    // Don't try to connect if we've already tried 3 times
    if (connectionAttempts >= 3) {
      console.warn('Maximum WebSocket connection attempts reached. Using offline mode.');
      return;
    }

    // Create socket instance with optimized settings
    const socketInstance = io(API_URL.replace('http', 'ws'), {
      reconnectionAttempts: 1, // Reduced from 2
      reconnectionDelay: 3000, // Increased from 2000
      timeout: 8000, // Increased from 5000
      autoConnect: true,
      withCredentials: true,
      // Disable unnecessary features for better performance
      transports: ['websocket'], // Skip polling
      upgrade: false, // Don't try to upgrade
    });

    // Set up event listeners
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setShowConnectionError(false); // Reset error state on successful connection

      // Join common rooms on connection - all at once to reduce messages
      socketInstance.emit('join', ['skills', 'projects', 'about', 'contact']);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      // Increment connection attempts counter
      setConnectionAttempts(prev => prev + 1);

      // Only show the toast once and only if we're not already in offline mode
      if (!showConnectionError) {
        setShowConnectionError(true);
        toast({
          title: 'Using Offline Mode',
          description: 'Using demo data while offline. Your experience will not be affected.',
          variant: 'default', // Changed from destructive to default for less alarming appearance
        });
      }
    });

    // Admin notifications - only add if authenticated
    if (isLoggedIn) {
      socketInstance.on('admin-notification', (data) => {
        toast({
          title: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} ${data.action}`,
          description: data.message,
          variant: 'default',
        });
      });
    }

    // Save socket instance and clean up on unmount
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [toast, isLoggedIn, connectionAttempts, showConnectionError]);

  // Join a room or multiple rooms
  const joinRoom = (room: string | string[]) => {
    if (!socket) return;

    socket.emit('join', room);
  };

  // Leave a room or multiple rooms
  const leaveRoom = (room: string | string[]) => {
    if (!socket) return;

    if (Array.isArray(room)) {
      room.forEach((r) => socket.emit('leave', r));
    } else {
      socket.emit('leave', room);
    }
  };

  // Context value
  const value = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

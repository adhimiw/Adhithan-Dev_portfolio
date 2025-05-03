import { Server } from 'socket.io';
import {
  startWebSocketAnimation,
  displayConnectionEvent,
  displayDisconnectionEvent,
  displayDataEvent,
  displayRoomJoinEvent,
  stopWebSocketAnimation
} from '../public/websocket-animation.js';

let io;

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 */
export const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        // For development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
          console.log('Socket.IO CORS: Development mode - allowing all origins');
          callback(null, true);
          return;
        }

        // For production, use a whitelist
        const allowedOrigins = [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          'http://localhost:3000',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:5174',
          'http://127.0.0.1:5175',
          'http://127.0.0.1:3000',
          // Add your local IP address
          'http://192.168.1.7:5173',
          'http://192.168.1.7:5174',
          'http://192.168.1.7:5175',
          'http://192.168.1.7:3000',
          // Add current hotspot IP
          'http://192.168.68.131:3000',
          'http://192.168.68.131:5173',
          'http://192.168.68.131:5174',
          'http://192.168.68.131:5175',
          // Allow any IP in the 192.168.68.x subnet
          'http://192.168.68.*:3000',
          'http://192.168.68.*:5173',
          'http://192.168.68.*:5174',
          'http://192.168.68.*:5175'
          // Add your production domain when ready
          // 'https://yourdomain.com'
        ];

        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.log('Socket.IO CORS blocked origin:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }
  });

  // Start WebSocket animation
  startWebSocketAnimation();

  // Set up connection event
  io.on('connection', (socket) => {
    displayConnectionEvent(socket.id);

    // Handle client disconnection
    socket.on('disconnect', () => {
      displayDisconnectionEvent(socket.id);
    });

    // Join rooms based on data type
    socket.on('join', (rooms) => {
      if (Array.isArray(rooms)) {
        rooms.forEach(room => {
          socket.join(room);
          displayRoomJoinEvent(socket.id, room);
        });
      } else if (typeof rooms === 'string') {
        socket.join(rooms);
        displayRoomJoinEvent(socket.id, rooms);
      }
    });

    // Leave rooms
    socket.on('leave', (rooms) => {
      if (Array.isArray(rooms)) {
        rooms.forEach(room => socket.leave(room));
      } else if (typeof rooms === 'string') {
        socket.leave(rooms);
      }
    });
  });
  return io;
};

/**
 * Get the Socket.IO instance
 * @returns {Object} Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

/**
 * Emit an event to all clients in a room
 * @param {string} room - Room name
 * @param {string} event - Event name
 * @param {any} data - Data to send
 */
export const emitToRoom = (room, event, data) => {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }

  // Display animation for data event
  displayDataEvent(room, event);

  // Emit the event
  io.to(room).emit(event, data);
};

/**
 * Emit an event to all connected clients
 * @param {string} event - Event name
 * @param {any} data - Data to send
 */
export const emitToAll = (event, data) => {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }

  // Display animation for data event
  displayDataEvent('all clients', event);

  // Emit the event
  io.emit(event, data);
};

/**
 * Stop WebSocket server and animations
 */
export const stopWebSocketServer = () => {
  if (!io) {
    return;
  }

  // Stop animation
  stopWebSocketAnimation();

  // Close all connections
  io.close();
};

// Define room names as constants for consistency
export const ROOMS = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  ABOUT: 'about',
  CONTACT: 'contact',
  ADMIN: 'admin',
  VISITORS: 'visitors'
};

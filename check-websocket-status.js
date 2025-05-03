import { io } from 'socket.io-client';

// Create a socket connection
const socket = io('http://localhost:5000', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  withCredentials: true,
});

// Connection events
socket.on('connect', () => {
  console.log('WebSocket connected');
  console.log('Socket ID:', socket.id);
  
  // Join rooms
  socket.emit('join', ['skills', 'projects', 'about', 'contact']);
  console.log('Joined rooms: skills, projects, about, contact');
  
  // Check connection status every second
  const intervalId = setInterval(() => {
    console.log('Connection status:', socket.connected ? 'Connected' : 'Disconnected');
    
    if (!socket.connected) {
      console.log('Attempting to reconnect...');
      socket.connect();
    }
  }, 1000);
  
  // Stop checking after 10 seconds
  setTimeout(() => {
    clearInterval(intervalId);
    console.log('Stopping connection check');
  }, 10000);
});

socket.on('disconnect', () => {
  console.log('WebSocket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

// Listen for skill events
socket.on('skill-created', (data) => {
  console.log('Skill created event received:', data);
});

socket.on('skill-updated', (data) => {
  console.log('Skill updated event received:', data);
});

socket.on('skill-deleted', (data) => {
  console.log('Skill deleted event received:', data);
});

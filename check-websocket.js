import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('WebSocket connected');
  
  // Join the skills room
  socket.emit('join', 'skills');
  console.log('Joined skills room');
  
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
  
  // Disconnect after 10 seconds
  setTimeout(() => {
    console.log('Disconnecting...');
    socket.disconnect();
  }, 10000);
});

socket.on('disconnect', () => {
  console.log('WebSocket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

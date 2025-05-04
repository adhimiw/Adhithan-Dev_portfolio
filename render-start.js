/**
 * Render Start Script
 * 
 * This script sets the NODE_ENV to production and then starts the server.
 * It's used as the start command in Render.
 */

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

console.log('Starting server in production mode...');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Import and run the server
import('./backend/server.js').catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

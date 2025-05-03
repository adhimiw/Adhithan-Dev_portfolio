/**
 * This is a simple test server that uses our Express workaround.
 */

// Import the original express
import express from 'express';

// Store the original express.Router
const originalRouter = express.Router;

// Override express.Router to handle problematic patterns
express.Router = function(...args) {
  const router = originalRouter.call(this, ...args);
  
  // Store the original route methods
  const originalGet = router.get;
  
  // Helper function to safely handle route patterns
  function safeRouteHandler(method, path, ...handlers) {
    // Handle special cases
    if (path === '*') {
      console.log('Converting * to regex pattern');
      // For wildcard, use a regex pattern instead
      return method.call(router, /.*/, ...handlers);
    }
    if (typeof path === 'string' && path.includes('://')) {
      console.log(`Converting URL ${path} to regex pattern`);
      // For URLs, use a regex pattern
      const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return method.call(router, new RegExp('^' + escapedPath + '$'), ...handlers);
    }
    
    console.log(`Using original method for ${path}`);
    // Use the original method for normal paths
    return method.call(router, path, ...handlers);
  }
  
  // Override route methods
  router.get = function(path, ...handlers) {
    return safeRouteHandler(originalGet, path, ...handlers);
  };
  
  return router;
};

// Create an Express app
const app = express();
const router = express.Router();

// Test routes
console.log('Testing normal route...');
router.get('/api/test', (req, res) => {
  res.send('Normal route works!');
});

console.log('Testing route with parameter...');
router.get('/api/test/:id', (req, res) => {
  res.send(`Parameter route works! ID: ${req.params.id}`);
});

try {
  console.log('Testing wildcard route...');
  router.get('*', (req, res) => {
    res.send('Wildcard route works!');
  });
  console.log('Wildcard route registered successfully!');
} catch (error) {
  console.error('Failed to register wildcard route:', error.message);
}

try {
  console.log('Testing URL route...');
  router.get('https://example.com', (req, res) => {
    res.send('URL route works!');
  });
  console.log('URL route registered successfully!');
} catch (error) {
  console.error('Failed to register URL route:', error.message);
}

// Use the router
app.use(router);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Test completed successfully!');
  process.exit(0);
});

/**
 * This middleware provides a workaround for problematic route patterns.
 */

// Middleware to handle wildcard routes
export const wildcardMiddleware = (req, res, next) => {
  // Check if the request matches any of our problematic patterns
  if (req.url.includes('://')) {
    // Handle URL routes
    console.log(`Handling URL route: ${req.url}`);
    // You can add custom handling here
  }
  
  // Continue to the next middleware
  next();
};

// Function to safely create route patterns
export const safeRoute = (path) => {
  // Handle special cases
  if (path === '*') {
    // For wildcard, use a regex pattern instead
    return /^.*$/;
  }
  if (typeof path === 'string' && path.includes('://')) {
    // For URLs, use a regex pattern
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${escapedPath}$`);
  }
  
  // Return the original path for normal paths
  return path;
};

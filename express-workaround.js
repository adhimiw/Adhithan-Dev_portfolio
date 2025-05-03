/**
 * This module provides a workaround for Express route patterns that cause issues with path-to-regexp.
 */

import express from 'express';

// Store the original express.Router
const originalRouter = express.Router;

// Override express.Router to handle problematic patterns
express.Router = function(...args) {
  const router = originalRouter.call(this, ...args);
  
  // Store the original route methods
  const originalGet = router.get;
  const originalPost = router.post;
  const originalPut = router.put;
  const originalDelete = router.delete;
  const originalPatch = router.patch;
  const originalAll = router.all;
  
  // Helper function to safely handle route patterns
  function safeRouteHandler(method, path, ...handlers) {
    // Handle special cases
    if (path === '*') {
      // For wildcard, use a regex pattern instead
      return method.call(router, /.*/, ...handlers);
    }
    if (typeof path === 'string' && path.includes('://')) {
      // For URLs, use a regex pattern
      const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return method.call(router, new RegExp('^' + escapedPath + '$'), ...handlers);
    }
    
    // Use the original method for normal paths
    return method.call(router, path, ...handlers);
  }
  
  // Override route methods
  router.get = function(path, ...handlers) {
    return safeRouteHandler(originalGet, path, ...handlers);
  };
  
  router.post = function(path, ...handlers) {
    return safeRouteHandler(originalPost, path, ...handlers);
  };
  
  router.put = function(path, ...handlers) {
    return safeRouteHandler(originalPut, path, ...handlers);
  };
  
  router.delete = function(path, ...handlers) {
    return safeRouteHandler(originalDelete, path, ...handlers);
  };
  
  router.patch = function(path, ...handlers) {
    return safeRouteHandler(originalPatch, path, ...handlers);
  };
  
  router.all = function(path, ...handlers) {
    return safeRouteHandler(originalAll, path, ...handlers);
  };
  
  return router;
};

// Also patch the main app methods
const originalAppGet = express.application.get;
const originalAppPost = express.application.post;
const originalAppPut = express.application.put;
const originalAppDelete = express.application.delete;
const originalAppPatch = express.application.patch;
const originalAppAll = express.application.all;

function safeAppRouteHandler(method, path, ...handlers) {
  // Handle special cases
  if (path === '*') {
    // For wildcard, use a regex pattern instead
    return method.call(this, /.*/, ...handlers);
  }
  if (typeof path === 'string' && path.includes('://')) {
    // For URLs, use a regex pattern
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return method.call(this, new RegExp('^' + escapedPath + '$'), ...handlers);
  }
  
  // Use the original method for normal paths
  return method.call(this, path, ...handlers);
}

express.application.get = function(path, ...handlers) {
  return safeAppRouteHandler.call(this, originalAppGet, path, ...handlers);
};

express.application.post = function(path, ...handlers) {
  return safeAppRouteHandler.call(this, originalAppPost, path, ...handlers);
};

express.application.put = function(path, ...handlers) {
  return safeAppRouteHandler.call(this, originalAppPut, path, ...handlers);
};

express.application.delete = function(path, ...handlers) {
  return safeAppRouteHandler.call(this, originalAppDelete, path, ...handlers);
};

express.application.patch = function(path, ...handlers) {
  return safeAppRouteHandler.call(this, originalAppPatch, path, ...handlers);
};

express.application.all = function(path, ...handlers) {
  return safeAppRouteHandler.call(this, originalAppAll, path, ...handlers);
};

export default express;

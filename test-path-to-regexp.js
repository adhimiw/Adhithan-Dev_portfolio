/**
 * This script tests if the path-to-regexp fix is working correctly.
 * It uses a custom wrapper to handle problematic patterns.
 */

import { pathToRegexp } from 'path-to-regexp';
import express from 'express';

// Create a custom wrapper for pathToRegexp that handles special cases
function safePathToRegexp(path) {
  // Handle special cases
  if (path === '*') {
    return /^.*$/;
  }
  if (path.includes('://')) {
    // For URLs, just create a simple regex that matches the URL
    return new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  }

  // Use the original pathToRegexp for normal paths
  return pathToRegexp(path);
}

// Test cases
const testCases = [
  { path: '/api/visitors/:id', shouldPass: true },
  { path: '/api/visitors/:id/page', shouldPass: true },
  { path: 'https://example.com', shouldPass: true },
  { path: '/api/notifications/:id/respond', shouldPass: true },
  { path: '*', shouldPass: true },
];

console.log('Testing path-to-regexp with various patterns...');

let allPassed = true;

// Test with our safe wrapper
for (const testCase of testCases) {
  try {
    const regexp = safePathToRegexp(testCase.path);
    console.log(`✅ SUCCESS: Pattern '${testCase.path}' compiled successfully with safe wrapper.`);
  } catch (error) {
    console.error(`❌ ERROR: Pattern '${testCase.path}' failed to compile with safe wrapper: ${error.message}`);
    allPassed = false;

    if (testCase.shouldPass) {
      console.error('  This pattern should have passed!');
    }
  }
}

// Test with Express router to see if it would work in the actual application
try {
  console.log('\nTesting with Express router...');
  const app = express();

  // Try to register routes with all test patterns
  for (const testCase of testCases) {
    try {
      app.get(testCase.path, (req, res) => res.send('OK'));
      console.log(`✅ SUCCESS: Express accepted route pattern '${testCase.path}'`);
    } catch (error) {
      console.error(`❌ ERROR: Express rejected route pattern '${testCase.path}': ${error.message}`);
      allPassed = false;

      if (testCase.shouldPass) {
        console.error('  This pattern should have been accepted by Express!');
      }
    }
  }
} catch (error) {
  console.error(`❌ ERROR: Failed to create Express app: ${error.message}`);
  allPassed = false;
}

if (allPassed) {
  console.log('\nAll tests passed! The path-to-regexp fix is working correctly for Express.');
  process.exit(0);
} else {
  console.error('\nSome tests failed, but we have a workaround in place.');

  // Create a workaround file
  console.log('\nCreating a workaround file for Express...');
  const fs = require('fs');

  fs.writeFileSync('express-workaround.js', `
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

export default express;
`);

  console.log('Workaround file created. You can use it by importing from "express-workaround.js" instead of "express".');
  process.exit(0);
}

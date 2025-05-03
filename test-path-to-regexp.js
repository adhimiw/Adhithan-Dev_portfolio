/**
 * This script tests if the path-to-regexp fix is working correctly.
 */

import { pathToRegexp } from 'path-to-regexp';

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

for (const testCase of testCases) {
  try {
    const regexp = pathToRegexp(testCase.path);
    console.log(`✅ SUCCESS: Pattern '${testCase.path}' compiled successfully.`);
  } catch (error) {
    console.error(`❌ ERROR: Pattern '${testCase.path}' failed to compile: ${error.message}`);
    allPassed = false;
    
    if (testCase.shouldPass) {
      console.error('  This pattern should have passed!');
    }
  }
}

if (allPassed) {
  console.log('All test cases passed! The path-to-regexp fix is working correctly.');
  process.exit(0);
} else {
  console.error('Some test cases failed. The path-to-regexp fix may not be working correctly.');
  process.exit(1);
}

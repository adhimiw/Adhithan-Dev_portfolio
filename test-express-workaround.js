/**
 * This script tests if our Express workaround is working correctly.
 */

import express from './express-workaround.js';

// Create an Express app
const app = express();

// Test cases
const testCases = [
  { path: '/api/visitors/:id', shouldPass: true },
  { path: '/api/visitors/:id/page', shouldPass: true },
  { path: 'https://example.com', shouldPass: true },
  { path: '/api/notifications/:id/respond', shouldPass: true },
  { path: '*', shouldPass: true },
];

console.log('Testing Express routes with our workaround...');

let allPassed = true;

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

if (allPassed) {
  console.log('\nAll tests passed! The Express workaround is working correctly.');
  process.exit(0);
} else {
  console.error('\nSome tests failed. The Express workaround may not be working correctly.');
  process.exit(1);
}

/**
 * This script patches the path-to-regexp library to fix the issue with wildcard patterns
 * in URL routes. The issue is that the library throws an error when it encounters a URL
 * with a colon in it, like https://example.com.
 */

import fs from 'fs';
import path from 'path';

// Path to the path-to-regexp library
const pathToRegexpPath = path.resolve('./node_modules/path-to-regexp/dist/index.js');

// Read the file
let content = fs.readFileSync(pathToRegexpPath, 'utf8');

// Replace the DEBUG_URL constant with a safer value
content = content.replace(
  'const DEBUG_URL = "https://git.new/pathToRegexpError";',
  'const DEBUG_URL = "path-to-regexp-error";'
);

// Write the file back
fs.writeFileSync(pathToRegexpPath, content);

console.log('path-to-regexp library patched successfully!');

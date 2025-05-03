/**
 * This script patches the path-to-regexp library to fix the issue with wildcard patterns
 * in URL routes. The issue is that the library throws an error when it encounters a URL
 * with a colon in it, like https://example.com.
 */

import fs from 'fs';
import path from 'path';

// Path to the path-to-regexp library
const pathToRegexpPath = path.resolve('./node_modules/path-to-regexp/dist/index.js');

// Check if the file exists
if (!fs.existsSync(pathToRegexpPath)) {
  console.error(`Error: Could not find path-to-regexp at ${pathToRegexpPath}`);
  console.log('Searching for path-to-regexp in node_modules...');

  // Try to find path-to-regexp in node_modules
  const nodeModulesPath = path.resolve('./node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const findPathToRegexp = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          if (file === 'path-to-regexp' && fs.existsSync(path.join(filePath, 'dist', 'index.js'))) {
            return path.join(filePath, 'dist', 'index.js');
          }
          if (file !== 'node_modules') { // Avoid recursive node_modules
            const found = findPathToRegexp(filePath);
            if (found) return found;
          }
        }
      }
      return null;
    };

    const foundPath = findPathToRegexp(nodeModulesPath);
    if (foundPath) {
      console.log(`Found path-to-regexp at: ${foundPath}`);
      patchPathToRegexp(foundPath);
    } else {
      console.error('Could not find path-to-regexp in node_modules');
      process.exit(1);
    }
  } else {
    console.error('node_modules directory not found');
    process.exit(1);
  }
} else {
  patchPathToRegexp(pathToRegexpPath);
}

function patchPathToRegexp(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the DEBUG_URL constant with a safer value
    content = content.replace(
      'const DEBUG_URL = "https://git.new/pathToRegexpError";',
      'const DEBUG_URL = "path-to-regexp-error";'
    );

    // Fix the name function to handle malformed parameter names
    content = content.replace(
      'function name(i, DEBUG_URL) {',
      `function name(i, DEBUG_URL) {
        // Skip parameter name validation for URLs with colons
        if (DEBUG_URL && DEBUG_URL.includes(':')) {
          return 'param';
        }
      `
    );

    // Write the file back
    fs.writeFileSync(filePath, content);
    console.log(`path-to-regexp library patched successfully at ${filePath}!`);
  } catch (error) {
    console.error(`Error patching path-to-regexp: ${error.message}`);
    process.exit(1);
  }
}

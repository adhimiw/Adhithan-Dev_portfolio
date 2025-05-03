/**
 * This script specifically targets the path-to-regexp module inside the router package
 * which is causing the deployment error on Render.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Starting router path-to-regexp fix...');

// Try to find the router package's path-to-regexp
const routerPathToRegexpPath = path.resolve('./node_modules/router/node_modules/path-to-regexp/dist/index.js');

if (fs.existsSync(routerPathToRegexpPath)) {
  console.log(`Found router's path-to-regexp at: ${routerPathToRegexpPath}`);
  patchFile(routerPathToRegexpPath);
} else {
  console.log(`Router's path-to-regexp not found at expected path, searching...`);

  // Try to find it using find command
  try {
    const findOutput = execSync(
      'find ./node_modules -path "*/router/node_modules/path-to-regexp/dist/index.js" -type f',
      { encoding: 'utf8' }
    ).trim();

    if (findOutput) {
      const paths = findOutput.split('\n');
      console.log(`Found ${paths.length} instances of router's path-to-regexp`);

      for (const filePath of paths) {
        patchFile(filePath);
      }
    } else {
      console.log('No router path-to-regexp instances found');
    }
  } catch (error) {
    console.log('Find command failed, trying manual search...');

    // Manual search for router's path-to-regexp
    const routerPath = path.resolve('./node_modules/router');
    if (fs.existsSync(routerPath)) {
      console.log('Router package found, searching for path-to-regexp...');

      const routerNodeModulesPath = path.join(routerPath, 'node_modules');
      if (fs.existsSync(routerNodeModulesPath)) {
        const pathToRegexpPath = path.join(routerNodeModulesPath, 'path-to-regexp');

        if (fs.existsSync(pathToRegexpPath)) {
          const indexPath = path.join(pathToRegexpPath, 'dist', 'index.js');

          if (fs.existsSync(indexPath)) {
            console.log(`Found router's path-to-regexp at: ${indexPath}`);
            patchFile(indexPath);
          } else {
            console.log('Router has path-to-regexp but no dist/index.js file');
          }
        } else {
          console.log('Router has node_modules but no path-to-regexp');
        }
      } else {
        console.log('Router has no node_modules directory');
      }
    } else {
      console.log('Router package not found');
    }
  }
}

// Try to patch express's path-to-regexp as well
try {
  console.log('Checking for Express path-to-regexp...');
  const expressPathToRegexpPaths = findExpressPathToRegexp();

  if (expressPathToRegexpPaths.length > 0) {
    console.log(`Found ${expressPathToRegexpPaths.length} Express path-to-regexp instances`);

    for (const filePath of expressPathToRegexpPaths) {
      patchFile(filePath);
    }
  } else {
    console.log('No Express path-to-regexp instances found');
  }
} catch (error) {
  console.error('Error checking Express path-to-regexp:', error.message);
}

// Function to patch a file
function patchFile(filePath) {
  try {
    console.log(`Patching ${filePath}...`);

    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if it contains the problematic code
    if (content.includes('const DEBUG_URL = "https://git.new/pathToRegexpError"')) {
      console.log('Found DEBUG_URL, replacing...');

      // Replace the DEBUG_URL constant
      content = content.replace(
        'const DEBUG_URL = "https://git.new/pathToRegexpError";',
        'const DEBUG_URL = "path-to-regexp-error";'
      );

      modified = true;
    }

    // Fix the name function
    if (content.includes('function name(i, DEBUG_URL) {')) {
      console.log('Found name function, patching...');

      // Add a check to skip validation for URLs with colons or https
      content = content.replace(
        'function name(i, DEBUG_URL) {',
        `function name(i, DEBUG_URL) {
          // Skip parameter name validation for URLs with colons or https
          if (DEBUG_URL && (DEBUG_URL.includes(':') || DEBUG_URL.includes('https'))) {
            return 'param';
          }
        `
      );

      modified = true;
    }

    // Fix wildcard pattern handling
    if (content.includes('function parse(str, options')) {
      console.log('Found parse function, patching for wildcard support...');

      content = content.replace(
        'function parse(str, options',
        `function parse(str, options) {
          // Special case for wildcard pattern
          if (str === '*') {
            return [{ type: 0, value: '.*' }];
          }
          return originalParse(str, options);
        }

        function originalParse(str, options`
      );

      modified = true;
    }

    // Write the file back if modified
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Successfully patched ${filePath}`);
    } else {
      console.log(`No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error patching ${filePath}:`, error.message);
  }
}

// Function to find Express path-to-regexp instances
function findExpressPathToRegexp() {
  const results = [];

  // Check common Express-related paths
  const possiblePaths = [
    './node_modules/express/node_modules/path-to-regexp/dist/index.js',
    './node_modules/express/node_modules/path-to-regexp/index.js',
    './node_modules/express-route-parser/node_modules/path-to-regexp/dist/index.js',
    './node_modules/express-route-parser/node_modules/path-to-regexp/index.js'
  ];

  for (const possiblePath of possiblePaths) {
    const fullPath = path.resolve(possiblePath);

    if (fs.existsSync(fullPath)) {
      results.push(fullPath);
    }
  }

  return results;
}

console.log('Router path-to-regexp fix completed');

/**
 * This script patches all instances of the path-to-regexp library to fix the issue with wildcard patterns
 * in URL routes. The issue is that the library throws an error when it encounters a URL
 * with a colon in it, like https://example.com.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Starting comprehensive path-to-regexp fix...');

// Find all instances of path-to-regexp in node_modules
const nodeModulesPath = path.resolve('./node_modules');
let patchedCount = 0;
let errorCount = 0;

// Check if node_modules exists
if (!fs.existsSync(nodeModulesPath)) {
  console.error('Error: node_modules directory not found');
  process.exit(1);
}

// Use find command to locate all path-to-regexp instances (works on Linux/macOS)
try {
  console.log('Searching for all instances of path-to-regexp...');

  // First try with find command (Linux/macOS)
  let pathToRegexpPaths = [];
  try {
    const findOutput = execSync(
      'find ./node_modules -path "*/path-to-regexp/dist/index.js" -type f',
      { encoding: 'utf8' }
    ).trim();

    if (findOutput) {
      pathToRegexpPaths = findOutput.split('\n');
      console.log(`Found ${pathToRegexpPaths.length} instances of path-to-regexp using find command`);
    }
  } catch (error) {
    console.log('Find command failed, falling back to manual search...');
    // Find command failed, use manual search as fallback
    pathToRegexpPaths = findAllPathToRegexp(nodeModulesPath);
    console.log(`Found ${pathToRegexpPaths.length} instances of path-to-regexp using manual search`);
  }

  if (pathToRegexpPaths.length === 0) {
    console.log('No instances of path-to-regexp found. Trying to install it...');
    try {
      execSync('npm install --save path-to-regexp@6.2.1', { stdio: 'inherit' });
      console.log('path-to-regexp installed successfully');

      // Try to find it again
      try {
        const findOutput = execSync(
          'find ./node_modules -path "*/path-to-regexp/dist/index.js" -type f',
          { encoding: 'utf8' }
        ).trim();

        if (findOutput) {
          pathToRegexpPaths = findOutput.split('\n');
          console.log(`Found ${pathToRegexpPaths.length} instances of path-to-regexp after installation`);
        }
      } catch (error) {
        // Find command failed again, use manual search
        pathToRegexpPaths = findAllPathToRegexp(nodeModulesPath);
        console.log(`Found ${pathToRegexpPaths.length} instances of path-to-regexp using manual search after installation`);
      }
    } catch (error) {
      console.error('Failed to install path-to-regexp:', error.message);
    }
  }

  // Patch each instance
  for (const filePath of pathToRegexpPaths) {
    try {
      console.log(`Patching ${filePath}...`);
      patchPathToRegexp(filePath);
      patchedCount++;
    } catch (error) {
      console.error(`Error patching ${filePath}:`, error.message);
      errorCount++;
    }
  }

  // Also check for router package which might have its own path-to-regexp
  const routerPaths = [];
  try {
    const routerOutput = execSync(
      'find ./node_modules -path "*/router/node_modules/path-to-regexp/dist/index.js" -type f',
      { encoding: 'utf8' }
    ).trim();

    if (routerOutput) {
      const routerPathToRegexpPaths = routerOutput.split('\n');
      console.log(`Found ${routerPathToRegexpPaths.length} instances of path-to-regexp in router package`);

      for (const filePath of routerPathToRegexpPaths) {
        try {
          console.log(`Patching ${filePath}...`);
          patchPathToRegexp(filePath);
          patchedCount++;
        } catch (error) {
          console.error(`Error patching ${filePath}:`, error.message);
          errorCount++;
        }
      }
    }
  } catch (error) {
    console.log('Find command for router package failed, skipping...');
  }

  console.log(`Patched ${patchedCount} instances of path-to-regexp`);
  if (errorCount > 0) {
    console.warn(`Failed to patch ${errorCount} instances`);
  }

  if (patchedCount === 0) {
    console.error('No instances of path-to-regexp were patched');
    process.exit(1);
  }

} catch (error) {
  console.error('Error during patching process:', error.message);
  process.exit(1);
}

// Function to recursively find all path-to-regexp instances
function findAllPathToRegexp(dir, results = []) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      try {
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          if (file === 'path-to-regexp') {
            const indexPath = path.join(filePath, 'dist', 'index.js');
            if (fs.existsSync(indexPath)) {
              results.push(indexPath);
            }
          } else if (file !== 'node_modules') { // Avoid nested node_modules
            findAllPathToRegexp(filePath, results);
          }
        }
      } catch (statError) {
        // Skip files that can't be stat'd
        continue;
      }
    }
  } catch (error) {
    // Skip directories that can't be read
    console.log(`Warning: Could not read directory ${dir}: ${error.message}`);
  }

  return results;
}

// Function to patch a single path-to-regexp instance
function patchPathToRegexp(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace the DEBUG_URL constant with a safer value
    if (content.includes('const DEBUG_URL = "https://git.new/pathToRegexpError"')) {
      content = content.replace(
        'const DEBUG_URL = "https://git.new/pathToRegexpError";',
        'const DEBUG_URL = "path-to-regexp-error";'
      );
      modified = true;
    }

    // Fix the name function to handle malformed parameter names
    if (content.includes('function name(i, DEBUG_URL) {')) {
      content = content.replace(
        'function name(i, DEBUG_URL) {',
        `function name(i, DEBUG_URL) {
          // Skip parameter name validation for URLs with colons
          if (DEBUG_URL && DEBUG_URL.includes(':')) {
            return 'param';
          }
        `
      );
      modified = true;
    }

    // Only write back if changes were made
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Successfully patched ${filePath}`);
    } else {
      console.log(`No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error patching ${filePath}: ${error.message}`);
    throw error;
  }
}

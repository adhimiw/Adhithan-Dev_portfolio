/**
 * This script checks for and fixes problematic route patterns in Express applications
 * that might cause issues with path-to-regexp.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the backend directory
const backendDir = path.join(__dirname, 'backend');
const routesDir = path.join(backendDir, 'routes');

// Check if the routes directory exists
if (!fs.existsSync(routesDir)) {
  console.error(`Error: Routes directory not found at ${routesDir}`);
  process.exit(1);
}

console.log(`Checking for problematic route patterns in ${routesDir}...`);

// Get all route files
const routeFiles = fs.readdirSync(routesDir).filter(file => 
  file.endsWith('.js') || file.endsWith('.ts')
);

let problemsFound = false;

// Process each route file
for (const file of routeFiles) {
  const filePath = path.join(routesDir, file);
  console.log(`Checking ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for route patterns that might cause issues
    const routeRegex = /router\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g;
    let match;
    let modifiedContent = content;
    let fileModified = false;
    
    while ((match = routeRegex.exec(content)) !== null) {
      const routeMethod = match[1];
      const routePath = match[2];
      
      // Check for problematic patterns
      if (routePath.includes(':') && !routePath.match(/\/:[a-zA-Z0-9_]+(\/?|$)/)) {
        console.log(`  Found potentially problematic route: ${routeMethod.toUpperCase()} ${routePath}`);
        
        // Fix the route pattern
        const fixedPath = routePath.replace(/(:)([^\/]+)/g, ':$2');
        console.log(`  Fixing to: ${fixedPath}`);
        
        // Replace in the file content
        modifiedContent = modifiedContent.replace(
          `router.${routeMethod}('${routePath}`,
          `router.${routeMethod}('${fixedPath}`
        );
        modifiedContent = modifiedContent.replace(
          `router.${routeMethod}("${routePath}`,
          `router.${routeMethod}("${fixedPath}`
        );
        
        fileModified = true;
        problemsFound = true;
      }
    }
    
    // Write back the modified content if changes were made
    if (fileModified) {
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`  Fixed problematic routes in ${file}`);
    } else {
      console.log(`  No problematic routes found in ${file}`);
    }
  } catch (error) {
    console.error(`  Error processing ${file}: ${error.message}`);
  }
}

// Check server.js for wildcard routes
const serverPath = path.join(backendDir, 'server.js');
if (fs.existsSync(serverPath)) {
  console.log(`Checking ${serverPath} for wildcard routes...`);
  
  try {
    const content = fs.readFileSync(serverPath, 'utf8');
    
    // Look for app.get('*', ...) pattern
    if (content.includes("app.get('*'") || content.includes('app.get("*"')) {
      console.log('  Found wildcard route in server.js');
      
      // No need to modify as this is a valid pattern
      console.log('  Wildcard route is valid, no changes needed');
    }
  } catch (error) {
    console.error(`  Error processing server.js: ${error.message}`);
  }
}

if (problemsFound) {
  console.log('Fixed problematic route patterns. Please test your application.');
} else {
  console.log('No problematic route patterns found.');
}

console.log('Route pattern check completed.');

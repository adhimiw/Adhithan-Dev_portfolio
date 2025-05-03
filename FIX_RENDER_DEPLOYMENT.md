# Fix Render Deployment Issues

This guide provides instructions to fix the dependency conflicts and build errors when deploying to Render.

## Issue 1: Dependency Conflicts

The main issue is a conflict between React 18.3.1 and @react-three/drei which requires React 19. 

### Fix:

Update your package.json with the following dependency versions:

```json
"dependencies": {
  "@emotion/react": "^11.11.3",
  "@emotion/styled": "^11.11.0",
  "@hookform/resolvers": "^3.3.4",
  "@mui/icons-material": "^5.15.10",
  "@mui/material": "^5.15.10",
  "@mui/system": "^5.15.9",
  // ... other dependencies
  "@react-three/drei": "^9.92.7",
  "@react-three/fiber": "^8.15.12",
  "@tanstack/react-query": "^5.17.19",
  // ... rest of dependencies
}
```

## Issue 2: Build Command Failures

The build is failing because of dependency conflicts.

### Fix:

Update your render.yaml file to use the --legacy-peer-deps flag:

```yaml
# Backend API Service
- type: web
  name: adhithan-portfolio-api
  env: node
  buildCommand: npm install --legacy-peer-deps
  startCommand: node backend/server.js
  
# Frontend Service
- type: web
  name: adhithan-portfolio-frontend
  env: node
  buildCommand: npm install --legacy-peer-deps && npm run build
  startCommand: npx serve -s dist
```

## How to Apply These Changes

1. Edit your package.json file and update the dependency versions
2. Edit your render.yaml file to add the --legacy-peer-deps flag to the build commands
3. Commit and push these changes to your repository
4. Redeploy your application on Render

## Alternative Approach

If you continue to have issues, you can also try:

1. Adding a .npmrc file to your repository with the following content:
   ```
   legacy-peer-deps=true
   ```

2. Updating your build command in render.yaml to:
   ```yaml
   buildCommand: npm ci && npm run build
   ```

This will ensure that npm uses the exact versions specified in your package-lock.json file.

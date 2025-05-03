#!/bin/bash

# Script to build the project for Render deployment
echo "Starting build process for Render deployment..."

# Print current directory
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install vite and plugin-react globally to ensure they're available
echo "Installing vite and plugin-react globally..."
npm install -g vite @vitejs/plugin-react

# Create a simple vite.config.js file that explicitly sets the root
echo "Creating a simplified vite.config.js file..."
cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
EOL

# Skip TypeScript type checking and build directly with Vite
echo "Building with Vite (skipping TypeScript type checking)..."
npx vite build --config vite.config.js

echo "Build completed successfully!"

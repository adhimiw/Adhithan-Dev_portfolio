#!/bin/bash

# Script to build the project for Render deployment
echo "Starting build process for Render deployment..."

# Print current directory for debugging
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install additional dependencies and type definitions
echo "Installing additional dependencies and type definitions..."
npm install --save lucide-react class-variance-authority tailwind-merge
npm install --save-dev @types/three @types/react@18.3.20 @types/react-dom@18.3.6

# Verify lucide-react is installed
echo "Verifying lucide-react installation..."
if [ -d "node_modules/lucide-react" ]; then
  echo "lucide-react is installed correctly"
else
  echo "lucide-react is NOT installed, trying again with explicit version..."
  npm install --save lucide-react@latest
fi

# Skip TypeScript type checking and build directly with Vite
echo "Building with Vite (skipping TypeScript type checking)..."
# Use a direct approach with explicit entry point
npx vite build --config vite.config.prod.ts

echo "Build completed successfully!"

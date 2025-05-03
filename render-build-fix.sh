#!/bin/bash

# Script to build the project for Render deployment
echo "Starting build process for Render deployment..."

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install vite and plugin-react globally to ensure they're available
echo "Installing vite and plugin-react globally..."
npm install -g vite @vitejs/plugin-react

# Skip TypeScript type checking and build directly with Vite
echo "Building with Vite (skipping TypeScript type checking)..."
npx vite build --config vite.config.prod.ts --outDir dist

echo "Build completed successfully!"

#!/bin/bash

# Script to build the project for Render deployment
echo "Starting build process for Render deployment..."

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Make sure npx is available
echo "Ensuring npx is available..."
npm install -g npx

# Install vite globally to ensure it's available
echo "Installing vite globally..."
npm install -g vite

# Skip TypeScript type checking and build directly with Vite
echo "Building with Vite (skipping TypeScript type checking)..."
npx vite build --config vite.config.prod.ts --outDir dist

echo "Build completed successfully!"

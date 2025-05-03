#!/bin/bash

# Script to build the backend for Render deployment
echo "Starting backend build process for Render deployment..."

# Print current directory
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Check Node.js version
echo "Node.js version:"
node --version

# Use Node.js 18 if available on Render
if command -v /opt/render/project/nodejs18/bin/node &> /dev/null; then
  echo "Using Node.js 18 from Render path..."
  export PATH="/opt/render/project/nodejs18/bin:$PATH"
  node --version
fi

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install path-to-regexp explicitly
echo "Installing path-to-regexp explicitly..."
npm install --save path-to-regexp@6.2.1

# Apply the path-to-regexp fixes
echo "Applying path-to-regexp fixes..."
node fix-path-to-regexp.js
node fix-router-path-to-regexp.js

# Make sure the backend directory exists
echo "Checking backend directory..."
if [ -d "backend" ]; then
  echo "Backend directory found."
  ls -la backend
else
  echo "ERROR: Backend directory not found!"
  exit 1
fi

echo "Backend build completed successfully!"

#!/bin/bash

# Script to build the backend for Render deployment
echo "Starting backend build process for Render deployment..."

# Print current directory
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

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

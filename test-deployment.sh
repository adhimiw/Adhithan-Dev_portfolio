#!/bin/bash

# Script to test the deployment fix
echo "Testing deployment fix..."

# Build the frontend
echo "Building the frontend..."
npm run build

# Check if the build was successful
if [ -d "dist" ]; then
  echo "Frontend build successful!"
else
  echo "Frontend build failed!"
  exit 1
fi

# Start the server
echo "Starting the server..."
node backend/server.js

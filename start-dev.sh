#!/bin/bash

# Kill any existing ngrok processes
pkill -f ngrok || true

# Kill any existing server processes
pkill -f "node backend/server.js" || true

# Start the frontend
npm run dev &

# Start ngrok
echo "Starting ngrok..."
ngrok http 5000 &

# Wait for ngrok to start
sleep 5

# Prompt user to update the ngrok URL
echo ""
echo "=== IMPORTANT ==="
echo "1. Copy the ngrok URL from the terminal (e.g., https://abc123.ngrok-free.app)"
echo "2. Run: node update-ngrok-url.js"
echo "3. Follow the instructions to update your GitHub OAuth settings"
echo "4. Start the backend server: node backend/server.js"
echo ""

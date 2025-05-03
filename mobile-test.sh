#!/bin/bash

# Script to start the server for mobile testing

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "Your local IP address is: $LOCAL_IP"

# Create a temporary .env.mobile file
echo "Creating temporary .env.mobile file..."
cat > .env.mobile << EOF
# Mobile testing configuration
VITE_API_URL=http://$LOCAL_IP:5000
MONGO_URI=$(grep MONGO_URI .env | cut -d= -f2-)
JWT_SECRET=$(grep JWT_SECRET .env | cut -d= -f2-)
CLOUDINARY_CLOUD_NAME=$(grep CLOUDINARY_CLOUD_NAME .env | cut -d= -f2-)
CLOUDINARY_API_KEY=$(grep CLOUDINARY_API_KEY .env | cut -d= -f2-)
CLOUDINARY_API_SECRET=$(grep CLOUDINARY_API_SECRET .env | cut -d= -f2-)
GOOGLE_API_KEY=$(grep GOOGLE_API_KEY .env | cut -d= -f2-)
ADMIN_EMAIL=$(grep ADMIN_EMAIL .env | cut -d= -f2-)
FRONTEND_URL=http://$LOCAL_IP:5173
EOF

# Display QR code for easy mobile access
echo "Scan this QR code on your mobile device to access the app:"
if command -v qrencode &> /dev/null; then
    qrencode -t ANSI "http://$LOCAL_IP:5173"
else
    echo "Install qrencode for QR code: sudo apt-get install qrencode"
    echo "Mobile URL: http://$LOCAL_IP:5173"
fi

# Start the backend server with the mobile environment
echo -e "\nStarting backend server..."
cd backend
NODE_ENV=development DOTENV_CONFIG_PATH=../.env.mobile node server.js

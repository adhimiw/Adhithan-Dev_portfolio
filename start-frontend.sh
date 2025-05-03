#!/bin/bash

# Script to start the frontend for mobile testing

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "Your local IP address is: $LOCAL_IP"

# Display QR code for easy mobile access
echo "Scan this QR code on your mobile device to access the app:"
if command -v qrencode &> /dev/null; then
    qrencode -t ANSI "http://$LOCAL_IP:5173"
else
    echo "Install qrencode for QR code: sudo apt-get install qrencode"
    echo "Mobile URL: http://$LOCAL_IP:5173"
fi

# Start the frontend with the mobile environment
echo -e "\nStarting frontend development server..."
VITE_API_URL=http://$LOCAL_IP:5000 npm run dev

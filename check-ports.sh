#!/bin/bash

# Script to check if ports are accessible

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "Your local IP address is: $LOCAL_IP"

# Check if ports are open
echo "Checking if port 5173 (frontend) is open..."
nc -z -v $LOCAL_IP 5173

echo "Checking if port 5000 (backend) is open..."
nc -z -v $LOCAL_IP 5000

# Check firewall status
echo -e "\nChecking firewall status..."
if command -v ufw &> /dev/null; then
    sudo ufw status
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-all
else
    echo "No firewall command found. Please check your firewall settings manually."
fi

echo -e "\nIf the ports are not open, you may need to allow them in your firewall:"
echo "For UFW: sudo ufw allow 5173/tcp && sudo ufw allow 5000/tcp"
echo "For firewalld: sudo firewall-cmd --permanent --add-port=5173/tcp && sudo firewall-cmd --permanent --add-port=5000/tcp && sudo firewall-cmd --reload"

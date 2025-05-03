# Mobile Testing Guide

This guide will help you test your portfolio application on mobile devices.

## Prerequisites

- Your computer and mobile device must be on the same WiFi network
- The ports 5000 and 5173 must be open on your computer's firewall

## Step 1: Check Your Network Setup

Run the port check script to verify your network configuration:

```bash
./check-ports.sh
```

This will show if your ports are accessible and provide firewall configuration instructions if needed.

## Step 2: Start the Backend Server

Start the backend server with the mobile testing configuration:

```bash
./mobile-test.sh
```

This script will:
1. Detect your local IP address
2. Create a temporary `.env.mobile` file with the correct configuration
3. Display a QR code for easy access from your mobile device
4. Start the backend server with the mobile configuration

## Step 3: Start the Frontend Server

In a new terminal window, start the frontend server:

```bash
./start-frontend.sh
```

This script will:
1. Display your local IP address
2. Show a QR code for easy access
3. Start the Vite development server with the correct API URL

## Step 4: Access from Your Mobile Device

On your mobile device:
1. Make sure you're connected to the same WiFi network as your computer
2. Scan the QR code displayed in the terminal, or
3. Open your browser and navigate to `http://YOUR_IP_ADDRESS:5173`

## Troubleshooting

If you're having trouble connecting:

1. **Check Firewall Settings**:
   - On Ubuntu/Debian: `sudo ufw allow 5173/tcp && sudo ufw allow 5000/tcp`
   - On Fedora/RHEL: `sudo firewall-cmd --permanent --add-port=5173/tcp && sudo firewall-cmd --permanent --add-port=5000/tcp && sudo firewall-cmd --reload`

2. **Verify Network Isolation**:
   - Some WiFi networks isolate devices from each other for security
   - Try connecting to a different WiFi network or create a hotspot from your computer

3. **Check IP Address**:
   - Your computer's IP address might have changed
   - Run `hostname -I` to get your current IP address

4. **Test with curl**:
   - On your computer, run: `curl http://localhost:5000/api/health`
   - If this works, the backend is running correctly

5. **Check Browser Console**:
   - Open your mobile browser's developer tools (if available)
   - Look for CORS or connection errors in the console

## Preparing for Production

When deploying to production:

1. Update the CORS configuration in `backend/server.js` and `backend/services/socketService.js` to include your production domain
2. Set the appropriate environment variables for your production environment
3. Make sure your MongoDB connection is configured correctly for production

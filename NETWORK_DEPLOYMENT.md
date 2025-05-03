# Network Deployment Guide

This guide explains how to deploy your portfolio application on your local network as "adhithan@Dev_portfolio".

## Prerequisites

- Node.js 16+ and npm/bun installed
- MongoDB Atlas account (or local MongoDB)
- Basic understanding of networking
- Linux/macOS environment (for the deployment scripts)

## Deployment Steps

### 1. Prepare Your Environment

First, make sure your project is ready for deployment:

```bash
# Install dependencies
npm install

# Make sure you have a .env file with your configuration
# If not, copy from .env.example and fill in the values
```

### 2. Run the Deployment Script

The deployment script will set up your application for network access:

```bash
# Make the script executable
chmod +x deploy-network.sh

# Run the deployment script
./deploy-network.sh
```

This script will:
- Detect your local IP address
- Create a secure environment file
- Build the frontend for production
- Create startup scripts
- Generate a QR code for easy access

### 3. Start the Application

After running the deployment script, you can start your application:

```bash
# Start both backend and frontend
~/adhithan_Dev_portfolio/start-all.sh

# Or start them separately
~/adhithan_Dev_portfolio/start-backend.sh
~/adhithan_Dev_portfolio/start-frontend.sh
```

### 4. Access Your Portfolio

Your portfolio will be available at:
- Frontend: `http://<your-ip>:5174`
- Backend API: `http://<your-ip>:5000`

You can scan the QR code displayed in the terminal to access it from mobile devices.

### 5. Stop the Application

To stop the application:

```bash
~/adhithan_Dev_portfolio/stop.sh
```

## Network Configuration

### Firewall Settings

Make sure ports 5000 (backend) and 5174 (frontend) are open on your firewall:

```bash
# Check if ports are open
sudo ufw status

# If needed, open the ports
sudo ufw allow 5000/tcp
sudo ufw allow 5174/tcp
```

### Router Configuration

If you want to access your portfolio from outside your local network:

1. Set up port forwarding on your router
   - Forward external port 5174 to internal port 5174 (frontend)
   - Forward external port 5000 to internal port 5000 (backend)
   
2. Consider using a dynamic DNS service if you don't have a static IP

### CORS Configuration

The application is already configured to allow connections from various IP addresses. If you need to add more, edit the `corsOptions` in `backend/server.js`.

## Security Considerations

### Environment Variables

Sensitive information is stored in the `.env` file with restricted permissions (600). See `ENV_SECURITY.md` for more details.

### Network Security

- Use a strong Wi-Fi password
- Consider setting up a separate VLAN for your development environment
- Use HTTPS when possible (requires additional setup)

### MongoDB Atlas Security

- Restrict database access to specific IP addresses
- Use a strong password for your database user
- Enable MongoDB Atlas network peering if available

## Troubleshooting

### Connection Issues

If you can't connect to your application:

1. Check if the application is running:
   ```bash
   ps aux | grep node
   ```

2. Verify the IP address:
   ```bash
   hostname -I
   ```

3. Test the backend API:
   ```bash
   curl http://localhost:5000/api/health
   ```

4. Check the logs:
   ```bash
   cat ~/adhithan_Dev_portfolio/logs/backend.log
   cat ~/adhithan_Dev_portfolio/logs/frontend.log
   ```

### CORS Errors

If you see CORS errors in the browser console:

1. Make sure your IP address is included in the CORS configuration
2. Check that you're using the correct URL format (http://<ip>:<port>)
3. Verify that both backend and frontend are running

## Updating Your Deployment

To update your deployment after making changes:

1. Stop the application:
   ```bash
   ~/adhithan_Dev_portfolio/stop.sh
   ```

2. Pull the latest changes (if using Git):
   ```bash
   git pull
   ```

3. Run the deployment script again:
   ```bash
   ./deploy-network.sh
   ```

4. Start the application:
   ```bash
   ~/adhithan_Dev_portfolio/start-all.sh
   ```

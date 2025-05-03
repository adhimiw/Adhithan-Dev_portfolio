#!/bin/bash

# PM2 Deployment Script for adhithan@Dev_portfolio
# This script sets up your portfolio for network access using PM2 process manager

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Installing PM2..."
    npm install -g pm2
    
    # Set up PM2 to start on boot
    pm2 startup
    
    echo "PM2 installed successfully."
fi

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "Your local IP address is: $LOCAL_IP"

# Create deployment directory if it doesn't exist
DEPLOY_DIR="$HOME/adhithan_Dev_portfolio"
mkdir -p "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/logs"

# Create a secure .env file for deployment
echo "Creating secure .env file for deployment..."

# Generate a new JWT secret if none exists
if [ ! -f "$DEPLOY_DIR/.env" ] || ! grep -q "JWT_SECRET" "$DEPLOY_DIR/.env"; then
    NEW_JWT_SECRET=$(openssl rand -hex 32)
else
    # Extract existing JWT secret
    NEW_JWT_SECRET=$(grep JWT_SECRET "$DEPLOY_DIR/.env" | cut -d= -f2-)
fi

# Create .env file with secure permissions
cat > "$DEPLOY_DIR/.env" << EOF
# Production environment configuration for adhithan@Dev_portfolio
# Created: $(date)
# DO NOT SHARE THIS FILE

# API Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGO_URI=$(grep MONGO_URI .env | cut -d= -f2-)

# Security
JWT_SECRET=$NEW_JWT_SECRET

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=$(grep CLOUDINARY_CLOUD_NAME .env | cut -d= -f2-)
CLOUDINARY_API_KEY=$(grep CLOUDINARY_API_KEY .env | cut -d= -f2-)
CLOUDINARY_API_SECRET=$(grep CLOUDINARY_API_SECRET .env | cut -d= -f2-)

# Google API
GOOGLE_API_KEY=$(grep GOOGLE_API_KEY .env | cut -d= -f2-)

# Admin Configuration
ADMIN_EMAIL=$(grep ADMIN_EMAIL .env | cut -d= -f2-)

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://$LOCAL_IP:5174
EOF

# Set secure permissions on .env file
chmod 600 "$DEPLOY_DIR/.env"
echo "Secure .env file created with restricted permissions (600)"

# Create frontend environment file
cat > .env.production << EOF
# Frontend production configuration
VITE_API_URL=http://$LOCAL_IP:5000
EOF

# Build the frontend
echo "Building frontend for production..."
npm run build

# Update ecosystem.config.js with correct paths
sed -i "s|DOTENV_CONFIG_PATH: '~/adhithan_Dev_portfolio/.env'|DOTENV_CONFIG_PATH: '$DEPLOY_DIR/.env'|g" ecosystem.config.js
sed -i "s|error_file: '~/adhithan_Dev_portfolio/logs/backend-error.log'|error_file: '$DEPLOY_DIR/logs/backend-error.log'|g" ecosystem.config.js
sed -i "s|out_file: '~/adhithan_Dev_portfolio/logs/backend-out.log'|out_file: '$DEPLOY_DIR/logs/backend-out.log'|g" ecosystem.config.js
sed -i "s|error_file: '~/adhithan_Dev_portfolio/logs/frontend-error.log'|error_file: '$DEPLOY_DIR/logs/frontend-error.log'|g" ecosystem.config.js
sed -i "s|out_file: '~/adhithan_Dev_portfolio/logs/frontend-out.log'|out_file: '$DEPLOY_DIR/logs/frontend-out.log'|g" ecosystem.config.js

# Start the application with PM2
echo "Starting the application with PM2..."
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js

# Save the PM2 configuration
pm2 save

# Create a convenience script to check status
cat > "$DEPLOY_DIR/status.sh" << EOF
#!/bin/bash
echo "adhithan@Dev_portfolio Status"
echo "=========================="
echo ""
pm2 list
echo ""
echo "Access your portfolio at:"
echo "  http://$LOCAL_IP:5174"
echo ""
echo "API is available at:"
echo "  http://$LOCAL_IP:5000"
EOF

chmod +x "$DEPLOY_DIR/status.sh"

# Generate QR code for easy access
if command -v qrencode &> /dev/null; then
    echo "Scan this QR code to access the portfolio:"
    qrencode -t ANSI "http://$LOCAL_IP:5174"
else
    echo "Install qrencode for QR code: sudo apt-get install qrencode"
fi

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo "Your portfolio has been deployed as adhithan@Dev_portfolio using PM2"
echo ""
echo "To check status:"
echo "  $DEPLOY_DIR/status.sh"
echo ""
echo "PM2 Commands:"
echo "  pm2 list                  - List running applications"
echo "  pm2 logs                  - View logs"
echo "  pm2 restart all           - Restart all applications"
echo "  pm2 stop all              - Stop all applications"
echo "  pm2 delete all            - Remove all applications"
echo ""
echo "Your secure environment variables are stored in:"
echo "  $DEPLOY_DIR/.env (permissions: 600)"
echo ""
echo "Access your portfolio at:"
echo "  http://$LOCAL_IP:5174"
echo ""

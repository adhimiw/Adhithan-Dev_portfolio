#!/bin/bash

# Network Deployment Script for adhithan@Dev_portfolio
# This script sets up your portfolio for network access with secure environment variables

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

# Create startup scripts
cat > "$DEPLOY_DIR/start-backend.sh" << EOF
#!/bin/bash
cd $(pwd)
NODE_ENV=production DOTENV_CONFIG_PATH=$DEPLOY_DIR/.env node backend/server.js > $DEPLOY_DIR/logs/backend.log 2>&1
EOF

cat > "$DEPLOY_DIR/start-frontend.sh" << EOF
#!/bin/bash
cd $(pwd)
npx vite preview --host $LOCAL_IP --port 5174 > $DEPLOY_DIR/logs/frontend.log 2>&1
EOF

cat > "$DEPLOY_DIR/start-all.sh" << EOF
#!/bin/bash
cd $(pwd)
echo "Starting adhithan@Dev_portfolio..."
echo "Backend API: http://$LOCAL_IP:5000"
echo "Frontend: http://$LOCAL_IP:5174"

# Start backend
NODE_ENV=production DOTENV_CONFIG_PATH=$DEPLOY_DIR/.env node backend/server.js > $DEPLOY_DIR/logs/backend.log 2>&1 &
BACKEND_PID=\$!
echo "Backend started with PID \$BACKEND_PID"

# Start frontend
npx vite preview --host $LOCAL_IP --port 5174 > $DEPLOY_DIR/logs/frontend.log 2>&1 &
FRONTEND_PID=\$!
echo "Frontend started with PID \$FRONTEND_PID"

# Generate QR code for easy access
if command -v qrencode &> /dev/null; then
    echo "Scan this QR code to access the portfolio:"
    qrencode -t ANSI "http://$LOCAL_IP:5174"
else
    echo "Install qrencode for QR code: sudo apt-get install qrencode"
fi

echo "Portfolio is now running!"
echo "Access the portfolio at: http://$LOCAL_IP:5174"
echo "API is available at: http://$LOCAL_IP:5000"
echo ""
echo "To stop the servers, run: $DEPLOY_DIR/stop.sh"

# Save PIDs for the stop script
echo "BACKEND_PID=\$BACKEND_PID" > "$DEPLOY_DIR/running.conf"
echo "FRONTEND_PID=\$FRONTEND_PID" >> "$DEPLOY_DIR/running.conf"
EOF

cat > "$DEPLOY_DIR/stop.sh" << EOF
#!/bin/bash
if [ -f "$DEPLOY_DIR/running.conf" ]; then
    source "$DEPLOY_DIR/running.conf"
    echo "Stopping adhithan@Dev_portfolio..."
    
    if [ -n "\$BACKEND_PID" ]; then
        echo "Stopping backend (PID \$BACKEND_PID)..."
        kill \$BACKEND_PID 2>/dev/null || true
    fi
    
    if [ -n "\$FRONTEND_PID" ]; then
        echo "Stopping frontend (PID \$FRONTEND_PID)..."
        kill \$FRONTEND_PID 2>/dev/null || true
    fi
    
    rm "$DEPLOY_DIR/running.conf"
    echo "All services stopped."
else
    echo "No running services found."
fi
EOF

# Make scripts executable
chmod +x "$DEPLOY_DIR/start-backend.sh"
chmod +x "$DEPLOY_DIR/start-frontend.sh"
chmod +x "$DEPLOY_DIR/start-all.sh"
chmod +x "$DEPLOY_DIR/stop.sh"

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo "Your portfolio has been configured for network deployment as adhithan@Dev_portfolio"
echo ""
echo "To start the application:"
echo "  $DEPLOY_DIR/start-all.sh"
echo ""
echo "To stop the application:"
echo "  $DEPLOY_DIR/stop.sh"
echo ""
echo "Your secure environment variables are stored in:"
echo "  $DEPLOY_DIR/.env (permissions: 600)"
echo ""
echo "Access your portfolio at:"
echo "  http://$LOCAL_IP:5174"
echo ""

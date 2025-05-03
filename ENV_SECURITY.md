# Environment Variables Security Guide

This document provides best practices for managing environment variables securely in your portfolio application.

## Environment Variables in Your Portfolio

Your portfolio application uses environment variables for:

1. **Database Connection**: MongoDB Atlas connection string
2. **Authentication**: JWT secret for user authentication
3. **API Keys**: Cloudinary, Google API, etc.
4. **Configuration**: API URLs, ports, etc.

## Security Best Practices

### 1. Never Commit Sensitive Environment Variables to Git

- **DO NOT** commit `.env` files containing sensitive information to Git
- Your `.gitignore` file should include:
  ```
  .env
  .env.*
  !.env.example
  ```

### 2. Use Different Environment Files for Different Environments

- `.env.example` - Template with placeholder values (safe to commit)
- `.env` - Local development variables (do not commit)
- `.env.production` - Production variables (do not commit)
- `.env.mobile` - Mobile testing variables (do not commit)

### 3. Secure Storage of Environment Files

- Set restrictive file permissions: `chmod 600 .env`
- Store production environment variables in a secure location outside the project directory
- Consider using a password manager for backup

### 4. Environment Variable Handling

- Backend: Use `dotenv` to load variables (already implemented)
- Frontend: Only expose variables with `VITE_` prefix
- Never expose sensitive backend variables to the frontend

### 5. Secrets Rotation

- Periodically rotate sensitive secrets like JWT_SECRET
- Update API keys regularly
- MongoDB Atlas: Review and rotate database user credentials

### 6. Network Deployment Security

When deploying as "adhithan@Dev_portfolio" on your network:

1. Store the `.env` file in a secure location with restricted permissions
2. Use the provided `deploy-network.sh` script which:
   - Creates a secure `.env` file with proper permissions
   - Generates a strong JWT secret if needed
   - Keeps sensitive variables separate from the codebase

### 7. MongoDB Atlas Security

For your MongoDB Atlas connection:

1. Use a strong, unique password for the database user
2. Restrict network access to specific IP addresses
3. Enable MongoDB Atlas network peering if available
4. Regularly review database access logs

### 8. Local Network Security

When exposing your application on your local network:

1. Ensure your network has a strong Wi-Fi password
2. Consider using a separate VLAN for development
3. Use HTTPS when possible, even for local development
4. Restrict access to specific IP addresses in your CORS configuration

## Environment Variables Reference

| Variable | Purpose | Where Used | Security Level |
|----------|---------|------------|---------------|
| MONGO_URI | MongoDB connection string | Backend only | High |
| JWT_SECRET | Authentication token signing | Backend only | High |
| CLOUDINARY_* | Image upload service | Backend only | High |
| GOOGLE_API_KEY | Google services | Backend only | Medium |
| VITE_API_URL | Backend API location | Frontend | Low |
| PORT | Server port | Backend only | Low |

## Deployment Environment Setup

The `deploy-network.sh` script creates a secure deployment environment:

1. Creates a dedicated directory for deployment configuration
2. Generates a secure `.env` file with restricted permissions
3. Creates startup scripts for the application
4. Provides QR code for easy access

To deploy your application securely:

```bash
# Make the script executable
chmod +x deploy-network.sh

# Run the deployment script
./deploy-network.sh
```

This will set up your application for network access as "adhithan@Dev_portfolio" with secure environment variable handling.

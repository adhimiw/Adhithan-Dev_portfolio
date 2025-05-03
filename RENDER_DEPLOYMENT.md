# Render Deployment Guide

This guide explains how to deploy your portfolio application for free on Render.com as "adhithan@Dev_portfolio".

## Prerequisites

- GitHub account
- MongoDB Atlas account (which you already have)
- Render.com account (free tier)

## Step 1: Prepare Your Repository

1. Make sure your code is in a GitHub repository
2. Ensure your project has the following structure:
   - Frontend code in the root or `/src` directory
   - Backend code in the `/backend` directory
   - `package.json` in the root with scripts for both frontend and backend

3. Add the `render.yaml` file to your repository root (already created)

4. Update your frontend code to use the environment variable for API URL:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || '';
   ```

5. Make sure your backend server listens on the correct port:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

## Step 2: Set Up MongoDB Atlas

1. Log in to your MongoDB Atlas account
2. Make sure your database is properly configured
3. Set up network access to allow connections from anywhere (for Render)
   - Go to Network Access in MongoDB Atlas
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
4. Copy your MongoDB connection string for later use

## Step 3: Deploy on Render

### Option 1: Deploy with Blueprint (Recommended)

1. Log in to Render.com
2. Click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file and set up services automatically
5. Enter your environment variables when prompted:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `GOOGLE_API_KEY`: Your Google API key
   - `ADMIN_EMAIL`: Your admin email
6. Click "Apply" to start the deployment

### Option 2: Manual Deployment

#### Deploy the Backend

1. Log in to Render.com
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: adhithan-portfolio-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: Free
5. Add environment variables:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a new secure random string
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `GOOGLE_API_KEY`: Your Google API key
   - `ADMIN_EMAIL`: Your admin email
6. Click "Create Web Service"

#### Deploy the Frontend

1. In Render.com, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: adhithan-portfolio-frontend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist`
   - **Plan**: Free
4. Add environment variables:
   - `VITE_API_URL`: The URL of your backend service (e.g., https://adhithan-portfolio-api.onrender.com)
5. Click "Create Web Service"

## Step 4: Update CORS Configuration

After deployment, you need to update your CORS configuration in the backend to allow requests from your frontend domain:

1. Go to your GitHub repository
2. Edit `backend/server.js`
3. Update the `corsOptions` to include your Render domains:

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // For development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      console.log('CORS: Development mode - allowing all origins');
      callback(null, true);
      return;
    }

    // For production, use a whitelist
    const allowedOrigins = [
      // Local development
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      // Render domains
      'https://adhithan-portfolio-frontend.onrender.com',
      process.env.FRONTEND_URL,
      // Add your custom domain if you have one
    ];

    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
      return;
    }

    // Check for wildcard patterns
    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern.includes('*')) {
        const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

4. Commit and push your changes
5. Render will automatically redeploy your backend

## Step 5: Verify Your Deployment

1. Wait for both services to deploy (this may take a few minutes)
2. Visit your frontend URL (e.g., https://adhithan-portfolio-frontend.onrender.com)
3. Test the application to make sure everything works correctly
4. Check the backend logs in Render if you encounter any issues

## Important Notes

1. **Free Tier Limitations**:
   - Render free tier services will spin down after 15 minutes of inactivity
   - The first request after inactivity will take longer to load (up to 30 seconds)
   - You have 750 free hours per month across all services

2. **Environment Variables**:
   - All sensitive information is stored securely in Render
   - You don't need to commit any `.env` files to your repository

3. **Custom Domain**:
   - If you want to use a custom domain, you can configure it in Render
   - Go to your service settings and click "Custom Domain"

4. **Continuous Deployment**:
   - Render automatically deploys when you push to your GitHub repository
   - You can disable automatic deployments in the service settings

## Troubleshooting

### Backend Connection Issues

If your frontend can't connect to the backend:

1. Check the CORS configuration in `backend/server.js`
2. Verify that the `VITE_API_URL` environment variable is set correctly
3. Check the backend logs in Render for any errors

### Database Connection Issues

If your backend can't connect to MongoDB:

1. Check the `MONGO_URI` environment variable in Render
2. Verify that your IP whitelist in MongoDB Atlas includes 0.0.0.0/0
3. Check the backend logs in Render for any connection errors

### Build Failures

If your deployment fails during the build process:

1. Check the build logs in Render
2. Make sure all dependencies are listed in your `package.json`
3. Verify that your build commands are correct

## Updating Your Deployment

To update your deployment:

1. Push changes to your GitHub repository
2. Render will automatically redeploy your services
3. Monitor the deployment in the Render dashboard

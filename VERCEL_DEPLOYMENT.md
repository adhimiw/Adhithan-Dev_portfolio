# Vercel Deployment Guide

This guide explains how to deploy your portfolio application for free using Vercel for the frontend and Render for the backend.

## Prerequisites

- GitHub account
- MongoDB Atlas account (which you already have)
- Vercel account (free tier)
- Render account (free tier)

## Step 1: Prepare Your Repository

1. Make sure your code is in a GitHub repository
2. Ensure your project has the following structure:
   - Frontend code in the root or `/src` directory
   - Backend code in the `/backend` directory
   - `package.json` in the root with scripts for both frontend and backend

3. Update your frontend code to use the environment variable for API URL:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || '';
   ```

4. Make sure your backend server listens on the correct port:
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

## Step 3: Deploy Backend on Render

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
   - `FRONTEND_URL`: Leave blank for now, you'll update this after deploying the frontend
6. Click "Create Web Service"
7. Wait for the backend to deploy and note the URL (e.g., https://adhithan-portfolio-api.onrender.com)

## Step 4: Create Vercel Configuration

Create a `vercel.json` file in the root of your repository:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Step 5: Deploy Frontend on Vercel

1. Log in to Vercel
2. Click "Add New" and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: (leave blank)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_API_URL`: The URL of your backend service (e.g., https://adhithan-portfolio-api.onrender.com)
6. Click "Deploy"
7. Wait for the frontend to deploy and note the URL (e.g., https://adhithan-portfolio.vercel.app)

## Step 6: Update Backend CORS and Frontend URL

1. Go back to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add or update the `FRONTEND_URL` variable with your Vercel URL
5. Click "Save Changes"

6. Update your CORS configuration in `backend/server.js` to include your Vercel domain:

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
      // Vercel domain
      'https://adhithan-portfolio.vercel.app',
      // Render domain
      'https://adhithan-portfolio-api.onrender.com',
      // Dynamic frontend URL from environment
      process.env.FRONTEND_URL,
      // Add your custom domain if you have one
    ];

    // Rest of your CORS configuration...
  },
  credentials: true
};
```

7. Commit and push your changes
8. Render will automatically redeploy your backend

## Step 7: Verify Your Deployment

1. Visit your Vercel URL (e.g., https://adhithan-portfolio.vercel.app)
2. Test the application to make sure everything works correctly
3. Check the logs in both Vercel and Render if you encounter any issues

## Step 8: Set Up Custom Domain (Optional)

If you have a custom domain:

### On Vercel:
1. Go to "Settings" > "Domains" in your project dashboard
2. Click "Add" and enter your domain
3. Follow the instructions to set up your domain

### On Render:
1. Go to your service settings
2. Click "Custom Domain"
3. Follow the instructions to set up your domain

## Important Notes

1. **Free Tier Limitations**:
   - Render free tier services will spin down after 15 minutes of inactivity
   - The first request after inactivity will take longer to load (up to 30 seconds)
   - Vercel has generous free tier limits (100GB bandwidth per month)

2. **Environment Variables**:
   - All sensitive information is stored securely in Vercel and Render
   - You don't need to commit any `.env` files to your repository

3. **Continuous Deployment**:
   - Both Vercel and Render automatically deploy when you push to your GitHub repository
   - You can configure specific branches for deployment in the service settings

## Troubleshooting

### Backend Connection Issues

If your frontend can't connect to the backend:

1. Check the CORS configuration in `backend/server.js`
2. Verify that the `VITE_API_URL` environment variable is set correctly in Vercel
3. Check the backend logs in Render for any errors

### Database Connection Issues

If your backend can't connect to MongoDB:

1. Check the `MONGO_URI` environment variable in Render
2. Verify that your IP whitelist in MongoDB Atlas includes 0.0.0.0/0
3. Check the backend logs in Render for any connection errors

### Build Failures

If your deployment fails during the build process:

1. Check the build logs in Vercel or Render
2. Make sure all dependencies are listed in your `package.json`
3. Verify that your build commands are correct

## Updating Your Deployment

To update your deployment:

1. Push changes to your GitHub repository
2. Both Vercel and Render will automatically redeploy your services
3. Monitor the deployments in their respective dashboards

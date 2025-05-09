import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import aboutRouter from './routes/about.js';
import contactRouter from './routes/contact-new.js';
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import webhookRouter from './routes/webhook.js';
import healthRouter from './routes/health.js';

import visitorsRouter from './routes/visitors.js';
import notificationRouter from './routes/notificationRoutes.js';
import deviceRouter from './routes/deviceRoutes.js';
import { initSocketIO } from './services/socketService.js';

// Use alternative email service for better compatibility
console.log('Using alternative email service');
import('./utils/emailServiceAlt.js').then(module => {
  global.emailService = module.default;
}).catch(error => {
  console.error('Failed to load alternative email service:', error);
});
import { wildcardMiddleware } from './middleware/routeHandler.js';
import fs from 'fs'; // Ensure fs is imported

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(dirname(__dirname), '.env');

dotenv.config({ path: envPath });

// Log which MongoDB URI we're using (without showing credentials)
const mongoUriDisplay = process.env.MONGO_URI
  ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')
  : 'Not defined';
console.log(`Using MongoDB URI: ${mongoUriDisplay}`);

const app = express();
const PORT = process.env.PORT || 10000;

// Connect to MongoDB
let dbConnected = false;

const attemptDbConnection = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
    dbConnected = true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Server will continue running, but database operations will fail');
    // Don't exit the process, let the server run without DB
  }
};

// Initial connection attempt
attemptDbConnection();

// Add middleware to check DB connection status
app.use((req, res, next) => {
  // Skip the check for static routes, root path, or health check
  if (req.path === '/' || req.path.startsWith('/static') || req.path === '/api/health') {
    return next();
  }

  if (!dbConnected) {
    // For API routes, return an error if DB is not connected
    if (req.path.startsWith('/api/')) {
      return res.status(503).json({
        error: 'Database connection unavailable',
        message: 'The server is running but cannot connect to the database. Please try again later.'
      });
    }
  }
  next();
});

// Configure CORS to allow requests from frontend
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
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:3000',
      // Add your local IP address
      'http://192.168.1.7:5173',
      'http://192.168.1.7:5174',
      'http://192.168.1.7:5175',
      'http://192.168.1.7:3000',
      // Add network 73 IP addresses
      'http://192.168.73.1:5173',
      'http://192.168.73.1:5174',
      'http://192.168.73.1:5175',
      'http://192.168.73.1:8080',
      'http://192.168.73.1:3000',
      'http://192.168.73.2:5173',
      'http://192.168.73.2:5174',
      'http://192.168.73.2:5175',
      'http://192.168.73.2:8080',
      'http://192.168.73.2:3000',
      // Allow any IP in the 192.168.73.x subnet
      'http://192.168.73.*:5173',
      'http://192.168.73.*:5174',
      'http://192.168.73.*:5175',
      'http://192.168.73.*:8080',
      'http://192.168.73.*:3000',
      // Add current hotspot IP
      'http://192.168.68.131:3000',
      'http://192.168.68.131:5173',
      'http://192.168.68.131:5174',
      'http://192.168.68.131:5175',
      // Allow any IP in the 192.168.68.x subnet
      'http://192.168.68.*:3000',
      'http://192.168.68.*:5173',
      'http://192.168.68.*:5174',
      'http://192.168.68.*:5175',
      // Allow port 8080 on local IP
      'http://192.168.1.7:8080',
      // Add your production domain when ready
      'https://adhithan-dev-portfolio.onrender.com' // Added production frontend URL
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

    // Check for wildcard patterns (e.g., 192.168.73.*)
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

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add the wildcard middleware to handle problematic routes
app.use(wildcardMiddleware);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/about', aboutRouter);
app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/auth', authRouter);

app.use('/api/upload', uploadRouter);
app.use('/api/webhook', webhookRouter);

// Debugging: Log request before hitting visitorsRouter
app.use('/api/visitors', (req, _, next) => {
  console.log('Request hitting /api/visitors route. Method:', req.method, 'URL:', req.originalUrl);
  console.log('Request body:', req.body);
  next();
}, visitorsRouter);

app.use('/api/notifications', notificationRouter);
app.use('/api/devices', deviceRouter);

// Serve static files from the dist directory if it exists
const distPath = join(dirname(__dirname), 'dist');
console.log('Checking for frontend build at:', distPath);

// Check multiple possible locations for the dist directory
const possibleDistPaths = [
  distPath,
  join(process.cwd(), 'dist'),
  '/opt/render/project/src/dist'
];

let foundDistPath = null;

for (const path of possibleDistPaths) {
  console.log(`Checking for frontend build at: ${path}`);
  if (fs.existsSync(path)) {
    console.log(`Frontend build found at: ${path}`);
    foundDistPath = path;
    break;
  } else {
    console.log(`No frontend build found at: ${path}`);
  }
}

if (foundDistPath) {
  console.log(`Serving static files from: ${foundDistPath}`);
  app.use(express.static(foundDistPath));

  // For any routes that don't match an API route or static file, serve the index.html
  app.get(/.*/, (req, res) => {
    // Skip for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }

    const indexPath = join(foundDistPath, 'index.html');
    console.log(`Serving index.html from: ${indexPath}`);

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.log(`ERROR: index.html not found at: ${indexPath}`);
      res.status(404).send('Frontend index.html not found');
    }
  });
} else {
  console.log('No frontend build found in any of the checked locations');
  // Basic route for testing when no frontend build exists
  app.get('/', (_, res) => {
    res.send('Portfolio API is running... (No frontend build found)');
  });
}

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

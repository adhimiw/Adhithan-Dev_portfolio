import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import connectDB from './config/db.js';
import {
  aboutRouter, contactRouter, projectsRouter, skillsRouter,
  authRouter, uploadRouter, webhookRouter, healthRouter,
  visitorsRouter, notificationRouter, deviceRouter
} from './routes/index.js'; // You can group exports like this if needed
import { initSocketIO } from './services/socketService.js';
import { wildcardMiddleware } from './middleware/routeHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(dirname(__dirname), '.env') });

const app = express();
const PORT = process.env.PORT || 10000;

const mongoUriDisplay = process.env.MONGO_URI
  ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')
  : 'Not defined';
console.log(`Using MongoDB URI: ${mongoUriDisplay}`);

let dbConnected = false;
const attemptDbConnection = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
    dbConnected = true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.warn('Continuing without DB access');
  }
};
await attemptDbConnection();

// DB check middleware
app.use((req, res, next) => {
  if (
    req.path === '/' || req.path.startsWith('/static') || req.path === '/api/health'
  ) return next();

  if (!dbConnected && req.path.startsWith('/api/')) {
    return res.status(503).json({
      error: 'Database connection unavailable',
      message: 'The server is running but cannot connect to the database. Please try again later.'
    });
  }
  next();
});

// CORS Setup
const corsOptions = {
  origin(origin, callback) {
    if (process.env.NODE_ENV !== 'production' || !origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      'http://localhost:3000', 'http://localhost:5173',
      'http://192.168.1.7:3000', 'http://192.168.73.1:5173',
      'http://192.168.68.131:5173', 'https://adhithan-dev-portfolio.onrender.com'
    ];

    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(`^${pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
        return regex.test(origin);
      }
      return pattern === origin;
    });

    isAllowed ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(wildcardMiddleware);

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/about', aboutRouter);
app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/visitors', visitorsRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/devices', deviceRouter);

// Serve static frontend if present
const distPaths = [
  join(dirname(__dirname), 'dist'),
  join(process.cwd(), 'dist'),
  '/opt/render/project/src/dist'
];

const foundDist = distPaths.find(p => fs.existsSync(p));
if (foundDist) {
  console.log(`📦 Serving static files from: ${foundDist}`);
  app.use(express.static(foundDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API not found' });
    const indexPath = join(foundDist, 'index.html');
    return fs.existsSync(indexPath)
      ? res.sendFile(indexPath)
      : res.status(404).send('Frontend index.html not found');
  });
} else {
  console.log('⚠️ No frontend build found');
  app.get('/', (_, res) => {
    res.send('Portfolio API is running... (Frontend not found)');
  });
}

const server = http.createServer(app);
initSocketIO(server);
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));

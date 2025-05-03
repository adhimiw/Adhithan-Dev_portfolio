import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Load JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Log whether we're using the environment variable or the fallback
console.log('JWT_SECRET source:', process.env.JWT_SECRET ? 'Using environment variable' : 'Using fallback value');

// Warning if using fallback in production
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: Using fallback JWT_SECRET in production environment!');
}

// Middleware to protect routes - verifies the JWT token
export const protect = async (req, res, next) => {
  let token;

  console.log('Auth middleware - Headers:', {
    authorization: req.headers.authorization,
    cookie: req.headers.cookie
  });

  // Check for token in Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found in Authorization header:', token);
  } else if (req.cookies && req.cookies.token) {
    // Get token from cookies
    token = req.cookies.token;
    console.log('Token found in cookies:', token);
  }

  // Check if token exists
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({
      error: 'Not authorized, no token provided'
    });
  }

  try {
    console.log('Attempting to verify token:', token);
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified, decoded ID:', decoded.id);

    // Get admin from token id and attach to request object
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      console.log('Admin not found for ID:', decoded.id);
      return res.status(401).json({
        error: 'Not authorized, admin account not found'
      });
    }

    console.log('Admin found:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Not authorized, invalid token'
    });
  }
};

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

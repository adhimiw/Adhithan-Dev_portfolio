import express from 'express';
import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new admin user
// @access  Public (would typically be restricted in a real app)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });

    if (adminExists) {
      return res.status(400).json({
        error: 'Admin user already exists'
      });
    }

    // Validate password strength
    const passwordValidation = Admin.validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: passwordValidation.message
      });
    }

    // Create new admin user
    const admin = await Admin.create({
      username,
      email,
      password,
      isVerified: true // For simplicity, we're setting this to true by default
    });

    // If admin is created successfully
    if (admin) {
      // Generate token
      const token = generateToken(admin._id);

      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' // Only use secure in production
      });

      // Return admin data (excluding password)
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        isVerified: admin.isVerified,
        token
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: error.message || 'Server error during registration'
    });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate admin user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const admin = await Admin.findOne({ email });

    // If no admin found with that email
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      const lockTime = new Date(admin.lockUntil);
      return res.status(401).json({
        error: `Account is locked. Try again after ${lockTime.toLocaleString()}`
      });
    }

    // Check if password is correct
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      await admin.incrementLoginAttempts();

      // Refresh admin data
      const updatedAdmin = await Admin.findOne({ email });

      // Check if account is now locked
      if (updatedAdmin.isLocked()) {
        const lockTime = new Date(updatedAdmin.lockUntil);
        return res.status(401).json({
          error: `Too many failed attempts. Account is locked until ${lockTime.toLocaleString()}`
        });
      }

      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!admin.isVerified) {
      return res.status(401).json({ error: 'Please verify your email address' });
    }

    // Record successful login
    await admin.recordLogin();

    // Generate token
    const token = generateToken(admin._id);

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production' // Only use secure in production
    });

    // Return admin data
    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      isVerified: admin.isVerified,
      lastLogin: admin.lastLogin,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: error.message || 'Server error during login'
    });
  }
});

// @route   GET api/auth/profile
// @desc    Get logged in admin user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');

    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ error: 'Admin user not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: error.message || 'Server error fetching profile'
    });
  }
});

// @route   PUT api/auth/profile
// @desc    Update admin user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Update username if provided
    if (req.body.username) {
      // Check if username is already taken
      const usernameExists = await Admin.findOne({
        username: req.body.username,
        _id: { $ne: admin._id } // Exclude current admin
      });

      if (usernameExists) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      admin.username = req.body.username;
    }

    // Update email if provided
    if (req.body.email && req.body.email !== admin.email) {
      // Check if email is already taken
      const emailExists = await Admin.findOne({
        email: req.body.email,
        _id: { $ne: admin._id } // Exclude current admin
      });

      if (emailExists) {
        return res.status(400).json({ error: 'Email is already taken' });
      }

      admin.email = req.body.email;
      // In a real application, you would set isVerified to false and send a verification email
      // admin.isVerified = false;
    }

    // Update password if provided
    if (req.body.password) {
      // Validate password strength
      const passwordValidation = Admin.validatePasswordStrength(req.body.password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          error: passwordValidation.message
        });
      }

      // Verify current password
      if (!req.body.currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
      }

      const isMatch = await admin.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      admin.password = req.body.password;
    }

    // Save the updated admin
    const updatedAdmin = await admin.save();

    res.json({
      _id: updatedAdmin._id,
      username: updatedAdmin.username,
      email: updatedAdmin.email,
      isVerified: updatedAdmin.isVerified,
      lastLogin: updatedAdmin.lastLogin
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: error.message || 'Server error updating profile'
    });
  }
});

// @route   POST api/auth/logout
// @desc    Logout and clear cookie
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;

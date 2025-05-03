import express from 'express';
import passport from 'passport';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/auth/github
// @desc    Authenticate with GitHub
// @access  Public
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @route   GET api/auth/github/callback
// @desc    GitHub auth callback
// @access  Public
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/admin/login' }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user._id);

      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'strict'
      });

      // Redirect to GitHub callback handler with token in query param for client-side storage
      res.redirect(`${process.env.VITE_API_URL.replace('5000', '5174')}/admin/github-callback?token=${token}`);
    } catch (error) {
      console.error('GitHub auth callback error:', error);
      res.redirect('/admin/login');
    }
  }
);

export default router;

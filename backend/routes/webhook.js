import express from 'express';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = express.Router();

// Helper function to verify GitHub webhook signature
const verifySignature = (req) => {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
};

// @route   POST api/webhook/github
// @desc    Handle GitHub webhook events
// @access  Public (but verified with secret)
router.post('/github', express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }), async (req, res) => {
  try {
    // Verify webhook signature
    if (!verifySignature(req)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.headers['x-github-event'];
    
    // Only process push events to the main branch
    if (event === 'push' && req.body.ref === 'refs/heads/main') {
      console.log('Received valid webhook push event to main branch');
      
      // Execute build script
      try {
        // Export data from MongoDB to JSON files
        await execAsync('npm run export-data');
        console.log('Data exported successfully');
        
        // Build the frontend
        await execAsync('npm run build');
        console.log('Build completed successfully');
        
        res.status(200).json({ message: 'Build triggered successfully' });
      } catch (error) {
        console.error('Build error:', error);
        res.status(500).json({ error: 'Build process failed' });
      }
    } else {
      // Acknowledge receipt but take no action
      res.status(200).json({ message: 'Event received but no action taken' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Server error processing webhook' });
  }
});

export default router;

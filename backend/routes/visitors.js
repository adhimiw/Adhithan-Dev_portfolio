import express from 'express';
import { protect } from '../middleware/auth.js';
import Visitor from '../models/Visitor.js';

const router = express.Router();

// @route   POST api/visitors
// @desc    Register a new visitor
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    
    // Get IP address and user agent
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer || req.headers.referrer;
    
    // Create new visitor
    const visitor = new Visitor({
      role,
      ipAddress,
      userAgent,
      referrer,
      pagesVisited: [{ page: req.headers.referer || '/' }]
    });
    
    await visitor.save();
    
    // Return visitor ID for tracking
    res.json({ visitorId: visitor._id });
  } catch (err) {
    console.error('Error registering visitor:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/visitors/stats
// @desc    Get visitor statistics
// @access  Private
// IMPORTANT: Define '/stats' before '/:id' to avoid route conflict
router.get('/stats', protect, async (req, res) => {
  try {
    // Get total visitors
    const totalVisitors = await Visitor.countDocuments();

    // Get visitors by role
    const visitorsByRole = await Visitor.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get visitors by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const visitorsByDate = await Visitor.aggregate([
      // Ensure visitDate exists and is a date, and is within the last 30 days
      {
        $match: {
          visitDate: { $exists: true, $type: "date", $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$visitDate' },
            month: { $month: '$visitDate' },
            day: { $dayOfMonth: '$visitDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1
        }
      }
    ]);

    // Get most visited pages
    const mostVisitedPages = await Visitor.aggregate([
      // Ensure pagesVisited exists and is an array before unwinding
      {
        $match: {
          pagesVisited: { $exists: true, $ne: null, $type: "array" }
        }
      },
      { $unwind: '$pagesVisited' },
      // Ensure the page field within the array element exists
      {
        $match: {
          "pagesVisited.page": { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$pagesVisited.page',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      totalVisitors,
      visitorsByRole,
      visitorsByDate,
      mostVisitedPages
    });
  } catch (err) {
    console.error('Error getting visitor statistics:', err); // Log the full error object
    res.status(500).send('Server Error');
  }
});

// @route   GET api/visitors/:id
// @desc    Get visitor by ID (Temporary debug route)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    res.json(visitor);
  } catch (err) {
    console.error('Error fetching visitor by ID:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/visitors/:id/page
// @desc    Track a page visit
// @access  Public
router.put('/:id/page', async (req, res) => {
  console.log('PUT /api/visitors/:id/page hit. Visitor ID:', req.params.id);
  try {
    const { pagePath } = req.body;
    
    if (!pagePath) {
      return res.status(400).json({ error: 'pagePath is required' });
    }
    
    const visitor = await Visitor.findById(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    visitor.pagesVisited.push({
      page: pagePath,
      timestamp: new Date()
    });

    console.log('Visitor object before save:', visitor); // Log visitor object
    visitor.markModified('pagesVisited'); // Explicitly mark pagesVisited as modified
    await visitor.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error tracking page visit:', err.message, err.stack); // Log error message and stack trace
    res.status(500).send('Server Error');
  }
});

export default router;

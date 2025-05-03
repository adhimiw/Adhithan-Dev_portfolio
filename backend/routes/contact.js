import express from 'express';
import Contact from '../models/Contact.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { sendEmail } from '../utils/emailService.js';
import { sendContactPushNotification } from '../services/pushNotificationService.js';

const router = express.Router();

// @route   GET api/contact
// @desc    Get contact information
// @access  Public
router.get('/', async (req, res) => {
  try {
    // There should only be one contact document
    const contact = await Contact.findOne();

    if (!contact) {
      return res.status(404).json({ msg: 'Contact information not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/contact
// @desc    Create or update contact information
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Check if contact document already exists
    let contact = await Contact.findOne();

    if (contact) {
      // Update existing document
      contact = await Contact.findOneAndUpdate(
        {}, // empty filter to match the first document
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new contact document
      contact = new Contact(req.body);
      await contact.save();
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/contact/social
// @desc    Add social link
// @access  Private
router.put('/social', protect, async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      return res.status(404).json({ msg: 'Contact information not found' });
    }

    // Add social link
    contact.socialLinks.push(req.body);
    await contact.save();

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/contact/social/:id
// @desc    Delete social link
// @access  Private
router.delete('/social/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findOne();

    if (!contact) {
      return res.status(404).json({ msg: 'Contact information not found' });
    }

    // Get remove index
    const removeIndex = contact.socialLinks
      .map(item => item.id)
      .indexOf(req.params.id);

    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Social link not found' });
    }

    // Remove social link
    contact.socialLinks.splice(removeIndex, 1);
    await contact.save();

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/contact/message
// @desc    Send a contact message
// @access  Public
router.post('/message', async (req, res) => {
  try {
    const { name, email, message, visitorId, role } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message' });
    }

    // Create new message
    const newMessage = new Message({
      name,
      email,
      message,
      visitorId,
      role
    });

    const savedMessage = await newMessage.save();

    // Create a basic notification for the contact message
    let notification = new Notification({
      type: 'contact',
      title: `New message from ${name}`,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      priority: 'medium',
      status: 'unread',
      metadata: {
        contactId: savedMessage._id,
        email,
        name,
      },
    });

    await notification.save();

    // Emit WebSocket event for real-time updates
    req.app.get('io').to('admin').emit('notification-created', notification);

    // Send push notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'adhithanraja6@gmail.com';
      const notificationData = {
        name,
        email,
        message,
        category: 'contact',
        priority: 'medium',
      };

      await sendContactPushNotification(notificationData, adminEmail);
    } catch (pushError) {
      console.error('Error sending push notification:', pushError);
      // Continue even if push notification fails
    }

    // Even if there were errors with AI analysis or email sending,
    // we still want to return success if the message was saved
    res.json({
      success: true,
      message: 'Message sent successfully',
      messageId: savedMessage._id
    });
  } catch (err) {
    console.error('Error sending message:', err.message);

    // If we've already saved the message but something else failed, still return success
    if (err.message.includes('to') && err.message.includes('undefined')) {
      // This is likely an email configuration error
      console.log('Email configuration error, but message was saved');
      res.json({
        success: true,
        message: 'Message saved but email notification failed',
        partial: true
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: err.message
      });
    }
  }
});

// @route   GET api/contact/messages
// @desc    Get all contact messages
// @access  Private
router.get('/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/contact/messages/:id/read
// @desc    Mark a message as read
// @access  Private
router.put('/messages/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.read = true;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error('Error marking message as read:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;

import express from 'express';
import Contact from '../models/Contact.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// @route   GET api/contact
// @desc    Get contact information
// @access  Public
router.get('/', async (req, res) => {
  try {
    // There should only be one contact document
    const contact = await Contact.findOne();

    if (!contact) {
      return res.status(404).json({ error: 'Contact information not found' });
    }

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
    if (req.app && req.app.get('io')) {
      req.app.get('io').to('admin').emit('notification-created', notification);
    }

    // Send email notification to admin
    try {
      // Create a transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER || 'adhithanraja6@gmail.com',
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      // Get admin email from environment or use default
      const adminEmail = process.env.ADMIN_EMAIL || 'adhithanraja6@gmail.com';

      console.log('Sending email notification to:', adminEmail);

      // Create email HTML content
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Role:</strong> ${role || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/messages"
               style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View in Admin Panel
            </a>
          </p>
        </div>
      `;

      // Send email notification
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'Adhithan Raja <adhithanraja6@gmail.com>',
        to: adminEmail,
        subject: `New Contact Message from ${name}`,
        html: htmlContent
      });

      console.log('Email sent successfully:', info.response || info.messageId);
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Continue even if notifications fail
    }

    // Even if there were errors with email sending,
    // we still want to return success if the message was saved
    res.json({
      success: true,
      message: 'Message sent successfully',
      messageId: savedMessage._id
    });
  } catch (err) {
    console.error('Error sending message:', err.message);

    // Always return a server error for now
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
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
    console.error('Error saving contact information:', err.message);
    res.status(500).json({ error: 'Server Error' });
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

// @route   DELETE api/contact/messages/:id
// @desc    Delete a contact message
// @access  Private
router.delete('/messages/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.remove();

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;

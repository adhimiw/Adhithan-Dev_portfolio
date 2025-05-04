import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';
import Contact from '../models/Contact.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

// Get all notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Get a single notification
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Error fetching notification' });
  }
});

// Create a new notification
router.post('/', authenticateToken, async (req, res) => {
  try {
    const notification = new Notification({
      type: req.body.type,
      title: req.body.title,
      message: req.body.message,
      priority: req.body.priority,
      status: req.body.status,
      metadata: req.body.metadata || {},
    });

    const savedNotification = await notification.save();

    // Emit WebSocket event for real-time updates
    req.app.get('io').to('admin').emit('notification-created', savedNotification);

    res.status(201).json(savedNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
});

// Update a notification
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update fields
    if (req.body.type) notification.type = req.body.type;
    if (req.body.title) notification.title = req.body.title;
    if (req.body.message) notification.message = req.body.message;
    if (req.body.priority) notification.priority = req.body.priority;
    if (req.body.status) notification.status = req.body.status;
    if (req.body.metadata) notification.metadata = { ...notification.metadata, ...req.body.metadata };

    const updatedNotification = await notification.save();

    // Emit WebSocket event for real-time updates
    req.app.get('io').to('admin').emit('notification-updated', updatedNotification);

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Delete a notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();

    // Emit WebSocket event for real-time updates
    req.app.get('io').to('admin').emit('notification-deleted', { _id: req.params.id });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// Send a response to a contact from a notification
router.post('/:id/respond', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if this is a contact notification
    if (!notification.metadata.contactId) {
      return res.status(400).json({ message: 'This notification is not associated with a contact' });
    }

    // Get the contact
    const contact = await Contact.findById(notification.metadata.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Associated contact not found' });
    }

    // Send email response
    const emailResult = await sendEmail({
      to: contact.email,
      subject: `Re: Your message to Adhithan Raja`,
      text: req.body.message,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333;">Response to Your Message</h2>
        <p>Hello ${contact.name},</p>
        <p>Thank you for reaching out. Here is my response to your message:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${req.body.message.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top: 20px;">If you have any further questions, feel free to reply to this email or contact me through my portfolio website.</p>
        <p>Best regards,<br>Adhithan Raja</p>
      </div>`,
    });

    // Log email sending result
    if (emailResult.error) {
      console.warn(`Email response to ${contact.email} failed:`, emailResult.message);
      // Continue with the process even if email fails
    } else {
      console.log(`Email response to ${contact.email} sent successfully`);
    }

    // Update notification status and add response message
    notification.status = 'responded';
    notification.metadata.responseMessage = req.body.message;
    const updatedNotification = await notification.save();

    // Update contact status
    contact.status = 'responded';
    contact.responseMessage = req.body.message;
    contact.respondedAt = new Date();
    await contact.save();

    // Emit WebSocket event for real-time updates
    req.app.get('io').to('admin').emit('notification-updated', updatedNotification);

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error sending response:', error);
    res.status(500).json({ message: 'Error sending response' });
  }
});

export default router;

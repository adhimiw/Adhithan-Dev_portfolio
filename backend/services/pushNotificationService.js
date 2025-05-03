/**
 * Push Notification Service
 * Handles sending push notifications to mobile devices
 */

import { Client } from 'onesignal-node';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OneSignal client
const oneSignalClient = new Client({
  app: {
    appAuthKey: process.env.ONESIGNAL_REST_API_KEY || '',
    appId: process.env.ONESIGNAL_APP_ID || '',
  }
});

/**
 * Send a push notification to a specific user
 * @param {Object} options - Notification options
 * @param {string} options.heading - Notification title
 * @param {string} options.content - Notification content
 * @param {string} options.userId - User ID to send notification to (email)
 * @param {Object} options.data - Additional data to send with notification
 * @param {string} options.url - URL to open when notification is clicked
 * @returns {Promise} - Promise that resolves with notification response
 */
export const sendPushNotification = async ({ heading, content, userId, data = {}, url = '' }) => {
  try {
    // Check if OneSignal is configured
    if (!process.env.ONESIGNAL_APP_ID || !process.env.ONESIGNAL_REST_API_KEY) {
      console.warn('OneSignal not configured. Push notification not sent.');
      return { success: false, message: 'OneSignal not configured' };
    }

    // Create notification
    const notification = {
      headings: {
        en: heading,
      },
      contents: {
        en: content,
      },
      data,
      url,
      // Target by email (userId should be the admin email)
      filters: [
        { field: 'tag', key: 'email', relation: '=', value: userId }
      ]
    };

    // Send notification
    const response = await oneSignalClient.createNotification(notification);
    console.log('Push notification sent:', response.body);
    
    return { success: true, data: response.body };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a contact form notification to admin
 * @param {Object} contactData - Contact form data
 * @param {string} adminEmail - Admin email to send notification to
 * @returns {Promise} - Promise that resolves with notification response
 */
export const sendContactPushNotification = async (contactData, adminEmail) => {
  try {
    const { name, email, message, category, priority } = contactData;
    
    // Create notification content
    const heading = `New ${category || 'contact'} message from ${name}`;
    const content = message.length > 100 ? `${message.substring(0, 100)}...` : message;
    
    // Add priority emoji
    const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟠' : '🟢';
    
    // Send push notification
    return await sendPushNotification({
      heading: `${priorityEmoji} ${heading}`,
      content,
      userId: adminEmail,
      data: {
        type: 'contact',
        contactData,
      },
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/messages`,
    });
  } catch (error) {
    console.error('Error sending contact push notification:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendPushNotification,
  sendContactPushNotification,
};

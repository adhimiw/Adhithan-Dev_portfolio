/**
 * Email Service
 * Handles sending emails from the application
 */

import nodemailer from 'nodemailer';

// Create a test account if no email credentials are provided
let testAccount = null;

// Initialize email transporter
const initializeTransporter = async () => {
  // If we're in development and no email credentials are provided, use Ethereal for testing
  if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_USER) {
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
    }

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Use provided email credentials
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'adhithanraja6@gmail.com',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  });
};

/**
 * Send an email
 * @param {Object} options Email options
 * @param {string} options.to Recipient email
 * @param {string} options.subject Email subject
 * @param {string} options.text Plain text content
 * @param {string} options.html HTML content
 * @returns {Promise<Object>} Email send info
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Validate required fields
    if (!to) {
      throw new Error('Recipient email (to) is required');
    }

    if (!subject) {
      throw new Error('Email subject is required');
    }

    if (!text && !html) {
      throw new Error('Email content (text or html) is required');
    }

    const transporter = await initializeTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Adhithan Raja <adhithanraja6@gmail.com>',
      to,
      subject,
      text: text || '',
      html: html || '',
    };

    // Check if we have a valid email password
    if (!process.env.EMAIL_PASSWORD && !testAccount) {
      console.warn('No email password provided. Email sending will be skipped.');
      return {
        accepted: [],
        rejected: [to],
        response: 'Email sending skipped - no password configured',
        skipped: true
      };
    }

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL in development
    if (testAccount) {
      console.log('Email preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default {
  sendEmail,
};

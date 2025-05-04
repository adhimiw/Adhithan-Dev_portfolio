/**
 * Email Service
 * Handles sending emails from the application
 */

import nodemailer from 'nodemailer';

// Create a test account if no email credentials are provided
let testAccount = null;
let transporter = null;

/**
 * Initialize email transporter
 * @returns {Promise<nodemailer.Transporter>} Nodemailer transporter
 */
const initializeTransporter = async () => {
  // If transporter already exists, return it
  if (transporter) {
    return transporter;
  }

  // If we're in development and no email credentials are provided, use Ethereal for testing
  if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_USER) {
    if (!testAccount) {
      try {
        testAccount = await nodemailer.createTestAccount();
        console.log('Created test email account:', testAccount.user);
      } catch (error) {
        console.error('Failed to create test email account:', error);
        // Fallback to a simple transport that logs to console
        return createConsoleTransport();
      }
    }

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    return transporter;
  }

  // For production, try to use Gmail with app password
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || 'adhithanraja6@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || '',
      },
    });

    // Verify the connection
    await transporter.verify();
    console.log('Email service connected successfully');

    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter:', error);

    // Fallback to a simple transport that logs to console
    return createConsoleTransport();
  }
};

/**
 * Create a console transport for development/fallback
 * @returns {nodemailer.Transporter} Console transport
 */
const createConsoleTransport = () => {
  console.log('Using console transport for emails (emails will be logged to console)');

  return nodemailer.createTransport({
    name: 'console-transport',
    version: '1.0.0',
    send: (mail, callback) => {
      const input = mail.message.createReadStream();
      let message = '';

      input.on('data', (chunk) => {
        message += chunk;
      });

      input.on('end', () => {
        console.log('----------------------');
        console.log('Email would be sent:');
        console.log('----------------------');
        console.log(message);
        console.log('----------------------');

        callback(null, { response: 'Email logged to console' });
      });
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

    const emailTransporter = await initializeTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Adhithan Raja <adhithanraja6@gmail.com>',
      to,
      subject,
      text: text || '',
      html: html || '',
    };

    console.log(`Sending email to ${to} with subject: ${subject}`);
    const info = await emailTransporter.sendMail(mailOptions);

    // Log preview URL in development
    if (testAccount) {
      console.log('Email preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);

    // Return a structured error response instead of throwing
    return {
      error: true,
      message: error.message,
      details: error.toString()
    };
  }
};

export default {
  sendEmail,
};

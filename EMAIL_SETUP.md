# Email Notification Setup Guide

This guide explains how to set up email notifications for your portfolio application.

## Gmail Setup

The application uses Gmail for sending email notifications. To set this up:

1. **Create or use an existing Gmail account**
   - You'll need a Gmail account to send emails from

2. **Generate an App Password**
   - Google doesn't allow regular passwords for less secure apps
   - You need to generate an App Password instead
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app and "Other" as the device (name it "Portfolio App")
   - Copy the generated 16-character password

3. **Update your .env file**
   - Add the following to your .env file:
   ```
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_APP_PASSWORD=your-16-character-app-password
   EMAIL_FROM=Your Name <your-gmail-address@gmail.com>
   ```

## Testing Email Functionality

To test if your email setup is working:

1. Start your application
2. Go to the contact page and submit a test message
3. Check the admin panel for the new message notification
4. Try responding to the message through the admin panel
5. Verify that you receive the response email

## Troubleshooting

If emails are not being sent:

1. **Check server logs**
   - Look for any error messages related to email sending

2. **Verify your app password**
   - Make sure you've entered the correct app password in your .env file
   - App passwords are 16 characters without spaces

3. **Check Gmail settings**
   - Ensure your Gmail account doesn't have additional security restrictions
   - Check if your Gmail account has reached its sending limits

4. **Development mode fallback**
   - In development mode, if no email credentials are provided, the application will use Ethereal for testing
   - Check the console for a preview URL to view the email

## Email Templates

The application uses HTML email templates for:

1. **Contact form notifications** - Sent to the admin when someone submits a contact form
2. **Response emails** - Sent to users when the admin responds to their messages

You can customize these templates by editing the HTML in:
- `backend/routes/contact.js` - For contact form notifications
- `backend/routes/notificationRoutes.js` - For response emails

/**
 * Email Diagnostic Script for Render Deployment
 * 
 * This script checks your email configuration and attempts to send a test email.
 * It provides detailed error information to help diagnose issues.
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function diagnoseEmailConfig() {
  console.log('==========================================');
  console.log('EMAIL CONFIGURATION DIAGNOSTIC');
  console.log('==========================================');
  
  // Check environment variables
  console.log('\n1. CHECKING ENVIRONMENT VARIABLES:');
  const requiredVars = ['EMAIL_USER', 'EMAIL_APP_PASSWORD', 'EMAIL_FROM'];
  let missingVars = false;
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.log(`❌ ${varName} is missing`);
      missingVars = true;
    } else {
      // Mask password for security
      const value = varName === 'EMAIL_APP_PASSWORD' 
        ? '********' 
        : process.env[varName];
      console.log(`✅ ${varName} = ${value}`);
    }
  }
  
  if (missingVars) {
    console.log('\n⚠️ Some required environment variables are missing.');
    console.log('Please add them to your Render environment variables.');
    return;
  }
  
  // Check EMAIL_FROM format
  console.log('\n2. CHECKING EMAIL_FROM FORMAT:');
  const emailFromRegex = /^.+\s<[^@\s]+@[^@\s]+\.[^@\s]+>$/;
  if (!emailFromRegex.test(process.env.EMAIL_FROM)) {
    console.log(`❌ EMAIL_FROM format is incorrect: ${process.env.EMAIL_FROM}`);
    console.log('It should be in the format: "Name <email@example.com>"');
  } else {
    console.log(`✅ EMAIL_FROM format is correct: ${process.env.EMAIL_FROM}`);
  }
  
  // Test SMTP connection
  console.log('\n3. TESTING SMTP CONNECTION:');
  try {
    console.log('Creating transporter with the following configuration:');
    console.log({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: '********' // Masked for security
      }
    });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Try sending a test email
    console.log('\n4. SENDING TEST EMAIL:');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: 'Render Deployment Email Test',
      text: 'This is a test email from your Render deployment.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2>Render Deployment Email Test</h2>
          <p>This is a test email sent from your Render deployment at ${new Date().toISOString()}.</p>
          <p>If you're seeing this, your email configuration is working correctly in production!</p>
        </div>
      `,
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.log('❌ Error during SMTP test:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Error command:', error.command);
    console.log('Full error:', error);
    
    // Provide troubleshooting guidance based on error
    console.log('\n5. TROUBLESHOOTING GUIDANCE:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('• The connection to the SMTP server was refused.');
      console.log('• This could be due to network restrictions on Render.');
      console.log('• Try using a different port (587) or a different email service.');
    } 
    else if (error.code === 'ETIMEDOUT') {
      console.log('• The connection to the SMTP server timed out.');
      console.log('• This could be due to network restrictions on Render.');
      console.log('• Try using a different port (587) or a different email service.');
    }
    else if (error.code === 'EAUTH') {
      console.log('• Authentication failed.');
      console.log('• Check that your EMAIL_APP_PASSWORD is correct.');
      console.log('• Ensure you\'re using an App Password, not your regular Gmail password.');
      console.log('• Verify that 2-Step Verification is enabled on your Google account.');
    }
    else if (error.message.includes('Invalid login')) {
      console.log('• Invalid login credentials.');
      console.log('• Check that your EMAIL_USER and EMAIL_APP_PASSWORD are correct.');
      console.log('• Make sure you\'re using an App Password generated specifically for this app.');
    }
    else {
      console.log('• This is an unexpected error.');
      console.log('• Try using a different email service or configuration.');
      console.log('• Consider using a third-party email service like SendGrid or Mailgun.');
    }
  }
  
  console.log('\n==========================================');
  console.log('DIAGNOSTIC COMPLETE');
  console.log('==========================================');
}

// Run the diagnostic
diagnoseEmailConfig().catch(console.error);

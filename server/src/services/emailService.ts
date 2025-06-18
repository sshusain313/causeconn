import nodemailer from 'nodemailer';
import { generateOTP } from '../utils/otpUtils';

// Track recently sent emails to prevent duplicates
const recentEmails = new Map<string, number>();

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Helper function to prevent duplicate emails
const preventDuplicateEmails = (email: string): boolean => {
  const now = Date.now();
  const lastSent = recentEmails.get(email);
  
  if (lastSent && now - lastSent < 5000) {
    console.log(`DUPLICATE PREVENTION: Email to ${email} was already sent in the last 5 seconds. Skipping.`);
    return true; // Skip sending
  }
  
  // Update the timestamp for this email
  recentEmails.set(email, now);
  
  // Clean up old entries every 100 emails to prevent memory leaks
  if (recentEmails.size > 100) {
    const fiveMinutesAgo = now - 300000;
    for (const [key, timestamp] of recentEmails.entries()) {
      if (timestamp < fiveMinutesAgo) {
        recentEmails.delete(key);
      }
    }
  }
  
  return false; // Continue sending
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    // Check for duplicate emails
    if (preventDuplicateEmails(email)) {
      return true; // Pretend we sent it successfully
    }
    
    console.log(`SENDING EMAIL: Preparing to send email to ${email} with OTP ${otp}`);
    
    const mailOptions = {
      from: '"CauseBags" <noreply@causebags.com>',
      to: email,
      subject: 'Verify Your Tote Claim',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Thank you for claiming a tote! Please use the following verification code to complete your claim:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${otp}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`EMAIL SENT SUCCESSFULLY: MessageID ${info.messageId} to ${email}`);
    return true;
  } catch (error) {
    console.error(`ERROR SENDING EMAIL to ${email}:`, error);
    throw error;
  }
};

/**
 * Send an approval email to the sponsor
 * @param email Sponsor's email address
 * @param data Sponsorship data including organization name, cause title, etc.
 */
export const sendLogoApprovalEmail = async (
  email: string, 
  data: {
    organizationName: string;
    causeTitle: string;
  }
) => {
  try {
    // Check for duplicate emails
    if (preventDuplicateEmails(email)) {
      return true;
    }
    
    console.log(`SENDING APPROVAL EMAIL: Preparing to send email to ${email}`);
    
    const mailOptions = {
      from: '"CauseBags" <noreply@causebags.com>',
      to: email,
      subject: 'Congratulations! Your Logo Has Been Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Congratulations, ${data.organizationName}!</h2>
          <p>Your logo for the <strong>${data.causeTitle}</strong> campaign has been approved.</p>
          
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p style="margin-top: 0;"><strong>What happens next?</strong></p>
            <ul>
              <li>Your logo will now appear on the campaign page</li>
              <li>Your logo will be printed on the tote bags as per your specifications</li>
              <li>You'll receive updates as the campaign progresses</li>
            </ul>
          </div>
          
          <p>Thank you for your support of this important cause!</p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The CauseBags Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`APPROVAL EMAIL SENT SUCCESSFULLY: MessageID ${info.messageId} to ${email}`);
    return true;
  } catch (error) {
    console.error(`ERROR SENDING APPROVAL EMAIL to ${email}:`, error);
    throw error;
  }
};

/**
 * Send a rejection email to the sponsor with a reupload link
 * @param email Sponsor's email address
 * @param data Sponsorship data including ID, organization name, cause title, rejection reason
 */
export const sendLogoRejectionEmail = async (
  email: string, 
  data: {
    sponsorshipId: string;
    organizationName: string;
    causeTitle: string;
    rejectionReason: string;
  }
) => {
  try {
    // Check for duplicate emails
    if (preventDuplicateEmails(email)) {
      return true;
    }
    
    console.log(`SENDING REJECTION EMAIL: Preparing to send email to ${email}`);
    
    // Create a secure reupload link
    const reuploadLink = `https://changebag.org/sponsor/logo-reupload/${data.sponsorshipId}`;
    
    const mailOptions = {
      from: '"CauseBags" <noreply@causebags.com>',
      to: email,
      subject: 'Action Required: Your Logo Needs Revision',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Logo Update Required</h2>
          <p>Dear ${data.organizationName},</p>
          
          <p>Thank you for your support of the <strong>${data.causeTitle}</strong> campaign.</p>
          
          <p>We've reviewed your submitted logo and unfortunately, we're unable to approve it in its current form.</p>
          
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p style="margin-top: 0;"><strong>Reason for rejection:</strong></p>
            <p>${data.rejectionReason}</p>
          </div>
          
          <p><strong>What to do next:</strong></p>
          <p>Please upload a revised logo that addresses the issues mentioned above using the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${reuploadLink}"
              style="background-color: #0070f3; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;"
            >
              Upload New Logo
            </a>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>The CauseBags Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`REJECTION EMAIL SENT SUCCESSFULLY: MessageID ${info.messageId} to ${email}`);
    return true;
  } catch (error) {
    console.error(`ERROR SENDING REJECTION EMAIL to ${email}:`, error);
    throw error;
  }
}; 
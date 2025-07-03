import { Request, Response } from 'express';
import OTPVerification from '../models/OTPVerification';
import { generateOTP, hashOTP, generateExpiryTime } from '../utils/otpUtils';
import { sendVerificationEmail } from '../services/emailService';
import { sendVerificationSMS } from '../services/smsService';

// Standardize phone number format
const standardizePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Remove leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Remove leading 91 if present (to avoid double country code)
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }
  
  // Ensure it's a 10-digit number
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it's already 12 digits with country code, add +
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  // If it's already 13 digits with +91, return as is
  if (cleaned.length === 13 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  // Default: assume it's a 10-digit number and add +91
  return `+91${cleaned}`;
};

// Send OTP for email or SMS verification
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email, phone, method = 'sms' } = req.body; // TEMPORARILY DEFAULT TO SMS
    console.log('=== SEND OTP REQUEST RECEIVED ===');
    console.log('Request body:', req.body);
    console.log('Parsed data:', { email, phone, method });

    // TEMPORARILY DISABLE EMAIL VERIFICATION
    // TODO: Restore email verification by removing this check
    if (method === 'email') {
      console.log('Email verification temporarily disabled');
      return res.status(400).json({ 
        message: 'Email verification is temporarily disabled. Please use SMS verification.',
        method: 'sms'
      });
    }

    if (method === 'email') {
      // TEMPORARILY COMMENTED OUT: Email verification logic
      // TODO: Restore this section when email verification is re-enabled
      /*
      if (!email) {
        console.log('Email is missing in request');
        return res.status(400).json({ message: 'Email is required for email verification' });
      }

      // Check if there's a recent OTP that's not expired yet (within the last 2 minutes)
      const twoMinutesAgo = new Date();
      twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
      
      const recentOTP = await OTPVerification.findOne({
        email,
        type: 'email',
        expiresAt: { $gt: new Date() },
        createdAt: { $gt: twoMinutesAgo }
      });
      
      if (recentOTP) {
        console.log('Recent OTP already exists for this email. Returning existing OTP info.');
        return res.status(200).json({
          message: 'OTP already sent. Please check your email or wait before requesting a new code.',
          email,
          method: 'email'
        });
      }

      // Generate OTP
      const otp = generateOTP();
      console.log('Generated OTP (not hashed):', otp);
      const hashedOTP = hashOTP(otp);
      console.log('Hashed OTP for storage:', hashedOTP);
      const expiryTime = generateExpiryTime();

      // Save OTP details
      const otpRecord = await OTPVerification.create({
        email,
        otp: hashedOTP,
        expiresAt: expiryTime,
        type: 'email',
      });
      console.log('OTP record created:', otpRecord);

      // Send email with OTP
      await sendVerificationEmail(email, otp);
      console.log('Verification email sent with OTP');

      res.status(200).json({
        message: 'OTP sent successfully to email',
        email,
        method: 'email'
      });
      */
    } else if (method === 'sms') {
      if (!phone) {
        console.log('Phone is missing in request');
        return res.status(400).json({ message: 'Phone number is required for SMS verification' });
      }

      // Format phone number consistently
      const formattedPhone = standardizePhoneNumber(phone);
      console.log('=== SMS OTP PROCESSING ===');
      console.log('Original phone:', phone);
      console.log('Formatted phone for SMS OTP:', formattedPhone);

      // Check if there's a recent OTP that's not expired yet (within the last 2 minutes)
      const twoMinutesAgo = new Date();
      twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
      
      console.log('Checking for recent OTPs...');
      const recentOTP = await OTPVerification.findOne({
        phone: formattedPhone,
        type: 'sms',
        expiresAt: { $gt: new Date() },
        createdAt: { $gt: twoMinutesAgo }
      });
      
      if (recentOTP) {
        console.log('Recent OTP already exists for this phone. Returning existing OTP info.');
        return res.status(200).json({
          message: 'OTP already sent. Please check your phone or wait before requesting a new code.',
          phone: formattedPhone,
          method: 'sms'
        });
      }

      // Generate OTP
      const otp = generateOTP();
      console.log('Generated SMS OTP (not hashed):', otp);
      const hashedOTP = hashOTP(otp);
      console.log('Hashed SMS OTP for storage:', hashedOTP);
      const expiryTime = generateExpiryTime();
      console.log('OTP expiry time:', expiryTime);

      console.log('Attempting to save OTP record...');
      // Save OTP details with formatted phone
      const otpRecord = await OTPVerification.create({
        phone: formattedPhone,
        otp: hashedOTP,
        expiresAt: expiryTime,
        type: 'sms',
      });
      console.log('SMS OTP record created successfully:', otpRecord);

      console.log('Attempting to send SMS...');
      // Send SMS with OTP
      await sendVerificationSMS(formattedPhone, otp);
      console.log('Verification SMS sent with OTP');

      console.log('=== SMS OTP PROCESSING COMPLETE ===');
      res.status(200).json({
        message: 'OTP sent successfully to phone',
        phone: formattedPhone,
        method: 'sms'
      });
    } else {
      return res.status(400).json({ message: 'Invalid verification method. Use "sms"' });
    }
  } catch (error) {
    console.error('=== ERROR IN SEND OTP ===');
    console.error('Error details:', error);
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify OTP for email or SMS
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, phone, otp, method = 'sms' } = req.body; // TEMPORARILY DEFAULT TO SMS
    console.log('Verifying OTP:', { email, phone, otp, method });

    // TEMPORARILY DISABLE EMAIL VERIFICATION
    // TODO: Restore email verification by removing this check
    if (method === 'email') {
      console.log('Email verification temporarily disabled');
      return res.status(400).json({ 
        message: 'Email verification is temporarily disabled. Please use SMS verification.',
        method: 'sms'
      });
    }

    if (method === 'email') {
      // TEMPORARILY COMMENTED OUT: Email verification logic
      // TODO: Restore this section when email verification is re-enabled
      /*
      if (!email || !otp) {
        console.log('Missing email or OTP');
        return res.status(400).json({ message: 'Email and OTP are required' });
      }

      // Find all OTP records for this email to debug
      const allRecords = await OTPVerification.find({ email, type: 'email' });
      console.log(`Found ${allRecords.length} OTP records for email:`, email);
      
      if (allRecords.length === 0) {
        console.log('No OTP records found for this email');
        return res.status(400).json({ message: 'No verification code was sent to this email' });
      }
      
      // Check each record manually to debug the issue
      let matchFound = false;
      let expiredFound = false;
      let verifiedFound = false;
      
      // Calculate the hash of the provided OTP
      const hashedOTP = hashOTP(otp);
      console.log('Hashed OTP from request:', hashedOTP);
      
      for (const record of allRecords) {
        console.log('Checking record:', {
          id: record._id,
          storedHash: record.otp,
          expiresAt: record.expiresAt,
          verified: record.verified,
          now: new Date()
        });
        
        if (record.otp === hashedOTP) {
          matchFound = true;
          
          if (record.verified) {
            verifiedFound = true;
            console.log('OTP already verified');
          } else if (record.expiresAt < new Date()) {
            expiredFound = true;
            console.log('OTP expired');
          } else {
            // Valid OTP found
            console.log('Valid OTP found, marking as verified');
            record.verified = true;
            await record.save();
            
            return res.status(200).json({
              message: 'Email verified successfully',
              email,
              method: 'email'
            });
          }
        }
      }
      
      // Determine the appropriate error message
      if (!matchFound) {
        console.log('No matching OTP found');
        return res.status(400).json({ message: 'Invalid verification code' });
      } else if (expiredFound) {
        return res.status(400).json({ message: 'Verification code has expired' });
      } else if (verifiedFound) {
        return res.status(400).json({ message: 'Verification code has already been used' });
      }
      
      // This should not be reached, but just in case
      return res.status(400).json({ message: 'Invalid or expired verification code' });
      */
    } else if (method === 'sms') {
      if (!phone || !otp) {
        console.log('Missing phone or OTP');
        return res.status(400).json({ message: 'Phone number and OTP are required' });
      }

      // Format phone number consistently (same as when sending)
      const formattedPhone = standardizePhoneNumber(phone);
      console.log('Formatted phone for SMS OTP verification:', formattedPhone);

      // Find all OTP records for this phone
      const allRecords = await OTPVerification.find({ phone: formattedPhone, type: 'sms' });
      console.log(`Found ${allRecords.length} OTP records for phone:`, formattedPhone);
      
      if (allRecords.length === 0) {
        console.log('No OTP records found for this phone');
        return res.status(400).json({ message: 'No verification code was sent to this phone' });
      }
      
      // Check each record
      let matchFound = false;
      let expiredFound = false;
      let verifiedFound = false;
      
      // Calculate the hash of the provided OTP
      const hashedOTP = hashOTP(otp);
      console.log('Hashed SMS OTP from request:', hashedOTP);
      
      for (const record of allRecords) {
        console.log('Checking SMS record:', {
          id: record._id,
          storedHash: record.otp,
          expiresAt: record.expiresAt,
          verified: record.verified,
          now: new Date()
        });
        
        if (record.otp === hashedOTP) {
          matchFound = true;
          
          if (record.verified) {
            verifiedFound = true;
            console.log('SMS OTP already verified');
          } else if (record.expiresAt < new Date()) {
            expiredFound = true;
            console.log('SMS OTP expired');
          } else {
            // Valid OTP found
            console.log('Valid SMS OTP found, marking as verified');
            record.verified = true;
            await record.save();
            
            return res.status(200).json({
              message: 'Phone verified successfully',
              phone,
              method: 'sms'
            });
          }
        }
      }
      
      // Determine the appropriate error message
      if (!matchFound) {
        console.log('No matching SMS OTP found');
        return res.status(400).json({ message: 'Invalid verification code' });
      } else if (expiredFound) {
        return res.status(400).json({ message: 'Verification code has expired' });
      } else if (verifiedFound) {
        return res.status(400).json({ message: 'Verification code has already been used' });
      }
      
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    } else {
      return res.status(400).json({ message: 'Invalid verification method. Use "sms"' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// Legacy functions for backward compatibility
export const sendPhoneOTP = async (req: Request, res: Response) => {
  // Redirect to the new unified sendOTP function
  req.body.method = 'sms';
  return sendOTP(req, res);
};

export const verifyPhoneOTP = async (req: Request, res: Response) => {
  // Redirect to the new unified verifyOTP function
  req.body.method = 'sms';
  return verifyOTP(req, res);
};

// Debug endpoint to check OTP records (remove in production)
export const debugOTPRecords = async (req: Request, res: Response) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone parameter is required' });
    }

    // Use the same standardization function
    const formattedPhone = standardizePhoneNumber(phone.toString());
    console.log('Debug: Original phone:', phone, 'Standardized:', formattedPhone);
    
    const records = await OTPVerification.find({ phone: formattedPhone }).sort({ createdAt: -1 });
    
    // Also check for any records with similar phone numbers for debugging
    const allRecords = await OTPVerification.find({}).sort({ createdAt: -1 }).limit(10);
    
    res.status(200).json({
      originalPhone: phone,
      standardizedPhone: formattedPhone,
      recordCount: records.length,
      records: records.map(record => ({
        id: record._id,
        phone: record.phone,
        type: record.type,
        verified: record.verified,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
        isExpired: record.expiresAt < new Date()
      })),
      recentRecords: allRecords.map(record => ({
        id: record._id,
        phone: record.phone,
        type: record.type,
        verified: record.verified,
        createdAt: record.createdAt
      }))
    });
  } catch (error) {
    console.error('Error in debug OTP records:', error);
    res.status(500).json({ message: 'Error fetching OTP records' });
  }
};
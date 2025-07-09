import { Request, Response } from 'express';
import Waitlist, { WaitlistStatus } from '../models/Waitlist';
import Cause from '../models/Cause';
import { sendEmail } from '../lib/email';
import crypto from 'crypto';

// Magic link service functions
const generateToken = (userId: string, waitlistId: string): string => {
  return crypto.randomBytes(32).toString('hex');
};

const createMagicLink = (userId: string, waitlistId: string, causeId: string, email: string) => {
  const token = generateToken(userId, waitlistId);
  const expires = new Date();
  expires.setHours(expires.getHours() + 48); // 48 hour expiration
  
  return {
    token,
    userId,
    waitlistId,
    causeId,
    email,
    expires
  };
};

const getMagicLinkUrl = (payload: any): string => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8085';
  return `${baseUrl}/claim/magic-link?token=${payload.token}&causeId=${payload.causeId}`;
};

// Join waitlist for a cause
export const joinWaitlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { causeId, fullName, email, phone, message, notifyEmail, notifySms } = req.body;

    // Validate required fields
    if (!causeId || !fullName || !email || !phone) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if cause exists and is not sponsored
    const cause = await Cause.findById(causeId);
    if (!cause) {
      res.status(404).json({ message: 'Cause not found' });
      return;
    }

    // Check if user is already on the waitlist for this cause
    const existingEntry = await Waitlist.findOne({ causeId, email });
    if (existingEntry) {
      res.status(400).json({ message: 'You are already on the waitlist for this cause' });
      return;
    }

    // Get next position in waitlist
    const position = await Waitlist.getNextPosition(causeId);

    // Create waitlist entry
    const waitlistEntry = await Waitlist.create({
      causeId,
      fullName,
      email,
      phone,
      message,
      notifyEmail: notifyEmail ?? true,
      notifySms: notifySms ?? false,
      position,
      status: WaitlistStatus.WAITING
    });

    res.status(201).json({
      message: 'Successfully joined waitlist',
      waitlistEntry,
      position
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ message: 'Error joining waitlist' });
  }
};

// Get waitlist entries for a cause (admin only)
export const getWaitlistForCause = async (req: Request, res: Response): Promise<void> => {
  try {
    const { causeId } = req.params;

    const waitlistEntries = await Waitlist.find({ causeId })
      .sort({ position: 1 })
      .select('-magicLinkToken');

    res.json(waitlistEntries);
  } catch (error) {
    console.error('Error getting waitlist:', error);
    res.status(500).json({ message: 'Error getting waitlist' });
  }
};

// Get all waitlist entries (admin only)
export const getAllWaitlistEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const waitlistEntries = await Waitlist.find()
      .sort({ createdAt: -1 })
      .select('-magicLinkToken');

    res.json(waitlistEntries);
  } catch (error) {
    console.error('Error getting all waitlist entries:', error);
    res.status(500).json({ message: 'Error getting waitlist entries' });
  }
};

// Send notifications to waitlist when cause becomes sponsored
export const notifyWaitlistMembers = async (causeId: string): Promise<void> => {
  try {
    console.log(`Notifying waitlist members for cause: ${causeId}`);

    // Get all waiting members for this cause
    const waitlistEntries = await Waitlist.find({
      causeId,
      status: WaitlistStatus.WAITING
    }).sort({ position: 1 });

    if (waitlistEntries.length === 0) {
      console.log('No waitlist members to notify');
      return;
    }

    // Get cause details
    const cause = await Cause.findById(causeId);
    if (!cause) {
      console.error('Cause not found for waitlist notification');
      return;
    }

    // Process each waitlist entry
    for (const entry of waitlistEntries) {
      try {
        // Generate magic link
        const magicLinkPayload = createMagicLink(
          entry.userId?.toString() || 'anonymous',
          entry._id.toString(),
          causeId,
          entry.email
        );

        // Update waitlist entry with magic link info
        await Waitlist.findByIdAndUpdate(entry._id, {
          status: WaitlistStatus.NOTIFIED,
          magicLinkToken: magicLinkPayload.token,
          magicLinkSentAt: new Date(),
          magicLinkExpires: magicLinkPayload.expires
        });

        // Send email notification if enabled
        if (entry.notifyEmail) {
          const magicLinkUrl = getMagicLinkUrl(magicLinkPayload);
          
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Good News! Totes Are Now Available</h2>
              <p>Hello ${entry.fullName},</p>
              
              <p>Great news! The cause you joined the waitlist for, <strong>${cause.title}</strong>, 
              has received funding and totes are now available for claim.</p>
              
              <div style="background-color: #e0f2fe; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #0284c7;">
                <p style="margin-top: 0;"><strong>As a waitlist member, you have priority access to claim your totes.</strong></p>
                <p style="margin-bottom: 0;">This special link will expire in 48 hours, so please claim your totes soon.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLinkUrl}" 
                   style="background-color: #0070f3; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Claim Your Totes Now
                </a>
              </div>
              
              <p style="text-sm; color: #666;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <span style="background-color: #f5f5f5; padding: 5px; border-radius: 3px; font-family: monospace; font-size: 12px;">
                  ${magicLinkUrl}
                </span>
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              
              <p style="font-size: 12px; color: #666;">
                This email was sent to you because you joined the waitlist for a cause on CauseConnect. 
                If you have any questions, please contact us at waitlist@causeconnect.org
              </p>
            </div>
          `;

          await sendEmail(
            entry.email,
            `Totes Available: ${cause.title}`,
            emailHtml
          );

          console.log(`Notification email sent to ${entry.email}`);
        }

        // TODO: Send SMS notification if enabled
        if (entry.notifySms) {
          console.log(`SMS notification would be sent to ${entry.phone}`);
          // Implement SMS notification logic here
        }

      } catch (error) {
        console.error(`Error processing waitlist entry ${entry._id}:`, error);
        // Continue with other entries even if one fails
      }
    }

    console.log(`Successfully notified ${waitlistEntries.length} waitlist members`);
  } catch (error) {
    console.error('Error notifying waitlist members:', error);
  }
};

// Validate magic link token
export const validateMagicLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const waitlistEntry = await Waitlist.findOne({
      magicLinkToken: token,
      status: WaitlistStatus.NOTIFIED,
      magicLinkExpires: { $gt: new Date() }
    });

    if (!waitlistEntry) {
      res.status(400).json({ message: 'Invalid or expired magic link' });
      return;
    }

    res.json({
      valid: true,
      waitlistEntry: {
        fullName: waitlistEntry.fullName,
        email: waitlistEntry.email,
        phone: waitlistEntry.phone,
        message: waitlistEntry.message,
        causeId: waitlistEntry.causeId.toString()
      }
    });
  } catch (error) {
    console.error('Error validating magic link:', error);
    res.status(500).json({ message: 'Error validating magic link' });
  }
};

// Mark waitlist entry as claimed
export const markWaitlistAsClaimed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { waitlistId } = req.params;

    const waitlistEntry = await Waitlist.findByIdAndUpdate(
      waitlistId,
      { status: WaitlistStatus.CLAIMED },
      { new: true }
    );

    if (!waitlistEntry) {
      res.status(404).json({ message: 'Waitlist entry not found' });
      return;
    }

    res.json({ message: 'Waitlist entry marked as claimed', waitlistEntry });
  } catch (error) {
    console.error('Error marking waitlist as claimed:', error);
    res.status(500).json({ message: 'Error marking waitlist as claimed' });
  }
}; 
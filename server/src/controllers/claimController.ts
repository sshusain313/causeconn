import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Claim, { ClaimStatus } from '../models/claims';

// Create a new claim
export const createClaim = async (req: Request, res: Response): Promise<void> => {
  try {
    const claimData = req.body;
    
    // Check if user has already claimed a tote for this cause
    const existingClaim = await Claim.findOne({
      email: claimData.email,
      causeId: claimData.causeId
    });
    
    if (existingClaim) {
      res.status(400).json({
        message: 'You have already claimed a tote for this cause. Each user can claim only one tote per cause.'
      });
      return;
    }
    
    // Check if there are available totes for this cause
    const Cause = mongoose.model('Cause');
    const cause = await Cause.findById(claimData.causeId);
    
    if (!cause) {
      res.status(404).json({ message: 'Cause not found' });
      return;
    }
    
    if (cause.availableTotes <= 0) {
      res.status(400).json({ message: 'No totes available for this cause' });
      return;
    }
    
    // Create the claim
    const claim = await Claim.create(claimData);
    
    // Update the cause's available totes count
    await Cause.findByIdAndUpdate(claimData.causeId, {
      $inc: { claimedTotes: 1, availableTotes: -1 }
    });
    
    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ message: 'Error creating claim' });
  }
};

// Get recent claims for admin dashboard
export const getRecentClaims = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const claims = await Claim.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('causeTitle fullName email status createdAt');

    const total = await Claim.countDocuments();

    res.status(200).json({
      claims,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching recent claims:', error);
    res.status(500).json({ message: 'Error fetching recent claims' });
  }
};

// Get claim by ID
export const getClaimById = async (req: Request, res: Response): Promise<void> => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      res.status(404).json({ message: 'Claim not found' });
      return;
    }
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ message: 'Error fetching claim' });
  }
};

// Update claim status
export const updateClaimStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      res.status(404).json({ message: 'Claim not found' });
      return;
    }

    claim.status = status;
    
    // Update shipping or delivery date based on status
    if (status === ClaimStatus.SHIPPED) {
      claim.shippingDate = new Date();
    } else if (status === ClaimStatus.DELIVERED) {
      claim.deliveryDate = new Date();
    }

    await claim.save();
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error updating claim status:', error);
    res.status(500).json({ message: 'Error updating claim status' });
  }
};

// Check if a user has already claimed a tote for a specific cause
export const checkExistingClaim = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, causeId } = req.query;
    
    if (!email || !causeId) {
      res.status(400).json({ message: 'Email and causeId are required' });
      return;
    }
    
    const existingClaim = await Claim.findOne({
      email: email as string,
      causeId: causeId as string
    });
    
    res.status(200).json({
      exists: !!existingClaim,
      message: existingClaim ? 'User has already claimed a tote for this cause' : 'No existing claim found'
    });
  } catch (error) {
    console.error('Error checking existing claim:', error);
    res.status(500).json({ message: 'Error checking existing claim' });
  }
};

// Get claims statistics
export const getClaimsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Claim.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Claim.countDocuments();
    const today = await Claim.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.status(200).json({
      byStatus: stats,
      total,
      today
    });
  } catch (error) {
    console.error('Error fetching claims statistics:', error);
    res.status(500).json({ message: 'Error fetching claims statistics' });
  }
}; 
import { Request, Response } from 'express';
import Sponsorship, { SponsorshipStatus, DistributionType } from '../models/Sponsorship';

export const createSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received sponsorship request body:', JSON.stringify(req.body, null, 2));
    
    // If selectedCause is provided but cause isn't, use selectedCause as cause
    if (!req.body.cause && req.body.selectedCause) {
      req.body.cause = req.body.selectedCause;
    }

    // Extract distributionLocations from physicalDistributionDetails if present
    if (!req.body.distributionLocations && req.body.physicalDistributionDetails?.distributionLocations) {
      req.body.distributionLocations = req.body.physicalDistributionDetails.distributionLocations;
    }
    
    // Check for required fields
    const requiredFields = [
      'cause',
      'organizationName',
      'contactName',
      'email',
      'phone',
      'toteQuantity',
      'numberOfTotes',
      'unitPrice',
      'totalAmount',
      'distributionType',
      'selectedCities',
      'distributionStartDate',
      'distributionEndDate',
      'logoPosition'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    // Special check for distributionLocations - only required for physical distribution
    if (req.body.distributionType === 'physical' && !req.body.distributionLocations?.length) {
      missingFields.push('distributionLocations');
    }
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields 
      });
      return;
    }
    
    // Handle logoUrl - if it's not provided or is a client-side placeholder, set a default
    if (!req.body.logoUrl || req.body.logoUrl === 'logo_uploaded_client_side') {
      req.body.logoUrl = 'https://api.changebag.org/uploads/default-logo.png';
    }
    
    // Create the sponsorship with required fields and defaults
    const sponsorshipData = {
      ...req.body,
      sponsor: req.user?._id || null,
      status: SponsorshipStatus.PENDING,
      // Set default demographics if not provided
      demographics: req.body.demographics || {
        ageGroups: [],
        income: '',
        education: '',
        other: ''
      }
    };

    // Remove redundant fields that are now properly placed
    delete sponsorshipData.physicalDistributionDetails;
    delete sponsorshipData.distributionPoints;
    delete sponsorshipData.distributionPointName;
    delete sponsorshipData.distributionPointAddress;
    delete sponsorshipData.distributionPointContact;
    delete sponsorshipData.distributionPointPhone;
    delete sponsorshipData.distributionPointLocation;
    delete sponsorshipData.selectedMalls;
    delete sponsorshipData.selectedMetroStations;
    delete sponsorshipData.selectedAirports;
    delete sponsorshipData.selectedSchools;
    delete sponsorshipData.shippingAddress;
    delete sponsorshipData.shippingContactName;
    delete sponsorshipData.shippingPhone;
    delete sponsorshipData.shippingInstructions;
    
    console.log('Creating sponsorship with data:', JSON.stringify(sponsorshipData, null, 2));
    
    const sponsorship = new Sponsorship(sponsorshipData);
    
    // Validate the sponsorship before saving
    const validationError = sponsorship.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationError.errors 
      });
      return;
    }
    
    await sponsorship.save();
    
    console.log('Sponsorship saved successfully with ID:', sponsorship._id);
    res.status(201).json(sponsorship);
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    res.status(500).json({ 
      message: 'Error creating sponsorship', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getPendingSponsorships = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== getPendingSponsorships START ===');
    console.log('Fetching pending sponsorships, authenticated as:', req.user);
    console.log('SponsorshipStatus.PENDING value:', SponsorshipStatus.PENDING);
    
    // First, let's check if the Sponsorship model is working by trying to count all sponsorships
    const totalSponsorships = await Sponsorship.countDocuments();
    console.log('Total sponsorships in database:', totalSponsorships);
    
    // Check if there are any sponsorships with any status
    const allSponsorships = await Sponsorship.find({}).limit(5);
    console.log('Sample sponsorships:', allSponsorships.map(s => ({ id: s._id, status: s.status, organizationName: s.organizationName })));
    
    console.log('About to query pending sponsorships...');
    const sponsorships = await Sponsorship.find({ status: SponsorshipStatus.PENDING })
      .populate('cause', 'title') // Populate cause with just the title field
      .sort({ createdAt: -1 });
    
    console.log('Found pending sponsorships:', sponsorships.length);
    console.log('About to send response...');
    
    res.json(sponsorships);
    console.log('=== getPendingSponsorships SUCCESS ===');
  } catch (error) {
    console.error('=== getPendingSponsorships ERROR ===');
    console.error('Error fetching pending sponsorships:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error constructor:', error.constructor.name);
    
    // Check if it's a specific type of error
    if (error.name === 'CastError') {
      console.error('This is a CastError - likely invalid ObjectId');
    } else if (error.name === 'ValidationError') {
      console.error('This is a ValidationError');
    } else if (error.name === 'MongoError') {
      console.error('This is a MongoError');
    }
    
    res.status(500).json({ message: 'Error fetching pending sponsorships' });
    console.error('=== getPendingSponsorships ERROR END ===');
  }
};

export const approveSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id).populate('cause', 'title');
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }

    sponsorship.status = SponsorshipStatus.APPROVED;
    sponsorship.approvedBy = req.user?._id;
    sponsorship.approvedAt = new Date();
    await sponsorship.save();

    // Send approval email to the sponsor
    try {
      const { sendLogoApprovalEmail } = require('../services/emailService');
      await sendLogoApprovalEmail(sponsorship.email, {
        organizationName: sponsorship.organizationName,
        causeTitle: sponsorship.cause.title || 'Campaign'
      });
      console.log(`Approval email sent to ${sponsorship.email}`);
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Continue with the response even if email fails
    }

    res.json(sponsorship);
  } catch (error) {
    console.error('Error approving sponsorship:', error);
    res.status(500).json({ message: 'Error approving sponsorship' });
  }
};

export const rejectSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id).populate('cause', 'title');
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }

    sponsorship.status = SponsorshipStatus.REJECTED;
    sponsorship.rejectionReason = req.body.reason;
    await sponsorship.save();

    // Send rejection email to the sponsor
    try {
      const { sendLogoRejectionEmail } = require('../services/emailService');
      await sendLogoRejectionEmail(sponsorship.email, {
        sponsorshipId: sponsorship._id.toString(),
        organizationName: sponsorship.organizationName,
        causeTitle: sponsorship.cause.title || 'Campaign',
        rejectionReason: sponsorship.rejectionReason || 'Logo does not meet our guidelines'
      });
      console.log(`Rejection email sent to ${sponsorship.email}`);
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Continue with the response even if email fails
    }

    res.json(sponsorship);
  } catch (error) {
    console.error('Error rejecting sponsorship:', error);
    res.status(500).json({ message: 'Error rejecting sponsorship' });
  }
};

export const getSponsorshipById = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id)
      .populate('cause', 'title'); // Populate cause with title
    
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }
    res.json(sponsorship);
  } catch (error) {
    console.error('Error fetching sponsorship:', error);
    res.status(500).json({ message: 'Error fetching sponsorship' });
  }
};

export const getUserSponsorships = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching sponsorships for user:', req.user?._id);
    
    // Find sponsorships by sponsor field OR by email (for backward compatibility)
    const sponsorships = await Sponsorship.find({
      $or: [
        { sponsor: req.user?._id },
        { email: req.user?.email }
      ]
    })
      .populate('cause', 'title description imageUrl targetAmount currentAmount category status')
      .sort({ createdAt: -1 });
    
    console.log('Found sponsorships for user:', sponsorships.length);
    
    res.json(sponsorships);
  } catch (error) {
    console.error('Error fetching user sponsorships:', error);
    res.status(500).json({ message: 'Error fetching user sponsorships' });
  }
};

/**
 * Handle logo reupload for a rejected sponsorship
 */
export const reuploadLogo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sponsorshipId } = req.params;
    const { logoUrl } = req.body;

    if (!logoUrl) {
      res.status(400).json({ message: 'Logo URL is required' });
      return;
    }

    const sponsorship = await Sponsorship.findById(sponsorshipId);
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }

    // Store the previous logo URL for reference
    const previousLogoUrl = sponsorship.logoUrl;

    // Update the sponsorship with the new logo URL
    sponsorship.logoUrl = logoUrl;
    
    // Change status back to pending for review
    sponsorship.status = SponsorshipStatus.PENDING;
    
    // Clear any previous rejection reason
    sponsorship.rejectionReason = undefined;
    
    await sponsorship.save();

    // Log the reupload activity
    console.log(`Logo reuploaded for sponsorship ${sponsorshipId}. Previous URL: ${previousLogoUrl}, New URL: ${logoUrl}`);

    res.status(200).json({ 
      message: 'Logo updated successfully and pending review',
      sponsorship
    });
  } catch (error) {
    console.error('Error reuploading logo:', error);
    res.status(500).json({ 
      message: 'Error updating logo', 
      error: error.message 
    });
  }
};

export const testSponsorshipModel = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Testing Sponsorship model...');
    
    // Test 1: Check if the model is loaded
    console.log('Sponsorship model exists:', !!Sponsorship);
    console.log('Sponsorship model name:', Sponsorship.modelName);
    
    // Test 2: Check database connection
    const dbState = Sponsorship.db.readyState;
    console.log('Database ready state:', dbState);
    console.log('Database name:', Sponsorship.db.name);
    
    // Test 3: Try a simple count without any filters
    const count = await Sponsorship.countDocuments();
    console.log('Total sponsorships count:', count);
    
    // Test 4: Try to get one sponsorship without any filters
    const oneSponsorship = await Sponsorship.findOne();
    console.log('One sponsorship found:', !!oneSponsorship);
    if (oneSponsorship) {
      console.log('Sponsorship fields:', Object.keys(oneSponsorship.toObject()));
      console.log('Sponsorship status:', oneSponsorship.status);
      console.log('Sponsorship status type:', typeof oneSponsorship.status);
    }
    
    // Test 5: Check all unique status values
    const uniqueStatuses = await Sponsorship.distinct('status');
    console.log('Unique statuses in database:', uniqueStatuses);
    
    // Test 6: Count by status
    const statusCounts = await Sponsorship.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('Status counts:', statusCounts);
    
    // Test 7: Check what SponsorshipStatus.PENDING equals
    console.log('SponsorshipStatus.PENDING value:', SponsorshipStatus.PENDING);
    console.log('SponsorshipStatus.PENDING type:', typeof SponsorshipStatus.PENDING);
    
    res.json({
      modelExists: !!Sponsorship,
      modelName: Sponsorship.modelName,
      dbReadyState: dbState,
      dbName: Sponsorship.db.name,
      totalCount: count,
      hasOneSponsorship: !!oneSponsorship,
      sampleStatus: oneSponsorship?.status,
      sampleStatusType: typeof oneSponsorship?.status,
      uniqueStatuses: uniqueStatuses,
      statusCounts: statusCounts,
      pendingEnumValue: SponsorshipStatus.PENDING,
      pendingEnumType: typeof SponsorshipStatus.PENDING
    });
  } catch (error) {
    console.error('Test error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Test failed', 
      error: error.message,
      stack: error.stack 
    });
  }
};

export const testPendingSponsorships = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Testing pending sponsorships step by step...');
    
    // Step 1: Find pending sponsorships without populate
    console.log('Step 1: Finding pending sponsorships without populate...');
    const pendingWithoutPopulate = await Sponsorship.find({ status: SponsorshipStatus.PENDING });
    console.log('Found pending sponsorships without populate:', pendingWithoutPopulate.length);
    
    if (pendingWithoutPopulate.length > 0) {
      console.log('Sample sponsorship without populate:', {
        id: pendingWithoutPopulate[0]._id,
        status: pendingWithoutPopulate[0].status,
        cause: pendingWithoutPopulate[0].cause,
        causeType: typeof pendingWithoutPopulate[0].cause
      });
    }
    
    // Step 2: Try populate on one sponsorship
    if (pendingWithoutPopulate.length > 0) {
      console.log('Step 2: Testing populate on one sponsorship...');
      try {
        const populatedOne = await Sponsorship.findById(pendingWithoutPopulate[0]._id).populate('cause', 'title');
        console.log('Successfully populated one sponsorship:', {
          id: populatedOne._id,
          cause: populatedOne.cause,
          causeTitle: populatedOne.cause?.title
        });
      } catch (populateError) {
        console.error('Error populating one sponsorship:', populateError);
        throw populateError;
      }
    }
    
    // Step 3: Try the full query
    console.log('Step 3: Testing full query with populate...');
    const pendingWithPopulate = await Sponsorship.find({ status: SponsorshipStatus.PENDING })
      .populate('cause', 'title')
      .sort({ createdAt: -1 });
    
    console.log('Successfully found pending sponsorships with populate:', pendingWithPopulate.length);
    
    res.json({
      withoutPopulate: pendingWithoutPopulate.length,
      withPopulate: pendingWithPopulate.length,
      sampleWithoutPopulate: pendingWithoutPopulate.length > 0 ? {
        id: pendingWithoutPopulate[0]._id,
        status: pendingWithoutPopulate[0].status,
        cause: pendingWithoutPopulate[0].cause
      } : null,
      sampleWithPopulate: pendingWithPopulate.length > 0 ? {
        id: pendingWithPopulate[0]._id,
        status: pendingWithPopulate[0].status,
        cause: pendingWithPopulate[0].cause
      } : null
    });
  } catch (error) {
    console.error('Test pending sponsorships error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Test failed', 
      error: error.message,
      stack: error.stack 
    });
  }
}; 
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
    
    // Special check for distributionLocations
    if (!req.body.distributionLocations?.length) {
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
    console.log('Fetching pending sponsorships, authenticated as:', req.user);
    
    const sponsorships = await Sponsorship.find({ status: SponsorshipStatus.PENDING })
      .populate('cause', 'title') // Populate cause with just the title field
      .sort({ createdAt: -1 });
    
    console.log('Found pending sponsorships:', sponsorships.length);
    
    res.json(sponsorships);
  } catch (error) {
    console.error('Error fetching pending sponsorships:', error);
    res.status(500).json({ message: 'Error fetching pending sponsorships' });
  }
};

export const approveSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }

    sponsorship.status = SponsorshipStatus.APPROVED;
    sponsorship.approvedBy = req.user?._id;
    sponsorship.approvedAt = new Date();
    await sponsorship.save();

    res.json(sponsorship);
  } catch (error) {
    console.error('Error approving sponsorship:', error);
    res.status(500).json({ message: 'Error approving sponsorship' });
  }
};

export const rejectSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      res.status(404).json({ message: 'Sponsorship not found' });
      return;
    }

    sponsorship.status = SponsorshipStatus.REJECTED;
    sponsorship.rejectionReason = req.body.reason;
    await sponsorship.save();

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
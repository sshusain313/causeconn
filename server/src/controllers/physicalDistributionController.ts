import { Request, Response } from 'express';
import PhysicalDistribution, { DistributionStatus } from '../models/PhysicalDistribution';
import Sponsorship from '../models/Sponsorship';
import DistributionLocation from '../models/DistributionLocation';
import mongoose from 'mongoose';

/**
 * Create a new physical distribution for a sponsorship
 * @route POST /api/physical-distributions
 * @access Private
 */
export const createPhysicalDistribution = async (req: Request, res: Response) => {
  try {
    const {
      sponsorshipId,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingContactName,
      shippingPhone,
      shippingEmail,
      shippingInstructions,
      distributionLocations
    } = req.body;

    // Validate required fields
    if (!sponsorshipId || !shippingAddress || !distributionLocations || !distributionLocations.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if sponsorship exists
    const sponsorship = await Sponsorship.findById(sponsorshipId);
    if (!sponsorship) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }

    // Validate total quantity matches sponsorship tote quantity
    const totalQuantity = distributionLocations.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity !== sponsorship.toteQuantity) {
      return res.status(400).json({ 
        message: `Total distribution quantity (${totalQuantity}) must match sponsorship tote quantity (${sponsorship.toteQuantity})` 
      });
    }

    // Validate all locations exist
    const locationIds = distributionLocations.map(item => item.location);
    const locations = await DistributionLocation.find({ _id: { $in: locationIds } });
    
    if (locations.length !== locationIds.length) {
      return res.status(400).json({ message: 'One or more distribution locations not found' });
    }

    // Create physical distribution
    const physicalDistribution = new PhysicalDistribution({
      sponsorship: sponsorshipId,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingContactName,
      shippingPhone,
      shippingEmail,
      shippingInstructions,
      distributionLocations: distributionLocations.map(item => ({
        location: item.location,
        quantity: item.quantity,
        notes: item.notes,
        status: DistributionStatus.PENDING
      })),
      status: DistributionStatus.PENDING
    });

    // Save physical distribution
    const savedDistribution = await physicalDistribution.save();

    // Update sponsorship with reference to physical distribution
    await Sponsorship.findByIdAndUpdate(
      sponsorshipId,
      { 
        physicalDistribution: savedDistribution._id,
        // Also update distribution type if not already set
        distributionType: 'physical'
      }
    );

    // Update tote counts for each location
    for (const item of distributionLocations) {
      await DistributionLocation.findByIdAndUpdate(
        item.location,
        { $inc: { totesCount: item.quantity } }
      );
    }

    res.status(201).json(savedDistribution);
  } catch (error) {
    console.error('Error creating physical distribution:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all physical distributions
 * @route GET /api/physical-distributions
 * @access Private/Admin
 */
export const getAllPhysicalDistributions = async (req: Request, res: Response) => {
  try {
    const distributions = await PhysicalDistribution.find()
      .populate('sponsorship', 'organizationName toteQuantity')
      .populate('distributionLocations.location', 'name type city');
    
    res.json(distributions);
  } catch (error) {
    console.error('Error fetching physical distributions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get physical distribution by ID
 * @route GET /api/physical-distributions/:id
 * @access Private
 */
export const getPhysicalDistributionById = async (req: Request, res: Response) => {
  try {
    const distribution = await PhysicalDistribution.findById(req.params.id)
      .populate('sponsorship', 'organizationName toteQuantity logoUrl')
      .populate('distributionLocations.location', 'name type city address state zipCode openingHours');
    
    if (!distribution) {
      return res.status(404).json({ message: 'Physical distribution not found' });
    }
    
    res.json(distribution);
  } catch (error) {
    console.error('Error fetching physical distribution:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get physical distribution by sponsorship ID
 * @route GET /api/physical-distributions/sponsorship/:sponsorshipId
 * @access Private
 */
export const getPhysicalDistributionBySponsorshipId = async (req: Request, res: Response) => {
  try {
    const { sponsorshipId } = req.params;
    
    const distribution = await PhysicalDistribution.findOne({ sponsorship: sponsorshipId })
      .populate('sponsorship', 'organizationName toteQuantity logoUrl')
      .populate('distributionLocations.location', 'name type city address state zipCode openingHours');
    
    if (!distribution) {
      return res.status(404).json({ message: 'Physical distribution not found for this sponsorship' });
    }
    
    res.json(distribution);
  } catch (error) {
    console.error('Error fetching physical distribution by sponsorship:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update physical distribution
 * @route PUT /api/physical-distributions/:id
 * @access Private/Admin
 */
export const updatePhysicalDistribution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If updating distribution locations, validate total quantity
    if (updateData.distributionLocations && updateData.distributionLocations.length > 0) {
      const distribution = await PhysicalDistribution.findById(id).populate('sponsorship');
      if (!distribution) {
        return res.status(404).json({ message: 'Physical distribution not found' });
      }
      
      const sponsorship = distribution.sponsorship as any;
      const totalQuantity = updateData.distributionLocations.reduce((sum, item) => sum + item.quantity, 0);
      
      if (totalQuantity !== sponsorship.toteQuantity) {
        return res.status(400).json({ 
          message: `Total distribution quantity (${totalQuantity}) must match sponsorship tote quantity (${sponsorship.toteQuantity})` 
        });
      }
      
      // Update tote counts for locations
      // First, decrement counts from old locations
      for (const item of distribution.distributionLocations) {
        await DistributionLocation.findByIdAndUpdate(
          item.location,
          { $inc: { totesCount: -item.quantity } }
        );
      }
      
      // Then, increment counts for new locations
      for (const item of updateData.distributionLocations) {
        await DistributionLocation.findByIdAndUpdate(
          item.location,
          { $inc: { totesCount: item.quantity } }
        );
      }
    }
    
    // Update the physical distribution
    const updatedDistribution = await PhysicalDistribution.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('sponsorship', 'organizationName toteQuantity')
      .populate('distributionLocations.location', 'name type city');
    
    if (!updatedDistribution) {
      return res.status(404).json({ message: 'Physical distribution not found' });
    }
    
    res.json(updatedDistribution);
  } catch (error) {
    console.error('Error updating physical distribution:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update distribution location status
 * @route PATCH /api/physical-distributions/:id/locations/:locationId/status
 * @access Private/Admin
 */
export const updateLocationStatus = async (req: Request, res: Response) => {
  try {
    const { id, locationId } = req.params;
    const { status, notes, distributedDate } = req.body;
    
    if (!Object.values(DistributionStatus).includes(status as DistributionStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const distribution = await PhysicalDistribution.findById(id);
    if (!distribution) {
      return res.status(404).json({ message: 'Physical distribution not found' });
    }
    
    // Find the location in the distribution
    const locationIndex = distribution.distributionLocations.findIndex(
      item => item.location.toString() === locationId
    );
    
    if (locationIndex === -1) {
      return res.status(404).json({ message: 'Location not found in this distribution' });
    }
    
    // Update the location status
    distribution.distributionLocations[locationIndex].status = status as DistributionStatus;
    
    if (notes) {
      distribution.distributionLocations[locationIndex].notes = notes;
    }
    
    if (distributedDate) {
      distribution.distributionLocations[locationIndex].distributedDate = new Date(distributedDate);
    }
    
    // If all locations are completed, update the overall status
    const allCompleted = distribution.distributionLocations.every(
      item => item.status === DistributionStatus.COMPLETED
    );
    
    if (allCompleted) {
      distribution.status = DistributionStatus.COMPLETED;
    } else if (distribution.distributionLocations.some(
      item => item.status === DistributionStatus.IN_PROGRESS
    )) {
      distribution.status = DistributionStatus.IN_PROGRESS;
    }
    
    await distribution.save();
    
    res.json(distribution);
  } catch (error) {
    console.error('Error updating location status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete physical distribution
 * @route DELETE /api/physical-distributions/:id
 * @access Private/Admin
 */
export const deletePhysicalDistribution = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    
    // Get the distribution with its locations
    const distribution = await PhysicalDistribution.findById(id);
    if (!distribution) {
      return res.status(404).json({ message: 'Physical distribution not found' });
    }
    
    // Update tote counts for each location
    for (const item of distribution.distributionLocations) {
      await DistributionLocation.findByIdAndUpdate(
        item.location,
        { $inc: { totesCount: -item.quantity } },
        { session }
      );
    }
    
    // Remove reference from sponsorship
    await Sponsorship.findByIdAndUpdate(
      distribution.sponsorship,
      { $unset: { physicalDistribution: 1 } },
      { session }
    );
    
    // Delete the physical distribution
    await PhysicalDistribution.findByIdAndDelete(id).session(session);
    
    await session.commitTransaction();
    
    res.json({ message: 'Physical distribution deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting physical distribution:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

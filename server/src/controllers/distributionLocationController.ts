import { Request, Response } from 'express';
import DistributionLocation, { LocationType } from '../models/DistributionLocation';

// Get all distribution locations
export const getAllDistributionLocations = async (req: Request, res: Response) => {
  try {
    const { type, isActive, city } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (type) {
      filter.type = type;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (city) {
      filter.city = { $regex: new RegExp(city as string, 'i') };
    }
    
    const locations = await DistributionLocation.find(filter).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching distribution locations:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get distribution locations by type
export const getLocationsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    
    // Validate type
    if (!Object.values(LocationType).includes(type as LocationType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid location type'
      });
    }
    
    const locations = await DistributionLocation.find({ 
      type,
      isActive: true 
    }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.type} locations:`, error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single distribution location
export const getDistributionLocation = async (req: Request, res: Response) => {
  try {
    const location = await DistributionLocation.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Distribution location not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error fetching distribution location:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new distribution location
export const createDistributionLocation = async (req: Request, res: Response) => {
  try {
    const location = await DistributionLocation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error creating distribution location:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update a distribution location
export const updateDistributionLocation = async (req: Request, res: Response) => {
  try {
    const location = await DistributionLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Distribution location not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error updating distribution location:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete a distribution location
export const deleteDistributionLocation = async (req: Request, res: Response) => {
  try {
    const location = await DistributionLocation.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Distribution location not found'
      });
    }
    
    await location.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting distribution location:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get location types
export const getLocationTypes = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: Object.values(LocationType)
    });
  } catch (error) {
    console.error('Error fetching location types:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

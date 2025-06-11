import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cause, { CauseStatus } from '../models/Cause';

// Get all causes
export const getAllCauses = async (req: Request, res: Response) => {
  try {
    const { status, category, search, include } = req.query;
    
    let query: any = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Search in title or description if search term provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let causesQuery = Cause.find(query)
      .populate('creator', 'name email');

    // Include sponsorships if requested
    if (include === 'sponsorships' || include === 'all') {
      causesQuery = causesQuery.populate({
        path: 'sponsorships',
        select: '_id status'
      });
    }
    
    // We'll handle claims calculation after fetching the causes
    // Don't try to populate claims directly as it might cause issues
    
    const causes = await causesQuery.sort({ createdAt: -1 });
    
    res.json(causes);
  } catch (error) {
    console.error('Error fetching causes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single cause by ID
export const getCauseById = async (req: Request, res: Response) => {
  try {
    const { include } = req.query;
    
    let causeQuery = Cause.findById(req.params.id)
      .populate('creator', 'name email');
    
    // Always include sponsorships for single cause view with toteQuantity
    causeQuery = causeQuery.populate({
      path: 'sponsorships',
      select: '_id status amount toteQuantity createdAt'
    });
    
    const cause = await causeQuery;
    
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    
    // Get total totes from approved sponsorships
    const approvedSponsorships = cause.sponsorships?.filter((s: { status: string }) => s.status === 'approved') || [];
    const totalTotes = approvedSponsorships.reduce((total: number, sponsorship: { toteQuantity?: number }) => {
      return total + (sponsorship.toteQuantity || 0);
    }, 0);
    
    // Count claimed totes from the database - only count verified, shipped, or delivered claims
    const Claim = mongoose.model('Claim');
    const claimedTotesCount = await Claim.countDocuments({ 
      causeId: cause._id,
      status: { $in: ['verified', 'shipped', 'delivered'] }
    });
    
    const claimedTotes = claimedTotesCount || 0;
    const availableTotes = Math.max(0, totalTotes - claimedTotes);
    
    // Add tote information to response
    const causeWithTotes = {
      ...cause.toObject(),
      totalTotes,
      claimedTotes,
      availableTotes
    };
    
    res.json(causeWithTotes);
  } catch (error) {
    console.error('Error fetching cause:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new cause
export const createCause = async (req: Request, res: Response) => {
  try {
    console.log('Creating cause with request body:', req.body);
    console.log('User from request:', req.user);
    console.log('Headers:', req.headers);
    console.log('File:', req.file); // Log uploaded file info
    
    const { 
      title, 
      description, 
      imageUrl, 
      targetAmount, 
      location, 
      category 
    } = req.body;
    
    console.log('Parsed request data:', { 
      title, 
      description, 
      imageUrl, 
      targetAmount, 
      location, 
      category 
    });
    
    // Validate required fields
    if (!title || !description || !targetAmount || !category) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Please provide title, description, target amount, and category' 
      });
    }
    
    // Get authenticated user from request (set by authGuard middleware)
    if (!req.user || !req.user._id) {
      console.error('No authenticated user found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const creatorId = req.user._id;
    const userRole = req.user.role;
    
    console.log('Creator ID:', creatorId);
    console.log('User role:', userRole);
    
    // Determine cause status based on user role
    let initialStatus = CauseStatus.PENDING; // Default status is pending
    
    // If creator is admin, automatically approve the cause
    if (userRole === 'admin') {
      initialStatus = CauseStatus.APPROVED;
      console.log('Creator is admin, setting cause status to APPROVED');
    } else {
      console.log('Creator is not admin, setting cause status to PENDING');
    }
    
    // Parse targetAmount as a number if it's a string
    let parsedTargetAmount = targetAmount;
    if (typeof targetAmount === 'string') {
      parsedTargetAmount = parseFloat(targetAmount);
    }
    
    // Determine the image URL
    let finalImageUrl = '';
    
    // If a file was uploaded, use its path
    if (req.file) {
      // Create a relative URL to the uploaded file
      finalImageUrl = `/uploads/${req.file.filename}`;
      console.log('Using uploaded image:', finalImageUrl);
    } else if (imageUrl) {
      // If no file but URL provided, use the URL
      finalImageUrl = imageUrl;
      console.log('Using provided image URL:', finalImageUrl);
    }
    
    // Create new cause with proper data types
    const causeData = {
      title,
      description,
      imageUrl: finalImageUrl,
      targetAmount: parsedTargetAmount,
      creator: creatorId,
      location: location || '',
      category,
      status: initialStatus // Set status based on user role
    };
    
    console.log('Creating cause with data:', causeData);
    
    try {
      const newCause = new Cause(causeData);
      console.log('New cause instance created');
      
      const savedCause = await newCause.save();
      console.log('Cause saved successfully with ID:', savedCause._id);
      
      return res.status(201).json({
        message: 'Cause created successfully',
        cause: savedCause
      });
    } catch (saveError: any) {
      console.error('Error saving cause to database:', saveError);
      if (saveError.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: saveError.errors 
        });
      }
      throw saveError; // Re-throw to be caught by the outer catch block
    }
  } catch (error: any) {
    console.error('Error creating cause:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message || 'Unknown error' 
    });
  }
};

// Update a cause
export const updateCause = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      imageUrl, 
      targetAmount, 
      status,
      location, 
      category,
      distributionStartDate,
      distributionEndDate
    } = req.body;
    
    const cause = await Cause.findById(req.params.id);
    
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    
    // Get user ID from request
    const userId = req.user && typeof req.user === 'object' && '_id' in req.user ? req.user._id : null;
    const userRole = req.user && typeof req.user === 'object' && 'role' in req.user ? req.user.role : null;
    
    // Check if user is the creator or an admin
    if ((!userId || cause.creator.toString() !== userId.toString()) && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this cause' });
    }
    
    // Update fields
    if (title) cause.title = title;
    if (description) cause.description = description;
    if (imageUrl) cause.imageUrl = imageUrl;
    if (targetAmount) cause.targetAmount = targetAmount;
    if (status && req.user?.role === 'admin') cause.status = status as CauseStatus;
    if (location) cause.location = location;
    if (category) cause.category = category;
    if (distributionStartDate) cause.distributionStartDate = new Date(distributionStartDate);
    if (distributionEndDate) cause.distributionEndDate = new Date(distributionEndDate);
    
    await cause.save();
    
    res.json({
      message: 'Cause updated successfully',
      cause
    });
  } catch (error) {
    console.error('Error updating cause:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a cause
export const deleteCause = async (req: Request, res: Response) => {
  try {
    const cause = await Cause.findById(req.params.id);
    
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    
    // Get user ID from request
    const userId = req.user && typeof req.user === 'object' && '_id' in req.user ? req.user._id : null;
    const userRole = req.user && typeof req.user === 'object' && 'role' in req.user ? req.user.role : null;
    
    // Check if user is the creator or an admin
    if ((!userId || cause.creator.toString() !== userId.toString()) && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this cause' });
    }
    
    await Cause.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Cause deleted successfully' });
  } catch (error) {
    console.error('Error deleting cause:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get causes by user
export const getCausesByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || req.user?._id;
    
    const causes = await Cause.find({ creator: userId })
      .sort({ createdAt: -1 });
    
    res.json(causes);
  } catch (error) {
    console.error('Error fetching user causes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Approve or reject a cause
export const updateCauseStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!status || !Object.values(CauseStatus).includes(status as CauseStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const cause = await Cause.findById(req.params.id);
    
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    
    // Only admin can update status
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update cause status' });
    }
    
    cause.status = status as CauseStatus;
    await cause.save();
    
    res.json({
      message: `Cause ${status} successfully`,
      cause
    });
  } catch (error) {
    console.error('Error updating cause status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a cause's tote preview image
export const updateCauseTotePreviewImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if cause exists
    const cause = await Cause.findById(id);
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    // Get the file path
    const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
    
    // Update the cause with the new tote preview image URL
    cause.totePreviewImageUrl = filePath;
    await cause.save();
    
    res.json({ 
      message: 'Tote preview image updated successfully',
      cause: {
        _id: cause._id,
        title: cause.title,
        totePreviewImageUrl: cause.totePreviewImageUrl
      }
    });
  } catch (error) {
    console.error('Error updating tote preview image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadCauseImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if cause exists
    const cause = await Cause.findById(id);
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    // Get the file path
    const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
    
    // Add the new image to the cause's images array
    cause.images = cause.images || [];
    cause.images.push(filePath);
    
    // Also set it as the admin image URL
    cause.adminImageUrl = filePath;
    
    await cause.save();
    
    res.json({ 
      success: true,
      message: 'Image uploaded successfully',
      cause: {
        _id: cause._id,
        title: cause.title,
        images: cause.images
      }
    });
  } catch (error) {
    console.error('Error uploading cause image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getAllCauses,
  getCauseById,
  createCause,
  updateCause,
  deleteCause,
  getCausesByUser,
  updateCauseStatus,
  updateCauseTotePreviewImage,
  uploadCauseImage
};

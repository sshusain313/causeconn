import { Router } from 'express';
import { 
  createPhysicalDistribution, 
  getAllPhysicalDistributions, 
  getPhysicalDistributionById,
  getPhysicalDistributionBySponsorshipId,
  updatePhysicalDistribution,
  updateLocationStatus,
  deletePhysicalDistribution
} from '../controllers/physicalDistributionController';
import { authGuard } from '../middleware/authGuard';
import { adminGuard } from '../middleware/authGuard';

const router = Router();

// Public routes - none

// Protected routes - require authentication
router.post('/', authGuard, createPhysicalDistribution);
router.get('/sponsorship/:sponsorshipId', authGuard, getPhysicalDistributionBySponsorshipId);
router.get('/:id', authGuard, getPhysicalDistributionById);

// Admin routes - require admin role
router.get('/', authGuard, adminGuard, getAllPhysicalDistributions);
router.put('/:id', authGuard, adminGuard, updatePhysicalDistribution);
router.patch('/:id/locations/:locationId/status', authGuard, adminGuard, updateLocationStatus);
router.delete('/:id', authGuard, adminGuard, deletePhysicalDistribution);

export default router;

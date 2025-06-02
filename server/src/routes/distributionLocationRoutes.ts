import express, { Router } from 'express';
import { 
  getAllDistributionLocations,
  getLocationsByType,
  getDistributionLocation,
  createDistributionLocation,
  updateDistributionLocation,
  deleteDistributionLocation,
  getLocationTypes
} from '../controllers/distributionLocationController';
import { authGuard, adminGuard } from '../middleware/authGuard';

const router: Router = Router();

// Public routes
router.get('/types', getLocationTypes);

// Protected routes (admin only)
router.get('/', authGuard, getAllDistributionLocations);
router.post('/', authGuard, adminGuard, createDistributionLocation);

router.get('/type/:type', authGuard, getLocationsByType);

router.get('/:id', authGuard, getDistributionLocation);
router.put('/:id', authGuard, adminGuard, updateDistributionLocation);
router.delete('/:id', authGuard, adminGuard, deleteDistributionLocation);

export default router;

import express from 'express';
import { joinWaitlist, getWaitlistForCause, validateMagicLink, markWaitlistAsClaimed, getAllWaitlistEntries, getUserWaitlistEntries, leaveWaitlist } from '../controllers/waitlistController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/join', joinWaitlist);
router.get('/validate/:token', validateMagicLink);

// Protected routes (admin only)
router.get('/cause/:causeId', authenticateToken, requireRole(['admin']), getWaitlistForCause);
router.get('/all', authenticateToken, requireRole(['admin']), getAllWaitlistEntries);
router.put('/:waitlistId/claim', authenticateToken, requireRole(['admin']), markWaitlistAsClaimed);

// User routes (for claimer dashboard)
router.get('/user/:email', getUserWaitlistEntries);
router.delete('/:waitlistId/leave', leaveWaitlist);

export default router; 
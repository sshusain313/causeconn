import {
  createSponsorship,
  getPendingSponsorships,
  approveSponsorship,
  rejectSponsorship,
  getSponsorshipById,
  getUserSponsorships,
  reuploadLogo,
  testSponsorshipModel,
  testPendingSponsorships
} from '../controllers/sponsorshipController';
import { authenticateToken } from '../middleware/auth';
import { adminGuard } from '../middleware/authGuard';
import { createRouter } from '../utils/routerHelper';

const router = createRouter();

// Public routes
router.post('/', createSponsorship); // Can work with or without authentication
router.patch('/:sponsorshipId/reupload', reuploadLogo); // Public route for sponsors to reupload logos
router.get('/test', testSponsorshipModel); // Test route for debugging
router.get('/test-pending', testPendingSponsorships); // Test pending sponsorships specifically

// Protected routes (require authentication)
router.get('/user', authenticateToken, getUserSponsorships);
router.get('/pending', authenticateToken, adminGuard, getPendingSponsorships);
router.get('/:id', authenticateToken, getSponsorshipById);

// Admin-only routes
router.patch('/:id/approve', authenticateToken, adminGuard, approveSponsorship);
router.patch('/:id/reject', authenticateToken, adminGuard, rejectSponsorship);

export default router; 
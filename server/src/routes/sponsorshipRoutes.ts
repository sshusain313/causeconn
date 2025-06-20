import {
  createSponsorship,
  getPendingSponsorships,
  getApprovedSponsorships,
  approveSponsorship,
  rejectSponsorship,
  toggleSponsorshipOnlineStatus,
  getSponsorshipById,
  getUserSponsorships,
  reuploadLogo,
  testSponsorshipModel,
  testPendingSponsorships,
  testSponsorshipCreation,
  testFrontendData,
  testNestedDistributionLocations,
  getDashboardMetrics
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
router.post('/test-creation', testSponsorshipCreation); // Test sponsorship creation
router.post('/test-frontend-data', testFrontendData); // Test frontend data structure
router.post('/test-nested-locations', testNestedDistributionLocations); // Test nested distribution locations

// Protected routes (require authentication)
router.get('/user', authenticateToken, getUserSponsorships);
router.get('/pending', authenticateToken, adminGuard, getPendingSponsorships);
router.get('/approved', authenticateToken, adminGuard, getApprovedSponsorships);
router.get('/dashboard-metrics', authenticateToken, adminGuard, getDashboardMetrics);
router.get('/:id', authenticateToken, getSponsorshipById);

// Admin-only routes
router.patch('/:id/approve', authenticateToken, adminGuard, approveSponsorship);
router.patch('/:id/reject', authenticateToken, adminGuard, rejectSponsorship);
router.patch('/:id/toggle-online', authenticateToken, adminGuard, toggleSponsorshipOnlineStatus);

export default router; 
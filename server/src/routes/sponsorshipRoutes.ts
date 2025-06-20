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
  getDashboardMetrics,
  endCampaign
} from '../controllers/sponsorshipController';
import { authenticateToken } from '../middleware/auth';
import { adminGuard } from '../middleware/authGuard';
import { createRouter } from '../utils/routerHelper';

const router = createRouter();

// Public routes
router.post('/', createSponsorship); // Can work with or without authentication
router.patch('/:sponsorshipId/reupload', reuploadLogo); // Public route for sponsors to reupload logos

// Protected routes (require authentication)
router.get('/user', authenticateToken, getUserSponsorships);

// Admin routes (require authentication and admin role)
router.get('/pending', authenticateToken, adminGuard, getPendingSponsorships);
router.get('/approved', authenticateToken, adminGuard, getApprovedSponsorships);
router.patch('/:id/approve', authenticateToken, adminGuard, approveSponsorship);
router.patch('/:id/reject', authenticateToken, adminGuard, rejectSponsorship);
router.patch('/:id/toggle-online', authenticateToken, adminGuard, toggleSponsorshipOnlineStatus);
router.patch('/:id/end-campaign', authenticateToken, adminGuard, endCampaign);
router.get('/:id', authenticateToken, adminGuard, getSponsorshipById);
router.get('/dashboard-metrics', authenticateToken, adminGuard, getDashboardMetrics);

// Test routes (admin only)
router.get('/test/model', authenticateToken, adminGuard, testSponsorshipModel);
router.get('/test/pending', authenticateToken, adminGuard, testPendingSponsorships);
router.post('/test/create', authenticateToken, adminGuard, testSponsorshipCreation);
router.post('/test/frontend-data', authenticateToken, adminGuard, testFrontendData);
router.post('/test/nested-distribution', authenticateToken, adminGuard, testNestedDistributionLocations);

export default router; 
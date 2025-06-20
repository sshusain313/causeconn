import { createClaim, getRecentClaims, getClaimById, updateClaimStatus, getClaimsStats, getClaimerDashboardData, getVerifiedClaimsForSponsoredCauses, checkExistingClaim } from '../controllers/claimController';
import { authenticateToken } from '../middleware/auth';
import { createRouter } from '../utils/routerHelper';

const router = createRouter();

// Public routes
router.post('/', createClaim);

// Protected routes (require authentication)
router.get('/dashboard/claimer', authenticateToken, getClaimerDashboardData);
router.get('/sponsored-causes/verified-claims', authenticateToken, getVerifiedClaimsForSponsoredCauses);

// Admin routes
router.get('/recent', authenticateToken, getRecentClaims);
router.get('/stats', authenticateToken, getClaimsStats);
router.get('/:id', authenticateToken, getClaimById);
router.patch('/:id/status', authenticateToken, updateClaimStatus);
router.get('/check-existing', authenticateToken, checkExistingClaim);

export default router;

import {Router} from 'express';
import {createClaim} from '../controllers/claimController';
import {authenticateApiKey} from '../middleware/apiKeyAuth';
import { getPartnerCauses } from '../controllers/causeController'; 

const router=Router();

//Partner API endpoint - requires API key authentication
router.post('/claim', authenticateApiKey, createClaim);
router.get('/causes', authenticateApiKey, getPartnerCauses);

export default router;
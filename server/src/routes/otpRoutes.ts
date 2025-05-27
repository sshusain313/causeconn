import { RequestHandler } from 'express';
import { sendOTP, verifyOTP, sendPhoneOTP, verifyPhoneOTP } from '../controllers/otpController';
import { createRouter } from '../utils/routerHelper';

const router = createRouter();

// Email OTP routes
router.post('/send', sendOTP as RequestHandler);
router.post('/verify', verifyOTP as RequestHandler);

// Phone OTP routes
router.post('/send-phone', sendPhoneOTP as RequestHandler);
router.post('/verify-phone', verifyPhoneOTP as RequestHandler);

export default router;
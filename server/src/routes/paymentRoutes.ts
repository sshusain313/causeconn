import { Router } from 'express';
import {
  testPaymentService,
  createOrder,
  confirmPayment,
  getPaymentStatus
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Test endpoint (public)
router.get('/test', testPaymentService);

// Protected payment endpoints (require authentication)
router.post('/create-order', authenticateToken, createOrder);
router.post('/confirm-payment', authenticateToken, confirmPayment);
router.get('/status/:orderId', authenticateToken, getPaymentStatus);

export default router; 
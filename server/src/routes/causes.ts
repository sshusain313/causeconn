import { Router } from 'express';
import { authGuard, adminGuard } from '../middleware/authGuard';
import causeController from '../controllers/causeController';
import upload, { compressImage } from '../middleware/fileUpload';
import { createRouter } from '../utils/routerHelper';

const router: Router = createRouter();

// Public routes
router.get('/', causeController.getAllCauses);
router.get('/:id', causeController.getCauseById);

// Protected routes (require authentication)
// Add image compression middleware to reduce file sizes
router.post('/', authGuard, upload.single('image'), compressImage, causeController.createCause);
router.put('/:id', authGuard, causeController.updateCause);
router.delete('/:id', authGuard, causeController.deleteCause);
// Route for getting causes by user ID (current user if no ID provided)
router.get('/user/:userId', authGuard, causeController.getCausesByUser);
router.get('/user', authGuard, causeController.getCausesByUser);

// Admin routes
router.patch('/:id/status', authGuard, adminGuard, causeController.updateCauseStatus);

export default router;

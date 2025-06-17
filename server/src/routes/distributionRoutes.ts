import express from 'express';
import {
  getSettings,
  createCountry,
  updateCountry,
  createCity,
  updateCity,
  createCategory,
  updateCategory,
  createPoint,
  updatePoint,
  deletePoint,
  getPointsByCityAndCategory
} from '../controllers/distributionController';

const router = express.Router();

// Settings
router.get('/settings', getSettings);

// Points by city and category
router.get('/points/:cityId/:categoryId', getPointsByCityAndCategory);

// Countries
router.post('/countries', createCountry);
router.put('/countries/:id', updateCountry);

// Cities
router.post('/cities', createCity);
router.put('/cities/:id', updateCity);

// Categories
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);

// Points
router.post('/points', createPoint);
router.put('/points/:id', updatePoint);
router.delete('/points/:id', deletePoint);

export default router; 
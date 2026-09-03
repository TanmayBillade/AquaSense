import express from 'express';
import {
  getFilterHealth,
  getPrediction,
  getAlerts,
  markAlertRead
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/filter-health', getFilterHealth);
router.get('/prediction', getPrediction);
router.get('/alerts', getAlerts);
router.put('/alerts/:id/read', markAlertRead);

export default router;

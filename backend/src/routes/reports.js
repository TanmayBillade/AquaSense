import express from 'express';
import { getWeeklyReport } from '../controllers/reportsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/weekly', getWeeklyReport);

export default router;

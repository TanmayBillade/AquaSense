import express from 'express';
import {
  createReading,
  getLatest,
  getHistory
} from '../controllers/readingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All reading routes are protected

router.post('/', createReading);
router.get('/latest', getLatest);
router.get('/history', getHistory);

export default router;

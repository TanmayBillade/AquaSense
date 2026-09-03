import express from 'express';
import {
  register,
  login,
  forgotPassword,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;

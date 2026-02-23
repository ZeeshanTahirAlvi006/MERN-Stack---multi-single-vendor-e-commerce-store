import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
} from '../controllers/authController.js';
import { protectRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.get('/profile', protectRole, getUserProfile);
router.put('/profile', protectRole, updateUserProfile);

export default router;

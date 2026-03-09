import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
} from '../controllers/authController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { 
    validateUserRegistration, 
    validateUserLogin, 
    checkValidationResults 
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/login', validateUserLogin, checkValidationResults, authUser);
router.post('/register', validateUserRegistration, checkValidationResults, registerUser);
router.post('/logout', logoutUser);
router.get('/profile', protectRole, getUserProfile);
router.put('/profile', protectRole, updateUserProfile);

export default router;

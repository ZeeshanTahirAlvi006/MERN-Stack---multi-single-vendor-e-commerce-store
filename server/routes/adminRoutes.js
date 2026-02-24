import express from 'express';
import {
    getStats,
    getUsers,
    toggleUserActive,
    getCommissionSummary,
} from '../controllers/adminController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleWare.js';

const router = express.Router();

// All admin routes require admin role
router.use(protectRole, authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', toggleUserActive);
router.get('/commission', getCommissionSummary);

export default router;

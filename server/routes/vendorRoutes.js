import express from 'express';
import {
    getVendorDashboard,
    getVendorSales,
    getVendors,
    getVendorProfile,
} from '../controllers/vendorController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleWare.js';

const router = express.Router();

router.get('/dashboard', protectRole, authorizeRoles('vendor'), getVendorDashboard);
router.get('/sales', protectRole, authorizeRoles('vendor'), getVendorSales);
router.get('/', getVendors);
router.get('/:id', getVendorProfile);

export default router;

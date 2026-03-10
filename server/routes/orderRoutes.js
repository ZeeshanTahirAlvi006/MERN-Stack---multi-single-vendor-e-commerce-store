import express from 'express';
import {
    placeOrder,
    getMyOrders,
    getVendorSales,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    verifyStripeSession,
} from '../controllers/orderController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleWare.js';
import { 
    validateOrderData, 
    checkValidationResults 
} from '../middleware/validationMiddleware.js';

const router = express.Router();
router.get('/mine', protectRole, authorizeRoles('customer', 'vendor'), getMyOrders);
router.get('/verify-session', protectRole, verifyStripeSession);
router.get('/vendor/sales', protectRole, authorizeRoles('vendor'), getVendorSales);
router.get('/', protectRole, authorizeRoles('admin'), getAllOrders);
router.post('/', protectRole, authorizeRoles('customer', 'vendor'), validateOrderData, checkValidationResults, placeOrder);
router.get('/:id', protectRole, getOrderById);
router.put('/:id/status', protectRole, authorizeRoles('vendor', 'admin'), updateOrderStatus);


export default router;

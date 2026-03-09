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

// Static routes first (above /:id to avoid conflicts)
router.get('/mine', protectRole, authorizeRoles('customer', 'vendor'), getMyOrders);
router.get('/verify-session', protectRole, verifyStripeSession);
router.get('/vendor/sales', protectRole, authorizeRoles('vendor'), getVendorSales);

// Admin — all orders
router.get('/', protectRole, authorizeRoles('admin'), getAllOrders);

// Customer & Vendor — create order
router.post('/', protectRole, authorizeRoles('customer', 'vendor'), validateOrderData, checkValidationResults, placeOrder);

// Parameterized routes
router.get('/:id', protectRole, getOrderById);
router.put('/:id/status', protectRole, authorizeRoles('vendor', 'admin'), updateOrderStatus);


export default router;

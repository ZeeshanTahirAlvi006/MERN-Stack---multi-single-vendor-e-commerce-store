import express from 'express';
import {
    placeOrder,
    getMyOrders,
    getVendorSales,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    retryPayment,
    verifyStripeSession,
} from '../controllers/orderController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleWare.js';

const router = express.Router();

// Static routes first (above /:id to avoid conflicts)
router.get('/mine', protectRole, authorizeRoles('customer', 'vendor'), getMyOrders);
router.get('/verify-session', protectRole, verifyStripeSession);
router.get('/vendor/sales', protectRole, authorizeRoles('vendor'), getVendorSales);

// Admin — all orders
router.get('/', protectRole, authorizeRoles('admin'), getAllOrders);

// Customer & Vendor — create order
router.post('/', protectRole, authorizeRoles('customer', 'vendor'), placeOrder);

// Parameterized routes
router.get('/:id', protectRole, getOrderById);
router.put('/:id/status', protectRole, authorizeRoles('vendor', 'admin'), updateOrderStatus);
router.post('/:id/retry-payment', protectRole, authorizeRoles('customer', 'vendor'), retryPayment);

export default router;

import express from 'express';
import {
    placeOrder,
    getMyOrders,
    getOrderById,
} from '../controllers/orderController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleWare.js';

const router = express.Router();
router.post('/', protectRole, authorizeRoles('customer'), placeOrder);
router.get('/mine', protectRole, authorizeRoles('customer'), getMyOrders);
router.get('/:id', protectRole, authorizeRoles('customer', 'admin'), getOrderById);

export default router;

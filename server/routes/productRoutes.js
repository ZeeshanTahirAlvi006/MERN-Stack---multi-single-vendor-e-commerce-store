import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
} from '../controllers/productController.js';
import { protectRole } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleWare.js';

const router = express.Router();

// Vendor's own products (must be ABOVE /:id to avoid conflict)
router.get('/vendor/mine', protectRole, authorizeRoles('vendor'), getVendorProducts);

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes — vendor or admin only
router.post('/', protectRole, authorizeRoles('vendor', 'admin'), createProduct);
router.put('/:id', protectRole, authorizeRoles('vendor', 'admin'), updateProduct);
router.delete('/:id', protectRole, authorizeRoles('admin'), deleteProduct);

export default router;

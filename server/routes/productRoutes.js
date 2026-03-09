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
import { 
    validateProductData, 
    checkValidationResults 
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Vendor's own products (must be ABOVE /:id to avoid conflict)
router.get('/vendor/mine', protectRole, authorizeRoles('vendor'), getVendorProducts);

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes — vendor or admin only
router.post('/', protectRole, authorizeRoles('vendor', 'admin'), validateProductData, checkValidationResults, createProduct);
router.put('/:id', protectRole, authorizeRoles('vendor'), validateProductData, checkValidationResults, updateProduct);
router.delete('/:id', protectRole, authorizeRoles('vendor', 'admin'), deleteProduct);

export default router;

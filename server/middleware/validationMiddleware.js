import { body, validationResult } from 'express-validator';

export const checkValidationResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ 
            message: "Validation failed", 
            errors: errorMessages 
        });
    }
    next();
};

export const validateUserRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isIn(['admin', 'vendor', 'customer']).withMessage('Invalid role specified')
];

export const validateUserLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

export const validateProductData = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 120 }).withMessage('Product name cannot exceed 120 characters')
        .escape(),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters')
        .escape(),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom((value) => value >= 0).withMessage('Price cannot be less than 0'),
    body('stock')
        .optional()
        .isNumeric().withMessage('Stock must be a number')
        .custom((value) => value >= 0).withMessage('Stock cannot be less than 0'),
    body('images')
        .optional()
        .isArray().withMessage('Images must be an array')
        .custom((value) => value.length <= 3).withMessage('Maximum of 3 images allowed'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'])
        .withMessage('Invalid category selected')
];

export const validateOrderData = [
    body('shippingAddress.name')
        .trim()
        .notEmpty().withMessage('Shipping name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .escape(),
    body('shippingAddress.street')
        .trim()
        .notEmpty().withMessage('Street address is required')
        .isLength({ min: 10 }).withMessage('Street address must be at least 10 characters')
        .escape(),
    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required')
        .escape(),
    body('shippingAddress.zip')
        .trim()
        .notEmpty().withMessage('Zip code is required')
        .escape(),
    body('shippingAddress.country')
        .trim()
        .notEmpty().withMessage('Country is required')
        .escape(),
    body('paymentMethod')
        .trim()
        .notEmpty().withMessage('Payment method is required')
        .escape(),
    body('items')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid Product ID'),
    body('items.*.qty')
        .isNumeric().withMessage('Quantity must be a number')
        .custom((value) => value >= 1).withMessage('Quantity must be at least 1'),
    body('items.*.price')
        .isNumeric().withMessage('Price must be a number')
        .custom((value) => value >= 0).withMessage('Price cannot be negative'),
];

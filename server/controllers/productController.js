import * as productService from '../services/productService.js';

export const getProducts = async (req, res) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const result = await productService.getProductById(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const result = await productService.createProduct(req.body, req.user._id);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const result = await productService.updateProduct(req.params.id, req.body, req.user);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id, req.user);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getVendorProducts = async (req, res) => {
    try {
        const result = await productService.getVendorProducts(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

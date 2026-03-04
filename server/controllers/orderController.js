import * as orderService from '../services/orderService.js';
import Stripe from 'stripe';
import Order from '../models/Order.js';
export const placeOrder = async (req, res) => {
    try {
        const result = await orderService.placeOrder(req.user._id, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const result = await orderService.getMyOrders(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getVendorSales = async (req, res) => {
    try {
        const result = await orderService.getVendorSales(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const result = await orderService.getAllOrders(req.query);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const result = await orderService.getOrderById(req.params.id, req.user);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const result = await orderService.updateOrderStatus(req.params.id, req.body.status, req.user);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};

export const retryPayment = async (req, res) => {
    try {
        const result = await orderService.retryPayment(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};
export const handleStripeWebhook = async (req, res) => {
    try {
        await orderService.processStripeWebhook(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET
        );
        res.status(200).send();
    } catch (error) {
        res.status(error.statusCode || 400).send(error.message);
    }
};

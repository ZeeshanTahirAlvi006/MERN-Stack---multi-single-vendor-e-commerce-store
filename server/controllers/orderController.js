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



export const verifyStripeSession = async (req, res) => {
    try {
        const result = await orderService.verifyStripeSession(req.query.session_id, req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};
export const handleStripeWebhook = async (req, res) => {
    console.log('🔔 Webhook received');
    console.log('Has signature:', !!req.headers['stripe-signature']);
    console.log('Has webhook secret:', !!process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Body type:', typeof req.rawBody, 'isBuffer:', Buffer.isBuffer(req.rawBody));
    try {
        await orderService.processStripeWebhook(
            req.rawBody || req.body, // Use rawBody if available, fallback to body
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log('✅ Webhook processed successfully');
        res.status(200).send();
    } catch (error) {
        console.log('❌ Webhook error:', error.message);
        res.status(error.statusCode || 400).send(error.message);
    }
};

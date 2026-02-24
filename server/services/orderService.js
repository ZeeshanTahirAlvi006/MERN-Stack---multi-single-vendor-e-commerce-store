import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const placeOrder = async (userId, { items, shippingAddress, paymentMethod }) => {
    if (!items || items.length === 0) {
        const error = new Error('No order items provided');
        error.statusCode = 400;
        throw error;
    }

    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.productId);

        if (!product || !product.isActive) {
            const error = new Error(`Product not found: ${item.productId}`);
            error.statusCode = 404;
            throw error;
        }

        if (product.stock < item.qty) {
            const error = new Error(
                `Insufficient stock for "${product.name}". Available: ${product.stock}`
            );
            error.statusCode = 400;
            throw error;
        }

        orderItems.push({
            productId: product._id,
            qty: item.qty,
            price: product.price,
            vendorId: product.vendorid,
        });

        product.stock -= item.qty;
        await product.save();
    }

    const order = await Order.create({
        customerId: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        status: 'Pending',
        total: 0,
    });

    return order;
};

export const getMyOrders = async (userId) => {
    return await Order.find({ customerId: userId })
        .sort({ createdAt: -1 });
};

export const getVendorSales = async (vendorId) => {
    return await Order.find({ 'items.vendorId': vendorId })
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 });
};

export const getAllOrders = async ({ page = 1, limit = 20 }) => {
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments();

    const orders = await Order.find()
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return {
        orders,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
    };
};

export const getOrderById = async (orderId, user) => {
    const order = await Order.findById(orderId);

    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    if (order.customerId.toString() !== user._id.toString() && user.role !== 'admin') {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    return order;
};

export const updateOrderStatus = async (orderId, status, user) => {
    const allowed = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowed.includes(status)) {
        const error = new Error(`Invalid status. Must be one of: ${allowed.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    const order = await Order.findById(orderId);

    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    if (user.role === 'vendor') {
        const hasVendorItems = order.items.some(
            (item) => item.vendorId.toString() === user._id.toString()
        );
        if (!hasVendorItems) {
            const error = new Error('Not authorized to update this order');
            error.statusCode = 403;
            throw error;
        }
    }

    order.status = status;
    if (status === 'Paid' && !order.paidAt) {
        order.paidAt = new Date();
    }

    return await order.save();
};

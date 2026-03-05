import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';

let stripeInstance = null;
const getStripe = () => {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeInstance;
};

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
            name: product.name,
            qty: item.qty,
            price: product.price,
            vendorId: product.vendorid,
        });
    }

    const isStripe = paymentMethod === 'Card (Stripe)';

    if (isStripe) {
        // For Stripe: DON'T create order yet — create it only after payment confirmed
        const lineItems = orderItems.map((item) => ({
            price_data: {
                currency: 'pkr',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.qty,
        }));

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`,
            metadata: {
                customerId: userId.toString(),
                // Store compact item data: "productId:qty,productId:qty" to avoid 500-char limit
                items: orderItems.map(i => `${i.productId}:${i.qty}`).join(','),
                shippingAddress: JSON.stringify(shippingAddress),
                paymentMethod,
            },
        });

        return { stripeUrl: session.url };
    }

    // COD: deduct stock and create order immediately
    for (const item of items) {
        const product = await Product.findById(item.productId);
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



// Helper: create order from Stripe session metadata after payment confirmed
const createOrderFromStripeSession = async (session) => {
    // Check if order already exists for this session (prevent duplicates)
    const existing = await Order.findOne({ stripeSessionId: session.id });
    if (existing) return existing;

    const customerId = session.metadata.customerId;
    const shippingAddress = JSON.parse(session.metadata.shippingAddress);
    const paymentMethod = session.metadata.paymentMethod;

    // Parse compact items format: "productId:qty,productId:qty"
    const itemEntries = session.metadata.items.split(',').map(entry => {
        const [productId, qty] = entry.split(':');
        return { productId, qty: Number(qty) };
    });

    // Re-fetch product details from DB and deduct stock
    const orderItems = [];
    for (const entry of itemEntries) {
        const product = await Product.findById(entry.productId);
        if (product) {
            product.stock -= entry.qty;
            await product.save();
            orderItems.push({
                productId: product._id,
                name: product.name,
                qty: entry.qty,
                price: product.price,
                vendorId: product.vendorid,
            });
        }
    }

    const order = await Order.create({
        customerId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        status: 'Paid',
        paidAt: new Date(),
        stripeSessionId: session.id,
        total: 0,
    });

    return order;
};

export const verifyStripeSession = async (sessionId, userId) => {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
        const error = new Error('Session not found');
        error.statusCode = 404;
        throw error;
    }

    if (session.metadata?.customerId !== userId.toString()) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        throw error;
    }

    if (session.payment_status === 'paid') {
        const order = await createOrderFromStripeSession(session);
        return { status: order.status, orderId: order._id };
    }

    return { status: 'unpaid' };
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

export const processStripeWebhook = async (rawBody, signature, webhookSecret) => {
    let event;
    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
        const error = new Error(`Webhook Error: ${err.message}`);
        error.statusCode = 400;
        throw error;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('📦 Event: checkout.session.completed');

        if (session.payment_status === 'paid' && session.metadata?.customerId) {
            const order = await createOrderFromStripeSession(session);
            console.log('✅ Order created as Paid:', order._id);
        } else {
            console.log('⚠️ Session not paid or missing metadata');
        }
    }
};

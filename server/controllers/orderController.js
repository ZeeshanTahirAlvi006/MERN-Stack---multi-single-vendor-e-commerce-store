import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product || !product.isActive) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }

            if (product.stock < item.qty) {
                return res.status(400).json({
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
                });
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
            customerId: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            status: 'Pending',
            total: 0, 
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (
            order.customerId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

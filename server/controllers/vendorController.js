import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getVendorDashboard = async (req, res) => {
    try {
        const vendorId = req.user._id;

        const revenueAgg = await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.vendorId': vendorId } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
                    totalPlatformFee: { $sum: '$items.platformFee' },
                    totalOrders: { $addToSet: '$_id' },
                },
            },
        ]);

        const revenue = revenueAgg[0] || { totalRevenue: 0, totalPlatformFee: 0, totalOrders: [] };
        const totalRevenue = revenue.totalRevenue;
        const platformFee = revenue.totalPlatformFee || totalRevenue * 0.10;
        const netEarnings = totalRevenue - platformFee;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const ordersThisMonth = await Order.countDocuments({
            'items.vendorId': vendorId,
            createdAt: { $gte: startOfMonth },
        });

        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.vendorId': vendorId } },
            {
                $group: {
                    _id: '$items.productId',
                    totalQty: { $sum: '$items.qty' },
                    totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
                },
            },
            { $sort: { totalQty: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    name: '$product.name',
                    image: { $arrayElemAt: ['$product.images', 0] },
                    totalQty: 1,
                    totalSales: 1,
                },
            },
        ]);

        const stockAlerts = await Product.find({
            vendorid: vendorId,
            isActive: true,
            stock: { $lte: 5 },
        })
            .select('name stock images')
            .sort({ stock: 1 })
            .limit(10);

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.vendorId': vendorId, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
                    orders: { $addToSet: '$_id' },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    revenue: 1,
                    orderCount: { $size: '$orders' },
                },
            },
            { $sort: { year: 1, month: 1 } },
        ]);

        res.json({
            totalRevenue,
            platformFee,
            netEarnings,
            ordersThisMonth,
            totalOrders: revenue.totalOrders?.length || 0,
            topProducts,
            stockAlerts,
            monthlyRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getVendorSales = async (req, res) => {
    try {
        const vendorId = req.user._id;

        const orders = await Order.find({ 'items.vendorId': vendorId })
            .populate('customerId', 'name email')
            .sort({ createdAt: -1 });

        // Filter items to only show vendor's items
        const sales = orders.map((order) => ({
            _id: order._id,
            customer: order.customerId,
            items: order.items.filter(
                (item) => item.vendorId?.toString() === vendorId.toString()
            ),
            status: order.status,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
        }));

        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getVendors = async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const vendors = await User.find({ role: 'vendor', isActive: true })
            .select('name email storeInfo createdAt');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getVendorProfile = async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const vendor = await User.findOne({
            _id: req.params.id,
            role: 'vendor',
            isActive: true,
        }).select('name email storeInfo createdAt');

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const products = await Product.find({
            vendorid: req.params.id,
            isActive: true,
        }).sort({ createdAt: -1 });

        res.json({ vendor, products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

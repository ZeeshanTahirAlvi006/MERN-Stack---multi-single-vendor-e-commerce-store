import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getDashboard = async (vendorId) => {
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

    const rawMonthlyRevenue = await Order.aggregate([
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

    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const targetYear = d.getFullYear();
        const targetMonth = d.getMonth() + 1;

        const found = rawMonthlyRevenue.find(
            (r) => r.year === targetYear && r.month === targetMonth
        );

        monthlyRevenue.push({
            year: targetYear,
            month: targetMonth,
            revenue: found ? found.revenue : 0,
            orderCount: found ? found.orderCount : 0,
        });
    }

    return {
        totalRevenue,
        platformFee,
        netEarnings,
        ordersThisMonth,
        totalOrders: revenue.totalOrders?.length || 0,
        topProducts,
        stockAlerts,
        monthlyRevenue,
    };
};

export const getVendorSales = async (vendorId) => {
    const orders = await Order.find({ 'items.vendorId': vendorId })
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 });

    return orders.map((order) => ({
        _id: order._id,
        customer: order.customerId,
        items: order.items.filter(
            (item) => item.vendorId?.toString() === vendorId.toString()
        ),
        status: order.status,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
    }));
};

export const getVendors = async () => {
    return await User.find({ role: 'vendor', isActive: true })
        .select('name email storeInfo createdAt');
};

export const getVendorProfile = async (vendorId) => {
    const vendor = await User.findOne({
        _id: vendorId,
        role: 'vendor',
        isActive: true,
    }).select('name email storeInfo createdAt');

    if (!vendor) {
        const error = new Error('Vendor not found');
        error.statusCode = 404;
        throw error;
    }

    const products = await Product.find({
        vendorid: vendorId,
        isActive: true,
    }).sort({ createdAt: -1 });

    return { vendor, products };
};

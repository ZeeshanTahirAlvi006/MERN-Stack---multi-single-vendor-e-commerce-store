import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getStats = async () => {
    const [totalUsers, totalVendors, totalCustomers, totalProducts, totalOrders] =
        await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'vendor' }),
            User.countDocuments({ role: 'customer' }),
            Product.countDocuments({ isActive: true }),
            Order.countDocuments(),
        ]);

    const revenueResult = await Order.aggregate([
        { $match: { status: { $in: ['Paid', 'Shipped', 'Delivered'] } } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
                totalPlatformFee: { $sum: '$platformFee' },
            },
        },
    ]);

    const revenue = revenueResult[0] || { totalRevenue: 0, totalPlatformFee: 0 };

    return {
        totalUsers,
        totalVendors,
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue: revenue.totalRevenue,
        totalPlatformFee: revenue.totalPlatformFee,
    };
};

export const getUsers = async ({ page = 1, limit = 20, role }) => {
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return {
        users,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
    };
};

export const toggleUserActive = async (targetId, adminId) => {
    const user = await User.findById(targetId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    if (user._id.toString() === adminId.toString()) {
        const error = new Error('Cannot toggle your own active status');
        error.statusCode = 400;
        throw error;
    }

    user.isActive = !user.isActive;
    await user.save();

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    };
};

export const getCommissionSummary = async () => {
    const result = await Order.aggregate([
        { $match: { status: { $in: ['Paid', 'Shipped', 'Delivered'] } } },
        { $unwind: '$items' },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$items.itemRevenue' },
                totalPlatformFee: { $sum: '$items.platformFee' },
                totalVendorPayout: { $sum: '$items.vendorPayout' },
                totalItemsSold: { $sum: '$items.qty' },
            },
        },
    ]);

    const summary = result[0] || {
        totalRevenue: 0,
        totalPlatformFee: 0,
        totalVendorPayout: 0,
        totalItemsSold: 0,
    };

    const vendorBreakdown = await Order.aggregate([
        { $match: { status: { $in: ['Paid', 'Shipped', 'Delivered'] } } },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.vendorId',
                revenue: { $sum: '$items.itemRevenue' },
                platformFee: { $sum: '$items.platformFee' },
                vendorPayout: { $sum: '$items.vendorPayout' },
                itemsSold: { $sum: '$items.qty' },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'vendor',
            },
        },
        { $unwind: '$vendor' },
        {
            $project: {
                vendorId: '$_id',
                vendorName: '$vendor.name',
                vendorEmail: '$vendor.email',
                revenue: 1,
                platformFee: 1,
                vendorPayout: 1,
                itemsSold: 1,
            },
        },
        { $sort: { revenue: -1 } },
    ]);

    return {
        commissionRate: '10%',
        ...summary,
        vendorBreakdown,
    };
};

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Order = (await import("./models/Order.js")).default;
        
        const vendorId = new mongoose.Types.ObjectId("67c191a6d95393c06be957be");
        
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
        
        console.log("=== MONTHLY REVENUE PAYLOAD ===");
        console.dir(monthlyRevenue, {depth: null});
        
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
test();

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Order = (await import("./models/Order.js")).default;
        
        const orders = await Order.find().populate('customerId', 'name email').sort({createdAt: -1}).limit(5);
        
        console.log("=== LATEST 5 ORDERS ===");
        orders.forEach((o, i) => {
            console.log(`Order ${i + 1}: ID = ${o._id}`);
            console.log(`  Raw customerId in DB: ${o.get('customerId')}`);
            console.log(`  Populated customerId:`, o.customerId);
            console.log(`  Status: ${o.status}`);
        });
        
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
test();

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Product = (await import("./models/Product.js")).default;
        
        const vendorId = new mongoose.Types.ObjectId("67c191a6d95393c06be957be");
        
        const products = await Product.find({
            vendorid: vendorId,
            isActive: true,
            stock: { $lte: 5 },
        }).select('name stock images');
        
        console.log(`Found ${products.length} low-stock products for vendor:`);
        console.dir(products, {depth: null});
        
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
test();

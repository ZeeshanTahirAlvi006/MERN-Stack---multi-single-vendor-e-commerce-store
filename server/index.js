import dotenv from 'dotenv';
dotenv.config();
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/',(req,res)=>{
    res.send('API is running...');
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
import Product from '../models/Product.js';

export const getAllProducts = async ({ category, search, priceMin, priceMax, page = 1, limit = 12 }) => {
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    if (priceMin !== undefined || priceMax !== undefined) {
        query.price = {};
        if (priceMin !== undefined && priceMin !== '') query.price.$gte = Number(priceMin);
        if (priceMax !== undefined && priceMax !== '') query.price.$lte = Number(priceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('vendorid', 'name storeInfo.name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return {
        products,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        total,
    };
};

export const getProductById = async (id) => {
    const product = await Product.findById(id)
        .populate('vendorid', 'name email');

    if (!product || !product.isActive) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    return product;
};

export const createProduct = async (data, vendorId) => {
    const { name, description, price, images, stock, category } = data;

    const product = await Product.create({
        name,
        description,
        price,
        images: images || [],
        stock: stock || 0,
        category,
        vendorid: vendorId,
    });

    return product;
};

export const updateProduct = async (id, data, user) => {
    const product = await Product.findById(id);

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (product.vendorid.toString() !== user._id.toString() && user.role !== 'admin') {
        const error = new Error('Not authorized to update this product');
        error.statusCode = 403;
        throw error;
    }

    const { name, description, price, images, stock, category, isActive } = data;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.images = images ?? product.images;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.isActive = isActive ?? product.isActive;

    return await product.save();
};

export const deleteProduct = async (id, user) => {
    const product = await Product.findById(id);

    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (product.vendorid.toString() !== user._id.toString() && user.role !== 'admin') {
        const error = new Error('Not authorized to delete this product');
        error.statusCode = 403;
        throw error;
    }

    product.isActive = false;
    await product.save();
    return { message: 'Product removed' };
};

export const getVendorProducts = async (vendorId) => {
    return await Product.find({ vendorid: vendorId, isActive: true })
        .sort({ createdAt: -1 });
};

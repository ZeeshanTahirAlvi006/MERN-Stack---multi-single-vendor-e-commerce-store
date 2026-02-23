import Product from '../models/Product.js';

// @desc    Get all products (public)
// @route   GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;

        const query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('vendorid', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            products,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by ID (public)
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('vendorid', 'name email');

        if (!product || !product.isActive) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (vendor only)
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, images, stock, category } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            images: images || [],
            stock: stock || 0,
            category,
            vendorid: req.user._id,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product (vendor — own products only)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Vendor can only update their own products
        if (product.vendorid.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const { name, description, price, images, stock, category, isActive } = req.body;

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.images = images ?? product.images;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;
        product.isActive = isActive ?? product.isActive;

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Soft delete a product (vendor — own products only, or admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.vendorid.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        product.isActive = false;
        await product.save();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor's own products
// @route   GET /api/products/vendor/mine
export const getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendorid: req.user._id })
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

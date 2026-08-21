import Product from '../models/Product.js';

// @desc    Fetch all products (supports ?category=, ?search=, ?page=, ?limit=, ?sort=, ?minPrice=, ?maxPrice=)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = req.query.limit ? Number(req.query.limit) : 12;
        const page = req.query.page ? Number(req.query.page) : 1;

        // Build filter object
        const filter = {};

        // Text search
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        // Category filter — case-insensitive exact match
        if (req.query.category) {
            filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
        }

        // Tag filter
        if (req.query.tag) {
            filter.tags = req.query.tag;
        }

        // Price range
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        // Sorting
        let sortObj = { createdAt: -1 }; // newest first by default
        if (req.query.sort === 'price_asc') sortObj = { price: 1 };
        if (req.query.sort === 'price_desc') sortObj = { price: -1 };
        if (req.query.sort === 'newest') sortObj = { createdAt: -1 };
        if (req.query.sort === 'oldest') sortObj = { createdAt: 1 };

        // If no pagination params → return all (backward compat)
        if (!req.query.page && !req.query.limit) {
            const products = await Product.find(filter).sort(sortObj).lean();
            return res.json(products);
        }

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sortObj)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .lean();

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/AdminOrLister
const createProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name || 'Sample name',
        price: req.body.price || 0,
        category: req.body.category || 'Sample category',
        image: req.body.images && req.body.images.length > 0 ? req.body.images[0] : (req.body.image || ''),
        images: req.body.images || [],
        imageColor: req.body.imageColor || '#cccccc',
        imageText: req.body.imageText || 'Sample image',
        inStock: req.body.inStock !== undefined ? req.body.inStock : true,
        isNew: req.body.isNew !== undefined ? req.body.isNew : false,
        badge: req.body.badge || '',
        description: req.body.description || 'Sample description',
        tags: req.body.tags || [],
        specs: req.body.specs || {},
        sizes: req.body.sizes || [],
    });

    try {
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/AdminOrLister
const updateProduct = async (req, res) => {
    const { name, price, description, category, badge, image, images, imageColor, imageText, inStock, isNew, tags, specs, sizes } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price !== undefined ? price : product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.badge = badge !== undefined ? badge : product.badge;
            product.images = images !== undefined ? images : product.images;
            product.image = images && images.length > 0 ? images[0] : (image !== undefined ? image : product.image);
            product.imageColor = imageColor || product.imageColor;
            product.imageText = imageText || product.imageText;
            product.inStock = inStock !== undefined ? inStock : product.inStock;
            product.isNew = isNew !== undefined ? isNew : product.isNew;
            product.tags = tags || product.tags;
            product.specs = specs || product.specs;
            product.sizes = sizes || product.sizes;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/AdminOrLister
const deleteProduct = async (req, res) => {
    try {
        console.log('[DEBUG DELETE] Received ID:', req.params.id);
        const product = await Product.findById(req.params.id);
        console.log('[DEBUG DELETE] Found product in DB:', product ? product.name : 'null');

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('[DEBUG DELETE] Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

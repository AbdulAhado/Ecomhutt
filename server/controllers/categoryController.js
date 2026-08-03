import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 }).lean();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get hero categories (showInHero = true)
// @route   GET /api/categories/hero
// @access  Public
const getHeroCategories = async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true, showInHero: true }).sort({ order: 1 }).lean();
    if (!categories || categories.length === 0) {
      categories = await Category.find({ isActive: true }).sort({ order: 1 }).limit(5).lean();
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, slug, icon, description, image, isActive, showInHero, order } = req.body;

  try {
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const count = await Category.countDocuments();
    const category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      icon: icon || '🛒',
      description: description || '',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
      showInHero: showInHero !== undefined ? showInHero : false,
      order: order !== undefined ? order : count,
    });

    const created = await category.save();
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const { name, slug, icon, description, image, isActive, showInHero, order } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name !== undefined ? name : category.name;
    category.slug = slug !== undefined ? slug : category.slug;
    category.icon = icon !== undefined ? icon : category.icon;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    category.showInHero = showInHero !== undefined ? showInHero : category.showInHero;
    category.order = order !== undefined ? order : category.order;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getCategories, getHeroCategories, createCategory, updateCategory, deleteCategory };

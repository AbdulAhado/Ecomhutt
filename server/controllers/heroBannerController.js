import HeroBanner from '../models/HeroBanner.js';

// @desc    Fetch all hero banners sorted by order
// @route   GET /api/herobanners
// @access  Public
const getHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.find({}).sort({ order: 1 }).lean();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a hero banner
// @route   POST /api/herobanners
// @access  Private/Admin
const createHeroBanner = async (req, res) => {
  const { image, title, subtitle, description, buttonText, buttonLink, isActive, order } = req.body;

  try {
    // Auto-assign order if not provided
    const count = await HeroBanner.countDocuments();
    const banner = new HeroBanner({
      image,
      title,
      subtitle: subtitle || '',
      description: description || '',
      buttonText: buttonText || 'Shop Now',
      buttonLink: buttonLink || '/shop',
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : count,
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a hero banner
// @route   PUT /api/herobanners/:id
// @access  Private/Admin
const updateHeroBanner = async (req, res) => {
  const { image, title, subtitle, description, buttonText, buttonLink, isActive, order } = req.body;

  try {
    const banner = await HeroBanner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    banner.image = image !== undefined ? image : banner.image;
    banner.title = title !== undefined ? title : banner.title;
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
    banner.description = description !== undefined ? description : banner.description;
    banner.buttonText = buttonText !== undefined ? buttonText : banner.buttonText;
    banner.buttonLink = buttonLink !== undefined ? buttonLink : banner.buttonLink;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;
    banner.order = order !== undefined ? order : banner.order;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a hero banner
// @route   DELETE /api/herobanners/:id
// @access  Private/Admin
const deleteHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);

    if (banner) {
      await HeroBanner.deleteOne({ _id: banner._id });
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getHeroBanners, createHeroBanner, updateHeroBanner, deleteHeroBanner };

import HeroBanner from '../models/HeroBanner.js';

// @desc    Fetch all active hero banners
// @route   GET /api/herobanners
// @access  Public
const getHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a hero banner
// @route   POST /api/herobanners
// @access  Private/Admin
const createHeroBanner = async (req, res) => {
  const { image, title, subtitle, buttonText, buttonLink, isActive } = req.body;

  try {
    const banner = new HeroBanner({
      image,
      title,
      subtitle,
      buttonText,
      buttonLink,
      isActive: isActive !== undefined ? isActive : true,
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
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

export { getHeroBanners, createHeroBanner, deleteHeroBanner };

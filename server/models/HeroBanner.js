import mongoose from 'mongoose';

const heroBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    buttonText: {
      type: String,
      default: 'Shop Now',
    },
    buttonLink: {
      type: String,
      default: '/shop',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const HeroBanner = mongoose.model('HeroBanner', heroBannerSchema);

export default HeroBanner;

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
    },
    images: [{
      type: String,
    }],
    imageColor: {
      type: String,
      required: true,
    },
    imageText: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    description: {
      type: String,
    },
    specs: {
      material: String,
      origin: String,
      care: String,
    },
    sizes: [String],
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Add Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;

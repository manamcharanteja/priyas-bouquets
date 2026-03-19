const mongoose = require('mongoose');

const sareeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    category: {
      type: String,
      enum: ['Pre-Wedding Outfits', 'Designer Wear Dresses', 'Mom & Daughter Combos', 'Maggam Work Blouses', 'Lehengas'],
      default: 'Designer Wear Dresses',
    },
    colors: [{ type: String }],
    images: [{ type: String }], // Cloudinary URLs
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Saree', sareeSchema);

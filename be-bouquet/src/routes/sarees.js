const express = require('express');
const Saree = require('../models/Saree');
const { protect } = require('../middleware/authMiddleware');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

// GET /api/sarees - public, with filters
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, minPrice, maxPrice, inStock } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (inStock === 'true') filter.inStock = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sarees = await Saree.find(filter).sort({ createdAt: -1 });
    res.json(sarees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/sarees/:id - public
router.get('/:id', async (req, res) => {
  try {
    const saree = await Saree.findById(req.params.id);
    if (!saree) return res.status(404).json({ message: 'Saree not found' });
    res.json(saree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/sarees - admin only, with image upload
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files.map((f) => f.path);
    const colors = req.body.colors ? JSON.parse(req.body.colors) : [];
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    const saree = await Saree.create({
      ...req.body,
      colors,
      tags,
      images,
    });
    res.status(201).json(saree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/sarees/:id - admin only
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const saree = await Saree.findById(req.params.id);
    if (!saree) return res.status(404).json({ message: 'Saree not found' });

    const newImages = req.files.map((f) => f.path);
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : saree.images;

    const colors = req.body.colors ? JSON.parse(req.body.colors) : saree.colors;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : saree.tags;

    const updated = await Saree.findByIdAndUpdate(
      req.params.id,
      { ...req.body, colors, tags, images: [...existingImages, ...newImages] },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/sarees/:id - admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const saree = await Saree.findByIdAndDelete(req.params.id);
    if (!saree) return res.status(404).json({ message: 'Saree not found' });

    // Delete images from Cloudinary
    for (const imageUrl of saree.images) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`true-spark/${publicId}`);
    }

    res.json({ message: 'Saree deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

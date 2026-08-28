const express = require('express');
const router = express.Router();
const GalleryAlbum = require('../models/GalleryAlbum');
const { protect } = require('../middleware/auth');

// @route GET /api/gallery
router.get('/', async (req, res, next) => {
  try {
    const { category, q, status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (category) query.category = category;

    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.headers.authorization && !status) {
      query.status = 'published';
    }

    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }

    const albums = await GalleryAlbum.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await GalleryAlbum.countDocuments(query);

    res.json({
      success: true,
      count: albums.length,
      total,
      data: albums,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/gallery/:id
router.get('/:id', async (req, res, next) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);
    if (!album) return res.status(404).json({ success: false, message: 'Gallery album not found' });
    res.json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/gallery
router.post('/', protect, async (req, res, next) => {
  try {
    const album = await GalleryAlbum.create(req.body);
    res.status(201).json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/gallery/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const album = await GalleryAlbum.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!album) return res.status(404).json({ success: false, message: 'Gallery album not found' });
    res.json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/gallery/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const album = await GalleryAlbum.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ success: false, message: 'Gallery album not found' });
    res.json({ success: true, message: 'Gallery album deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

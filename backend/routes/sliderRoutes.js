const express = require('express');
const router = express.Router();
const SliderBanner = require('../models/SliderBanner');
const { protect } = require('../middleware/auth');

// @route GET /api/sliders
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.headers.authorization && !status) {
      query.status = 'published';
      query.isActive = true;
    }

    const sliders = await SliderBanner.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: sliders.length, data: sliders });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/sliders
router.post('/', protect, async (req, res, next) => {
  try {
    const slider = await SliderBanner.create(req.body);
    res.status(201).json({ success: true, data: slider });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/sliders/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const slider = await SliderBanner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!slider) return res.status(404).json({ success: false, message: 'Slider banner not found' });
    res.json({ success: true, data: slider });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/sliders/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const slider = await SliderBanner.findByIdAndDelete(req.params.id);
    if (!slider) return res.status(404).json({ success: false, message: 'Slider banner not found' });
    res.json({ success: true, message: 'Slider banner deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');
const { protect } = require('../middleware/auth');

// @route GET /api/committees
router.get('/', async (req, res, next) => {
  try {
    const { type, status } = req.query;
    let query = {};

    if (type) query.type = type;

    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.headers.authorization && !status) {
      query.status = 'published';
    }

    const committees = await Committee.find(query).sort({ name: 1 });
    res.json({ success: true, count: committees.length, data: committees });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/committees/:id
router.get('/:id', async (req, res, next) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) return res.status(404).json({ success: false, message: 'Committee not found' });
    res.json({ success: true, data: committee });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/committees
router.post('/', protect, async (req, res, next) => {
  try {
    const committee = await Committee.create(req.body);
    res.status(201).json({ success: true, data: committee });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/committees/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const committee = await Committee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!committee) return res.status(404).json({ success: false, message: 'Committee not found' });
    res.json({ success: true, data: committee });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/committees/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const committee = await Committee.findByIdAndDelete(req.params.id);
    if (!committee) return res.status(404).json({ success: false, message: 'Committee not found' });
    res.json({ success: true, message: 'Committee deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Programme = require('../models/Programme');
const { protect } = require('../middleware/auth');

// @route GET /api/programmes
router.get('/', async (req, res, next) => {
  try {
    const { level, department, q, status, page = 1, limit = 50 } = req.query;
    let query = {};

    if (level) query.level = level;
    if (department) query.department = department;

    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.headers.authorization && !status) {
      query.status = 'published';
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { shortCode: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
      ];
    }

    const programmes = await Programme.find(query)
      .sort({ level: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Programme.countDocuments(query);

    res.json({
      success: true,
      count: programmes.length,
      total,
      data: programmes,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/programmes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const programme = await Programme.findById(req.params.id);
    if (!programme) return res.status(404).json({ success: false, message: 'Programme not found' });
    res.json({ success: true, data: programme });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/programmes
router.post('/', protect, async (req, res, next) => {
  try {
    const programme = await Programme.create(req.body);
    res.status(201).json({ success: true, data: programme });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/programmes/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const programme = await Programme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!programme) return res.status(404).json({ success: false, message: 'Programme not found' });
    res.json({ success: true, data: programme });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/programmes/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const programme = await Programme.findByIdAndDelete(req.params.id);
    if (!programme) return res.status(404).json({ success: false, message: 'Programme not found' });
    res.json({ success: true, message: 'Programme deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

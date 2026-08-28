const express = require('express');
const router = express.Router();
const FacultyStaff = require('../models/FacultyStaff');
const { protect } = require('../middleware/auth');

// @route GET /api/faculty
router.get('/', async (req, res, next) => {
  try {
    const { type, department, q, status, page = 1, limit = 50 } = req.query;
    let query = {};

    if (type) query.type = type;
    if (department) query.department = department;

    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.headers.authorization && !status) {
      query.status = 'published';
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { designation: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
      ];
    }

    const faculty = await FacultyStaff.find(query)
      .sort({ order: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await FacultyStaff.countDocuments(query);

    res.json({
      success: true,
      count: faculty.length,
      total,
      data: faculty,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/faculty/:id
router.get('/:id', async (req, res, next) => {
  try {
    const member = await FacultyStaff.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Faculty member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/faculty
router.post('/', protect, async (req, res, next) => {
  try {
    const member = await FacultyStaff.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/faculty/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const member = await FacultyStaff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ success: false, message: 'Faculty member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/faculty/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const member = await FacultyStaff.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Faculty member not found' });
    res.json({ success: true, message: 'Faculty member deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

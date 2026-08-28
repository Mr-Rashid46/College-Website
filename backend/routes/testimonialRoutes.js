const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/auth');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route GET /api/testimonials
router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    } else if (!req.headers.authorization && !status) {
      query.isActive = true;
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { role: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { quote: { $regex: q, $options: 'i' } },
      ];
    }

    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/testimonials
router.post('/', protect, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    await logAuditEvent({
      req,
      action: 'CREATE_TESTIMONIAL',
      resource: 'Testimonial',
      resourceId: testimonial._id,
      details: `Created testimonial for: ${testimonial.name}`,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/testimonials/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    await logAuditEvent({
      req,
      action: 'UPDATE_TESTIMONIAL',
      resource: 'Testimonial',
      resourceId: testimonial._id,
      details: `Updated testimonial for: ${testimonial.name}`,
    });

    res.json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/testimonials/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    await logAuditEvent({
      req,
      action: 'DELETE_TESTIMONIAL',
      resource: 'Testimonial',
      resourceId: req.params.id,
      details: `Deleted testimonial for: ${testimonial.name}`,
    });

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

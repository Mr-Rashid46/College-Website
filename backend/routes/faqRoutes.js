const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');
const { protect } = require('../middleware/auth');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route GET /api/faqs
router.get('/', async (req, res, next) => {
  try {
    const { category, q, status } = req.query;
    let query = {};

    if (category && category !== 'ALL') query.category = category;

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    } else if (!req.headers.authorization && !status) {
      query.isActive = true;
    }

    if (q) {
      query.$or = [
        { question: { $regex: q, $options: 'i' } },
        { answer: { $regex: q, $options: 'i' } },
        { keywords: { $regex: q, $options: 'i' } },
      ];
    }

    const faqs = await Faq.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/faqs
router.post('/', protect, async (req, res, next) => {
  try {
    const faq = await Faq.create(req.body);

    await logAuditEvent({
      req,
      action: 'CREATE_FAQ',
      resource: 'Faq',
      resourceId: faq._id,
      details: `Created FAQ: ${faq.question}`,
    });

    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/faqs/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ item not found' });

    await logAuditEvent({
      req,
      action: 'UPDATE_FAQ',
      resource: 'Faq',
      resourceId: faq._id,
      details: `Updated FAQ: ${faq.question}`,
    });

    res.json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/faqs/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ item not found' });

    await logAuditEvent({
      req,
      action: 'DELETE_FAQ',
      resource: 'Faq',
      resourceId: req.params.id,
      details: `Deleted FAQ: ${faq.question}`,
    });

    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

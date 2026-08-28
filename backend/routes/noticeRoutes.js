const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect } = require('../middleware/auth');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route GET /api/notices
router.get('/', async (req, res, next) => {
  try {
    const { category, isFeatured, q, status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    // If request is from public (no auth token provided)
    if (!req.headers.authorization) {
      query.status = 'published';
      // Filter out notices scheduled for the future
      query.publishDate = { $lte: new Date() };
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }

    const notices = await Notice.find(query)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Notice.countDocuments(query);

    res.json({
      success: true,
      count: notices.length,
      total,
      data: notices,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/notices/:id
router.get('/:id', async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, data: notice });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/notices
router.post('/', protect, async (req, res, next) => {
  try {
    const notice = await Notice.create(req.body);
    await logAuditEvent({
      req,
      action: 'CREATE_NOTICE',
      resource: 'Notice',
      resourceId: notice._id,
      details: `Created notice: "${notice.title}"`,
    });
    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/notices/bulk
// @desc Bulk perform actions (delete, publish, unpublish) on multiple notices
router.post('/bulk', protect, async (req, res, next) => {
  try {
    const { action, ids } = req.body; // action: 'delete' | 'publish' | 'unpublish'

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No notice IDs provided' });
    }

    let resultMessage = '';

    if (action === 'delete') {
      await Notice.deleteMany({ _id: { $in: ids } });
      resultMessage = `Successfully deleted ${ids.length} notices.`;
    } else if (action === 'publish') {
      await Notice.updateMany({ _id: { $in: ids } }, { status: 'published' });
      resultMessage = `Successfully published ${ids.length} notices.`;
    } else if (action === 'unpublish') {
      await Notice.updateMany({ _id: { $in: ids } }, { status: 'draft' });
      resultMessage = `Successfully moved ${ids.length} notices to drafts.`;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid bulk action specified.' });
    }

    await logAuditEvent({
      req,
      action: `BULK_${action.toUpperCase()}_NOTICES`,
      resource: 'Notice',
      details: `${resultMessage} (IDs: ${ids.join(', ')})`,
    });

    res.json({ success: true, message: resultMessage });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/notices/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    
    await logAuditEvent({
      req,
      action: 'UPDATE_NOTICE',
      resource: 'Notice',
      resourceId: notice._id,
      details: `Updated notice: "${notice.title}"`,
    });

    res.json({ success: true, data: notice });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/notices/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    await logAuditEvent({
      req,
      action: 'DELETE_NOTICE',
      resource: 'Notice',
      resourceId: req.params.id,
      details: `Deleted notice: "${notice.title}"`,
    });

    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

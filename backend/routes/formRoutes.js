const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');
const { protect } = require('../middleware/auth');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route POST /api/forms/submit (Public custom form submission)
router.post('/submit', async (req, res, next) => {
  try {
    const { pageSlug, formTitle, formData } = req.body;
    if (!pageSlug || !formData) {
      return res.status(400).json({ success: false, message: 'Invalid form submission data' });
    }

    const submission = await FormSubmission.create({
      pageSlug,
      formTitle: formTitle || 'Custom Form',
      formData,
    });

    res.status(201).json({
      success: true,
      message: 'Your form submission has been successfully received!',
      data: submission,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/forms/submissions (Admin list custom form submissions)
router.get('/submissions', protect, async (req, res, next) => {
  try {
    const { pageSlug, isRead, q, page = 1, limit = 50 } = req.query;
    let query = {};

    if (pageSlug) query.pageSlug = pageSlug;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const submissions = await FormSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await FormSubmission.countDocuments(query);
    const unreadCount = await FormSubmission.countDocuments({ isRead: false });

    res.json({
      success: true,
      count: submissions.length,
      unreadCount,
      total,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/forms/submissions/:id/read (Admin toggle read)
router.put('/submissions/:id/read', protect, async (req, res, next) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    submission.isRead = req.body.isRead !== undefined ? req.body.isRead : !submission.isRead;
    await submission.save();

    res.json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/forms/submissions/:id (Admin delete submission)
router.delete('/submissions/:id', protect, async (req, res, next) => {
  try {
    const submission = await FormSubmission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    await logAuditEvent({
      req,
      action: 'DELETE_FORM_SUBMISSION',
      resource: 'FormSubmission',
      resourceId: req.params.id,
      details: `Deleted custom form submission from ${submission.pageSlug}`,
    });

    res.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

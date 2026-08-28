const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    // Increment visitor counter atomically on public requests
    if (!req.headers.authorization && req.query.incVisitor !== 'false') {
      settings = await SiteSettings.findByIdAndUpdate(
        settings._id,
        { $inc: { visitorCounter: 1 } },
        { new: true }
      );
    }

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/settings
router.put('/', protect, async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await logAuditEvent({
      req,
      action: 'UPDATE_SITE_SETTINGS',
      resource: 'Settings',
      resourceId: settings._id,
      details: 'Updated global site settings (branding, SEO, SMTP & alert options)',
    });

    res.json({ success: true, message: 'Site settings updated successfully', data: settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

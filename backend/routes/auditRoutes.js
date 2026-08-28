const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, requireRole } = require('../middleware/auth');

// @route GET /api/audit-logs
// @desc  Get paginated audit logs for admin audit view
router.get('/', protect, requireRole('superadmin', 'editor'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const resourceFilter = req.query.resource || '';
    const actionFilter = req.query.action || '';

    const query = {};
    if (resourceFilter) {
      query.resource = resourceFilter;
    }
    if (actionFilter) {
      query.action = { $regex: actionFilter, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: logs.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

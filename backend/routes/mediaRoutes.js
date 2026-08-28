const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const { protect } = require('../middleware/auth');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route GET /api/media
// @desc  Get paginated list of uploaded files for Media Library
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const type = req.query.type || ''; // 'image', 'document', or ''

    const query = {};

    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    if (type === 'image') {
      query.mimeType = { $regex: '^image/', $options: 'i' };
    } else if (type === 'document') {
      query.mimeType = { $not: { $regex: '^image/', $options: 'i' } };
    }

    const skip = (page - 1) * limit;
    const total = await Media.countDocuments(query);
    const mediaFiles = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'name email');

    res.json({
      success: true,
      count: mediaFiles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: mediaFiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/media/:id
// @desc  Update media item metadata (e.g. alt text)
router.put('/:id', protect, async (req, res) => {
  try {
    const { altText } = req.body;
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    media.altText = altText !== undefined ? altText : media.altText;
    await media.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_MEDIA_ALT_TEXT',
      resource: 'Media',
      resourceId: media._id,
      details: `Updated alt text for ${media.originalName}`,
    });

    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/media/:id
// @desc  Delete media file from disk and database
router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media file not found' });
    }

    const filePath = path.join(__dirname, '../uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(req.params.id);

    await logAuditEvent({
      req,
      action: 'DELETE_MEDIA_FILE',
      resource: 'Media',
      resourceId: req.params.id,
      details: `Deleted media file: ${media.originalName}`,
    });

    res.json({ success: true, message: 'Media file deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const Media = require('../models/Media');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route POST /api/upload
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const altText = req.body.altText || req.file.originalname;

    const mediaDoc = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      altText,
      uploadedBy: req.user ? req.user._id : null,
    });

    await logAuditEvent({
      req,
      action: 'UPLOAD_FILE',
      resource: 'Media',
      resourceId: mediaDoc._id,
      details: `Uploaded file: ${req.file.originalname} (${req.file.mimetype}, ${(req.file.size / 1024).toFixed(1)} KB)`,
    });

    res.json({
      success: true,
      mediaId: mediaDoc._id,
      fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      altText,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/upload/multiple
router.post('/multiple', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const createdDocs = [];

    for (const file of req.files) {
      const fileUrl = `/uploads/${file.filename}`;
      const mediaDoc = await Media.create({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        altText: file.originalname,
        uploadedBy: req.user ? req.user._id : null,
      });
      createdDocs.push(mediaDoc);
    }

    await logAuditEvent({
      req,
      action: 'UPLOAD_MULTIPLE_FILES',
      resource: 'Media',
      details: `Uploaded ${createdDocs.length} files.`,
    });

    res.json({
      success: true,
      count: createdDocs.length,
      files: createdDocs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

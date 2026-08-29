const express = require('express');
const router = express.Router();
const path = require('path');

const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const Media = require('../models/Media');
const cloudinary = require('../config/cloudinary');
const { logAuditEvent } = require('../middleware/auditMiddleware');


// Determine the correct Cloudinary resource_type based on file mimetype
const getCloudinaryResourceType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'raw';
  if (
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) return 'raw';
  return 'auto';
};

// Generate a safe Cloudinary public ID
const generatePublicId = (originalName) => {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);

  const cleanName = baseName
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `college-cms/${cleanName || 'file'}-${Date.now()}`;
};


// Upload buffer to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const publicId = generatePublicId(file.originalname);
    const resourceType = getCloudinaryResourceType(file.mimetype);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        folder: undefined,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};


// @route POST /api/upload
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file);

    const altText =
      req.body.altText || req.file.originalname;

    // Save Cloudinary information in MongoDB
    const mediaDoc = await Media.create({
      filename: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,

      url: cloudinaryResult.secure_url,

      publicId: cloudinaryResult.public_id,

      resourceType: cloudinaryResult.resource_type,

      altText,

      uploadedBy: req.user ? req.user._id : null,
    });

    await logAuditEvent({
      req,
      action: 'UPLOAD_FILE',
      resource: 'Media',
      resourceId: mediaDoc._id,
      details: `Uploaded file: ${req.file.originalname} (${req.file.mimetype}, ${(req.file.size / 1024).toFixed(1)} KB) to Cloudinary`,
    });

    res.json({
      success: true,

      mediaId: mediaDoc._id,

      fileUrl: cloudinaryResult.secure_url,

      filename: req.file.originalname,

      originalName: req.file.originalname,

      mimetype: req.file.mimetype,

      size: req.file.size,

      altText,

      publicId: cloudinaryResult.public_id,

      resourceType: cloudinaryResult.resource_type,
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'File upload failed',
    });
  }
});


// @route POST /api/upload/multiple
router.post(
  '/multiple',
  protect,
  upload.array('files', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
      }

      const createdDocs = [];

      for (const file of req.files) {

        // Upload each file to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(file);

        const mediaDoc = await Media.create({
          filename: file.originalname,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,

          url: cloudinaryResult.secure_url,

          publicId: cloudinaryResult.public_id,

          resourceType: cloudinaryResult.resource_type,

          altText: file.originalname,

          uploadedBy: req.user ? req.user._id : null,
        });

        createdDocs.push(mediaDoc);
      }

      await logAuditEvent({
        req,
        action: 'UPLOAD_MULTIPLE_FILES',
        resource: 'Media',
        details: `Uploaded ${createdDocs.length} files to Cloudinary.`,
      });

      res.json({
        success: true,
        count: createdDocs.length,
        files: createdDocs,
      });

    } catch (error) {
      console.error('Cloudinary multiple upload error:', error);

      res.status(500).json({
        success: false,
        message: error.message || 'File upload failed',
      });
    }
  }
);


module.exports = router;
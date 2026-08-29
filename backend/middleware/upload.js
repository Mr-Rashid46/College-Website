const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const allowedExts = /\.(jpeg|jpg|png|gif|webp|svg|pdf|doc|docx)$/i;
  const extName = allowedExts.test(path.extname(file.originalname));
  const mimeTypeValid = allowedMimeTypes.includes(file.mimetype);

  if (extName && mimeTypeValid) {
    return cb(null, true);
  }

  cb(
    new Error(
      'Invalid file format. Only JPEG, PNG, WEBP, GIF, SVG images and PDF/DOC documents are allowed.'
    )
  );
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter,
});

module.exports = upload;
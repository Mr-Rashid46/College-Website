const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    // Cloudinary public ID used for deleting the file
    publicId: {
      type: String,
      required: true,
    },

    // Cloudinary resource type: image, video, raw, etc.
    resourceType: {
      type: String,
      default: 'image',
    },

    altText: {
      type: String,
      default: '',
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
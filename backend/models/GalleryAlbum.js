const mongoose = require('mongoose');

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Event', 'Sports', 'Cultural', 'Campus'],
      default: 'Event',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryAlbum', galleryAlbumSchema);

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Menu label is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL or slug is required'],
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isExternal: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);

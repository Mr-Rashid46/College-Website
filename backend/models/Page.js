const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    blocks: [
      {
        type: {
          type: String,
          enum: ['hero_banner', 'rich_text', 'cards_grid', 'custom_form', 'accordion_faqs', 'file_downloads'],
        },
        data: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
    parentMenu: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);

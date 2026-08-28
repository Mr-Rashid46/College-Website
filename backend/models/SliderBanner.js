const mongoose = require('mongoose');

const sliderBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    linkUrl: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SliderBanner', sliderBannerSchema);

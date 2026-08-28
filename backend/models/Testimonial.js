const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student/Alumni name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Programme / Graduation Year or Role is required'],
      default: 'B.Tech Graduate',
    },
    company: {
      type: String,
      default: '',
    },
    quote: {
      type: String,
      required: [true, 'Testimonial quote text is required'],
    },
    photo: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);

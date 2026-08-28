const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Programme name is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ['UG', 'PG', 'Diploma', 'Certificate'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    eligibility: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    syllabusFileUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '3 Years',
    },
    seats: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Programme', programmeSchema);

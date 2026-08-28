const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Committee name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Statutory', 'Non-Statutory'],
      default: 'Statutory',
    },
    description: {
      type: String,
      default: '',
    },
    membersList: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
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

module.exports = mongoose.model('Committee', committeeSchema);

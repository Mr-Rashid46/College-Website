const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema(
  {
    pageSlug: {
      type: String,
      required: true,
      index: true,
    },
    formTitle: {
      type: String,
      default: 'Dynamic Page Form',
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);

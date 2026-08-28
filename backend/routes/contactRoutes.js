const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactSubmission = require('../models/ContactSubmission');
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');
const { createCaptchaChallenge, verifyCaptcha } = require('../middleware/captchaMiddleware');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// Helper to send emails asynchronously without blocking response
const sendContactEmails = async ({ name, email, subject, message, phone }) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings || !settings.smtpSettings || !settings.smtpSettings.enabled || !settings.smtpSettings.host) {
      console.log('SMTP settings not configured. Email notifications skipped.');
      return;
    }

    const { host, port, user, pass, fromEmail, adminNotificationEmail } = settings.smtpSettings;

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: { user, pass },
    });

    // 1. Send Admin Notification Email
    await transporter.sendMail({
      from: `"${settings.collegeName || 'DBATU CMS'}" <${fromEmail}>`,
      to: adminNotificationEmail || 'admin@dbatu.ac.in',
      subject: `[New Website Enquiry] ${subject}`,
      html: `
        <h3>New Contact Enquiry Submitted</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #0284c7;">${message}</blockquote>
        <p><small>Sent automatically from ${settings.collegeName} Website</small></p>
      `,
    });

    // 2. Send Auto-Reply Confirmation to Submitter
    await transporter.sendMail({
      from: `"${settings.collegeName || 'DBATU Lonere'}" <${fromEmail}>`,
      to: email,
      subject: `Thank you for contacting ${settings.shortName || 'DBATU Lonere'}`,
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to ${settings.collegeName}. We have received your inquiry regarding "<strong>${subject}</strong>".</p>
        <p>Our administrative team will review your message and get back to you shortly.</p>
        <br/>
        <p>Best regards,<br/><strong>University Registrar Office</strong><br/>${settings.collegeName}</p>
      `,
    });
  } catch (err) {
    console.error('Failed to send contact notification email:', err.message);
  }
};

// @route GET /api/contact/captcha
// @desc Request a new Math CAPTCHA Challenge
router.get('/captcha', createCaptchaChallenge);

// @route POST /api/contact (Public submit form with CAPTCHA verification)
router.post('/', contactLimiter, verifyCaptcha, async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Dispatch emails asynchronously
    sendContactEmails({ name, email, subject, message, phone });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      data: submission,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/contact (Admin list submissions)
router.get('/', protect, async (req, res, next) => {
  try {
    const { isRead, q, page = 1, limit = 20 } = req.query;
    let query = {};

    if (isRead !== undefined) query.isRead = isRead === 'true';

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
      ];
    }

    const submissions = await ContactSubmission.find(query)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ContactSubmission.countDocuments(query);
    const unreadCount = await ContactSubmission.countDocuments({ isRead: false });

    res.json({
      success: true,
      count: submissions.length,
      unreadCount,
      total,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/contact/:id/read (Admin toggle read)
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    submission.isRead = req.body.isRead !== undefined ? req.body.isRead : !submission.isRead;
    await submission.save();

    res.json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/contact/:id (Admin delete)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    
    await logAuditEvent({
      req,
      action: 'DELETE_CONTACT_SUBMISSION',
      resource: 'ContactSubmission',
      resourceId: req.params.id,
      details: `Deleted contact submission from ${submission.email}`,
    });

    res.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

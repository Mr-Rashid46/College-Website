const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect } = require('../middleware/auth');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// Helper to generate clean slug
const formatSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// @route GET /api/pages
router.get('/', async (req, res, next) => {
  try {
    const { q, status, page = 1, limit = 50 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.headers.authorization && !status) {
      query.status = 'published';
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }

    const pages = await Page.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Page.countDocuments(query);

    res.json({
      success: true,
      count: pages.length,
      total,
      data: pages,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/pages/slug/:slug
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/pages/:id
router.get('/:id', async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/pages
router.post('/', protect, async (req, res, next) => {
  try {
    let { title, slug, content, blocks, parentMenu, order, seoTitle, seoDescription, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Page title is required' });
    }

    if (!slug || !slug.trim()) {
      slug = formatSlug(title);
    } else {
      slug = formatSlug(slug);
    }

    // Check duplicate slug
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const page = await Page.create({
      title,
      slug,
      content: content || '',
      blocks: blocks || [],
      parentMenu: parentMenu || '',
      order: Number(order) || 0,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || '',
      status: status || 'published',
    });

    await logAuditEvent({
      req,
      action: 'CREATE_PAGE',
      resource: 'Page',
      resourceId: page._id,
      details: `Created page "${page.title}" (slug: /page/${page.slug})`,
    });

    res.status(201).json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/pages/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const pageToUpdate = await Page.findById(req.params.id);
    if (!pageToUpdate) return res.status(404).json({ success: false, message: 'Page not found' });

    let updateData = { ...req.body };

    if (updateData.title && (!updateData.slug || !updateData.slug.trim())) {
      updateData.slug = pageToUpdate.slug || formatSlug(updateData.title);
    } else if (updateData.slug) {
      updateData.slug = formatSlug(updateData.slug);
    }

    const page = await Page.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    await logAuditEvent({
      req,
      action: 'UPDATE_PAGE',
      resource: 'Page',
      resourceId: page._id,
      details: `Updated page "${page.title}" (slug: /page/${page.slug})`,
    });

    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/pages/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

    await logAuditEvent({
      req,
      action: 'DELETE_PAGE',
      resource: 'Page',
      resourceId: req.params.id,
      details: `Deleted page "${page.title}"`,
    });

    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

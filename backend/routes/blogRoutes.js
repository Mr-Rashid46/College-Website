const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

// @route GET /api/blogs
router.get('/', async (req, res, next) => {
  try {
    const { tag, q, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (tag) query.tags = tag;

    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.headers.authorization && !status) {
      query.status = 'published';
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/blogs/slug/:slug
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/blogs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/blogs
router.post('/', protect, async (req, res, next) => {
  try {
    let { title, slug, author, coverImage, content, tags, publishDate, status } = req.body;
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const blog = await Blog.create({
      title,
      slug,
      author,
      coverImage,
      content,
      tags,
      publishDate,
      status,
    });
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/blogs/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/blogs/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

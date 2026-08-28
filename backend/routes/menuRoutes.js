const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');

// Helper to construct nested menu tree
const buildTree = (items, parentId = null) => {
  return items
    .filter((item) => (item.parentId ? item.parentId.toString() === (parentId ? parentId.toString() : null) : parentId === null))
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item.toObject(),
      children: buildTree(items, item._id),
    }));
};

// @route GET /api/menu
router.get('/', async (req, res, next) => {
  try {
    const { status, raw } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    } else if (!status && !req.headers.authorization) {
      query.status = 'published';
    }

    const items = await MenuItem.find(query).sort({ order: 1 });

    if (raw === 'true') {
      return res.json({ success: true, count: items.length, data: items });
    }

    const tree = buildTree(items);
    res.json({ success: true, count: tree.length, data: tree });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/menu
router.post('/', protect, async (req, res, next) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: menuItem });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/menu/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!menuItem) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.json({ success: true, data: menuItem });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/menu/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) return res.status(404).json({ success: false, message: 'Menu item not found' });

    // Remove child items or re-parent them
    await MenuItem.deleteMany({ parentId: req.params.id });

    res.json({ success: true, message: 'Menu item and sub-items deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validatePasswordStrength } = require('../utils/security');
const { logAuditEvent } = require('../middleware/auditMiddleware');

// @route POST /api/auth/login
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact superadmin.' });
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign(
      { id: user._id, role: user.role, tokenVersion: user.tokenVersion || 0 },
      process.env.JWT_SECRET || 'college_cms_super_secret_jwt_key_2026',
      { expiresIn: process.env.JWT_EXPIRE || '8h' }
    );

    // Record login audit event
    await logAuditEvent({
      req: { ...req, user },
      action: 'USER_LOGIN',
      resource: 'User',
      resourceId: user._id,
      details: `Successful login by ${user.email} (${user.role})`,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// User Management Routes (Superadmin only)
router.get('/users', protect, requireRole('superadmin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
});

router.post('/users', protect, requireRole('superadmin'), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate password policy
    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, message: passCheck.message });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    const newUser = await User.create({ name, email, password, role });
    
    await logAuditEvent({
      req,
      action: 'CREATE_USER',
      resource: 'User',
      resourceId: newUser._id,
      details: `Created new admin user: ${email} (${role})`,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id', protect, requireRole('superadmin'), async (req, res, next) => {
  try {
    const { name, email, role, isActive, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (password) {
      const passCheck = validatePasswordStrength(password);
      if (!passCheck.valid) {
        return res.status(400).json({ success: false, message: passCheck.message });
      }
      user.password = password;
      user.passwordChangedAt = new Date();
      user.tokenVersion = (user.tokenVersion || 0) + 1; // invalidates active sessions
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    await logAuditEvent({
      req,
      action: 'UPDATE_USER',
      resource: 'User',
      resourceId: user._id,
      details: `Updated admin user: ${user.email}`,
    });

    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', protect, requireRole('superadmin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.deleteOne();

    await logAuditEvent({
      req,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: req.params.id,
      details: `Deleted admin user: ${user.email}`,
    });

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

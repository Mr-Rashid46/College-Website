const AuditLog = require('../models/AuditLog');

const logAuditEvent = async ({ req, action, resource, resourceId = '', details = '' }) => {
  try {
    const userId = req.user ? req.user._id : null;
    const userName = req.user ? req.user.name || req.user.email : 'Anonymous / System';
    const userRole = req.user ? req.user.role : 'guest';
    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    if (typeof ipAddress === 'string' && ipAddress.includes(',')) {
      ipAddress = ipAddress.split(',')[0].trim();
    }
    if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
      ipAddress = '127.0.0.1 (Localhost)';
    }
    const userAgent = req.headers['user-agent'] || '';

    await AuditLog.create({
      userId,
      userName,
      userRole,
      action,
      resource,
      resourceId: String(resourceId),
      details,
      ipAddress: String(ipAddress),
      userAgent: String(userAgent),
    });
  } catch (err) {
    console.error('AuditLog error:', err.message);
  }
};

module.exports = {
  logAuditEvent,
};

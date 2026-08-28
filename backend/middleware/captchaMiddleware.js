const { generateCaptcha } = require('../utils/security');

// In-memory token store for math captcha (for simple production use)
// Maps token -> { answer, expiresAt }
const captchaStore = new Map();

// Cleanup expired captcha tokens every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of captchaStore.entries()) {
    if (data.expiresAt < now) {
      captchaStore.delete(token);
    }
  }
}, 15 * 60 * 1000);

// Endpoint handler to issue a new captcha challenge
const createCaptchaChallenge = (req, res) => {
  const { question, answer } = generateCaptcha();
  const captchaId = 'cap_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
  
  captchaStore.set(captchaId, {
    answer: String(answer).trim(),
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes valid
  });

  res.json({
    success: true,
    captchaId,
    question,
  });
};

// Middleware to verify submitted CAPTCHA
const verifyCaptcha = (req, res, next) => {
  const { captchaId, captchaAnswer } = req.body;

  // If captcha credentials missing
  if (!captchaId || captchaAnswer === undefined || captchaAnswer === null || captchaAnswer === '') {
    return res.status(400).json({
      success: false,
      message: 'CAPTCHA verification is required. Please solve the security math challenge.',
    });
  }

  const stored = captchaStore.get(captchaId);
  if (!stored) {
    return res.status(400).json({
      success: false,
      message: 'CAPTCHA expired or invalid. Please request a new security challenge.',
    });
  }

  if (Date.now() > stored.expiresAt) {
    captchaStore.delete(captchaId);
    return res.status(400).json({
      success: false,
      message: 'CAPTCHA has expired. Please try again.',
    });
  }

  if (String(captchaAnswer).trim() !== stored.answer) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect CAPTCHA answer. Please try again.',
    });
  }

  // Single use: delete used CAPTCHA
  captchaStore.delete(captchaId);
  next();
};

module.exports = {
  createCaptchaChallenge,
  verifyCaptcha,
};

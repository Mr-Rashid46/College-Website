/**
 * Security & Utility Helpers for Production CMS
 */

// Simple strong password validation
const validatePasswordStrength = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit.' };
  }
  return { valid: true, message: 'Password meets complexity requirements.' };
};

// Generate Math CAPTCHA Challenge
const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let answer = 0;
  if (operator === '+') {
    answer = num1 + num2;
  } else {
    // ensure positive result
    const max = Math.max(num1, num2);
    const min = Math.min(num1, num2);
    answer = max - min;
    return {
      question: `What is ${max} ${operator} ${min}?`,
      answer: String(answer),
    };
  }

  return {
    question: `What is ${num1} ${operator} ${num2}?`,
    answer: String(answer),
  };
};

// Sanitizes uploaded filename to prevent directory traversal or script injection
const sanitizeFilename = (originalName) => {
  return originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.\.+/g, '.')
    .toLowerCase();
};

module.exports = {
  validatePasswordStrength,
  generateCaptcha,
  sanitizeFilename,
};

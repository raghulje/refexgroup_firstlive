const { body, validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const status = require('../helpers/response');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) =>
      status.responseStatus(res, 500, "Internal error", { error: e.message })
    );
  };
}

// Validation rules for contact form
const contactFormValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters'),
  body('enquiringFor')
    .optional()
    .trim()
    .isIn(['Sales', 'Support', 'General', 'Partnership', 'Media', 'Other'])
    .withMessage('Invalid enquiry type'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// Export validation for use in routes
exports.contactFormValidation = contactFormValidation;

// Submit contact form
exports.submit = asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return status.responseStatus(res, 400, "Validation failed", { errors: errors.array() });
  }

  try {
    const { name, email, phone, enquiringFor, message } = req.body;

    // Send email
    const emailResult = await emailService.sendContactFormEmail({
      name,
      email,
      phone: phone || '',
      enquiringFor: enquiringFor || 'General',
      message
    });

    if (emailResult.success) {
      return status.responseStatus(res, 200, "Contact form submitted successfully", {
        message: 'Thank you for contacting us. We will get back to you soon.',
        messageId: emailResult.messageId
      });
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('❌ Contact form submission error:', error);
    
    // Check if it's a configuration error
    if (error.message.includes('not configured') || error.message.includes('credentials') || error.message.includes('SMTP')) {
      return status.responseStatus(res, 500, "Email configuration error", {
        error: 'Email service is not properly configured. Please check Email Settings in the CMS.',
        details: error.message
      });
    }

    // Return the specific error message from email service
    const errorMessage = error.message || 'An error occurred while submitting your message. Please try again later.';
    
    return status.responseStatus(res, 500, "Failed to submit contact form", {
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test email configuration
exports.testEmail = asyncHandler(async (req, res) => {
  try {
    const result = await emailService.testEmailConfig();
    
    if (result.success) {
      return status.responseStatus(res, 200, "Email configuration is valid", result);
    } else {
      return status.responseStatus(res, 400, "Email configuration test failed", result);
    }
  } catch (error) {
    console.error('Email test error:', error);
    return status.responseStatus(res, 500, "Email test error", {
      error: error.message
    });
  }
});

// Get email configuration (for admin)
exports.getEmailConfig = asyncHandler(async (req, res) => {
  try {
    const config = await emailService.getEmailConfig();
    
    // Don't expose password in response
    const safeConfig = {
      host: config.host,
      port: config.port,
      secure: config.secure,
      from: config.from,
      fromName: config.fromName,
      contactEmail: config.contactEmail,
      hasAuth: !!(config.auth && config.auth.user)
    };

    return status.responseStatus(res, 200, "OK", safeConfig);
  } catch (error) {
    console.error('Get email config error:', error);
    return status.responseStatus(res, 500, "Error", { error: error.message });
  }
});


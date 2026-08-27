const { body, validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const status = require('../helpers/response');
const { processContactFormSubmission } = require('../helpers/contactFormProcessor');
const {
  evaluateContactSubmission,
  recordSuccessfulSubmission,
  buildSpamSuccessResponse,
  isDuplicateWithinWindow,
} = require('../helpers/spamProtection');

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) =>
      status.responseStatus(res, 500, 'Internal error', { error: e.message })
    );
  };
}

const contactFormValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name must be less than 100 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name must be less than 100 characters'),
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
    .withMessage('Message must be between 10 and 2000 characters'),
  body().custom((_, { req }) => {
    const name =
      req.body?.name ||
      [req.body?.firstName, req.body?.lastName].filter(Boolean).join(' ').trim();
    if (!name || name.length < 2) {
      throw new Error('Name is required and must be at least 2 characters');
    }
    return true;
  }),
];

function resolveEndpointMeta(req) {
  return req.contactFormMeta || { endpoint: 'contact-form', formName: 'Contact form' };
}

exports.contactFormValidation = contactFormValidation;

exports.submit = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return status.responseStatus(res, 400, 'Validation failed', { errors: errors.array() });
  }

  try {
    return await processContactFormSubmission(req, res, resolveEndpointMeta(req));
  } catch (error) {
    console.error('❌ Contact form submission error:', error);

    if (
      error.message.includes('not configured') ||
      error.message.includes('credentials') ||
      error.message.includes('SMTP')
    ) {
      return status.responseStatus(res, 500, 'Email configuration error', {
        error: 'Email service is not properly configured. Please check Email Settings in the CMS.',
        details: error.message,
      });
    }

    return status.responseStatus(res, 500, 'Failed to submit contact form', {
      error: error.message || 'An error occurred while submitting your message. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

exports.checkEnquiry = asyncHandler(async (req, res) => {
  const email = req.body?.email || '';
  const exists = isDuplicateWithinWindow(email);
  let field;

  if (exists) {
    field = 'email';
  }

  return status.responseStatus(res, 200, 'OK', { exists, field });
});

exports.testEmail = asyncHandler(async (req, res) => {
  try {
    const result = await emailService.testEmailConfig();

    if (result.success) {
      return status.responseStatus(res, 200, 'Email configuration is valid', result);
    }

    return status.responseStatus(res, 400, 'Email configuration test failed', result);
  } catch (error) {
    console.error('Email test error:', error);
    return status.responseStatus(res, 500, 'Email test error', {
      error: error.message,
    });
  }
});

exports.getEmailConfig = asyncHandler(async (req, res) => {
  try {
    const config = await emailService.getEmailConfig();

    const safeConfig = {
      host: config.host,
      port: config.port,
      secure: config.secure,
      from: config.from,
      fromName: config.fromName,
      contactEmail: config.contactEmail,
      hasAuth: !!(config.auth && config.auth.user),
    };

    return status.responseStatus(res, 200, 'OK', safeConfig);
  } catch (error) {
    console.error('Get email config error:', error);
    return status.responseStatus(res, 500, 'Error', { error: error.message });
  }
});

exports.__spamHelpers = {
  evaluateContactSubmission,
  recordSuccessfulSubmission,
  buildSpamSuccessResponse,
};

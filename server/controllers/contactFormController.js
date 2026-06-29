const { body, validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const status = require('../helpers/response');
const { getRequestMeta, phoneToDigitsOnly } = require('../helpers/requestMeta');
const { sendToKissflowWebhook } = require('../helpers/kissflowWebhook');
const { resolveWebsiteNameFromProduct } = require('../helpers/kissflowWebsiteName');

const AGENT_ID = '69c3c8e8509229d0a7c085dc';

function splitCityAndState(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return { cityname: '', statename: '' };
  }

  const [cityname = '', ...rest] = raw.split(',');
  return {
    cityname: cityname.trim(),
    statename: rest.join(',').trim(),
  };
}

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
    const { name, email, phone, city, product, enquiringFor, message, company } = req.body;
    const phoneDigits = phoneToDigitsOnly(phone || '');
    const meta = getRequestMeta(req);
    const { cityname, statename } = splitCityAndState(city);

    // Kissflow webhook: queue and send asynchronously (do not await)
    const webhookData = {
      name,
      email,
      Phone_Number: phoneDigits,
      agentid: AGENT_ID,
      // Standard payload expects `company` to always exist
      company: company ?? '',
      ...(city && { city }),
      ...(cityname && { cityname }),
      ...(statename && { statename }),
      ...(product && { Product: product }),
      message,
      ...(enquiringFor && { enquiringFor }),
      ...meta
    };
    const kissflowWebsiteName = resolveWebsiteNameFromProduct(product);
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[Kissflow] Refex Group contact: product="${product || ''}" → websiteName="${kissflowWebsiteName}"`
      );
    }
    sendToKissflowWebhook(kissflowWebsiteName, 'Contact form', webhookData);

    // Send email in background (best-effort), so API response is not blocked by SMTP delays.
    setImmediate(async () => {
      try {
        await emailService.sendContactFormEmail({
          name,
          email,
          phone: phone || '',
          city: city || '',
          product: product || '',
          enquiringFor: enquiringFor || 'General',
          message
        });
      } catch (emailError) {
        console.error('❌ RefexGroup contact email failed (continuing to Kissflow):', emailError?.message || emailError);
      }
    });

    // Send auto-reply to customer in background (best-effort)
    setImmediate(async () => {
      try {
        await emailService.sendContactAutoReplyEmail({
          name,
          email,
          phone: phone || '',
          city: city || '',
          product: product || '',
          enquiringFor: enquiringFor || 'General',
          message
        });
      } catch (autoReplyError) {
        console.warn('⚠️ RefexGroup contact auto-reply failed (continuing):', autoReplyError?.message || autoReplyError);
      }
    });

    // Always return success (so UI doesn't show error) when validation passed and webhook was queued.
    return status.responseStatus(res, 200, "Contact form submitted successfully", {
      message: 'Thank you for contacting us. We will get back to you soon.',
      // Email is sent asynchronously; response should not wait for SMTP completion.
    });
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


/**
 * Shared contact-form processing: spam gate, Kissflow webhook, and email notifications.
 */

const emailService = require('../services/emailService');
const status = require('./response');
const { getRequestMeta, phoneToDigitsOnly } = require('./requestMeta');
const { sendToKissflowWebhook } = require('./kissflowWebhook');
const { resolveWebsiteNameFromProduct } = require('./kissflowWebsiteName');
const {
  evaluateContactSubmission,
  recordSuccessfulSubmission,
  buildSpamSuccessResponse,
} = require('./spamProtection');

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

function normalizeSubmissionBody(body = {}, meta = {}) {
  const name =
    body.name ||
    [body.firstName, body.lastName].filter(Boolean).join(' ').trim() ||
    '';

  return {
    name,
    email: body.email || '',
    phone: body.phone || '',
    city: body.city || '',
    product: body.product || meta.defaultProduct || '',
    enquiringFor: body.enquiringFor || 'General',
    message: body.message || '',
    company: body.company || '',
    source: body.source || meta.source || '',
  };
}

async function processContactFormSubmission(req, res, meta = {}) {
  const endpoint = meta.endpoint || 'contact-form';
  const submission = normalizeSubmissionBody(req.body, meta);
  const { name, email, phone, city, product, enquiringFor, message, company, source } = submission;

  const spamCheck = evaluateContactSubmission({
    fields: req.body,
    email,
    phone,
    endpoint,
  });

  if (spamCheck.blocked) {
    return buildSpamSuccessResponse(res, status);
  }

  const phoneDigits = phoneToDigitsOnly(phone || '');
  const requestMeta = getRequestMeta(req);
  const { cityname, statename } = splitCityAndState(city);

  const webhookData = {
    name,
    email,
    Phone_Number: phoneDigits,
    agentid: AGENT_ID,
    company: company ?? '',
    ...(city && { city }),
    ...(cityname && { cityname }),
    ...(statename && { statename }),
    ...(product && { Product: product }),
    message,
    ...(enquiringFor && { enquiringFor }),
    ...(source && { source }),
    ...requestMeta,
  };

  const kissflowWebsiteName = meta.websiteName || resolveWebsiteNameFromProduct(product);
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[Kissflow] ${endpoint}: product="${product || ''}" → websiteName="${kissflowWebsiteName}"`
    );
  }

  sendToKissflowWebhook(kissflowWebsiteName, meta.formName || 'Contact form', webhookData);

  setImmediate(async () => {
    try {
      await emailService.sendContactFormEmail({
        name,
        email,
        phone: phone || '',
        city: city || '',
        product: product || '',
        enquiringFor: enquiringFor || 'General',
        message,
      });
    } catch (emailError) {
      console.error(`❌ ${endpoint} contact email failed:`, emailError?.message || emailError);
    }
  });

  setImmediate(async () => {
    try {
      await emailService.sendContactAutoReplyEmail({
        name,
        email,
        phone: phone || '',
        city: city || '',
        product: product || '',
        enquiringFor: enquiringFor || 'General',
        message,
      });
    } catch (autoReplyError) {
      console.warn(`⚠️ ${endpoint} contact auto-reply failed:`, autoReplyError?.message || autoReplyError);
    }
  });

  recordSuccessfulSubmission(email);

  return status.responseStatus(res, 200, 'Contact form submitted successfully', {
    message: 'Thank you for contacting us. We will get back to you soon.',
  });
}

module.exports = {
  processContactFormSubmission,
  normalizeSubmissionBody,
  AGENT_ID,
};

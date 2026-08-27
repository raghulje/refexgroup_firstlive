/**
 * Server-side spam / abuse protection for public contact-form endpoints.
 */

const { phoneToDigitsOnly } = require('./requestMeta');

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

/** @type {Map<string, number>} */
const recentSubmissionsByEmail = new Map();

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'yopmail.com',
  'throwaway.email',
  'getnada.com',
  'sharklasers.com',
  'trashmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'maildrop.cc',
  'mintemail.com',
  'tempail.com',
  'emailondeck.com',
]);

const BLOCKED_PHONE_DIGITS = new Set([
  '918234567890',
  '8234567890',
  '919876542123',
  '9876543210',
  '987654321',
  '1234567890',
  '0123456789',
  '1111111111',
  '9999999999',
  '0000000000',
]);

const HTML_TAG_PATTERN = /<[^>]+>/i;
const XSS_PATTERNS = [
  HTML_TAG_PATTERN,
  /<\s*script\b/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /data\s*:\s*text\/html/i,
  /&#x?[0-9a-f]+;?/i,
];

const PROBE_EMAIL_LOCAL_PATTERNS = [
  /^test$/i,
  /^test\d+$/i,
  /^testinginjection$/i,
  /^testing.*injection$/i,
  /^fake(email|user|test)?$/i,
  /^spam\d*$/i,
];

function normalizeEmailKey(email) {
  return String(email || '').trim().toLowerCase();
}

function redactEmail(email) {
  const normalized = normalizeEmailKey(email);
  const at = normalized.indexOf('@');
  if (at <= 0) return '[invalid-email]';
  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

function redactPhone(phone) {
  const digits = phoneToDigitsOnly(phone);
  if (!digits) return '[none]';
  if (digits.length <= 4) return '***';
  return `***${digits.slice(-4)}`;
}

function collectStringFields(value, path = '', out = []) {
  if (value == null) return out;
  if (typeof value === 'string') {
    out.push({ path: path || 'value', value });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStringFields(item, `${path}[${index}]`, out));
    return out;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, nested]) => {
      const nextPath = path ? `${path}.${key}` : key;
      collectStringFields(nested, nextPath, out);
    });
  }
  return out;
}

function containsHtmlOrXss(value) {
  const text = String(value || '');
  if (!text.trim()) return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(text));
}

function isDisposableOrProbeEmail(email) {
  const normalized = normalizeEmailKey(email);
  const at = normalized.indexOf('@');
  if (at <= 0) return true;

  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  const localNormalized = local.replace(/[^a-z0-9]/g, '');

  if (PROBE_EMAIL_LOCAL_PATTERNS.some((pattern) => pattern.test(local) || pattern.test(localNormalized))) {
    return true;
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return true;
  }

  // Common throwaway subdomains
  if (/^(mail|temp|fake|trash|spam|test)\./i.test(domain)) {
    return true;
  }

  return false;
}

function isSequentialDigitRun(value, minLength = 8) {
  if (!value || value.length < minLength) return false;

  let ascending = 1;
  let descending = 1;

  for (let i = 1; i < value.length; i += 1) {
    const prev = Number(value[i - 1]);
    const curr = Number(value[i]);
    if (Number.isNaN(prev) || Number.isNaN(curr)) return false;
    ascending = curr === prev + 1 ? ascending + 1 : 1;
    descending = curr === prev - 1 ? descending + 1 : 1;
    if (ascending >= minLength || descending >= minLength) return true;
  }

  return false;
}

function isSuspiciousPhone(phone) {
  const digits = phoneToDigitsOnly(phone);
  if (!digits) return false;

  if (BLOCKED_PHONE_DIGITS.has(digits)) return true;

  const candidates = [digits];
  if (digits.length > 10 && digits.startsWith('91')) {
    candidates.push(digits.slice(-10));
  } else if (digits.length === 10) {
    candidates.push(`91${digits}`);
  }

  for (const candidate of candidates) {
    if (BLOCKED_PHONE_DIGITS.has(candidate)) return true;

    const local = candidate.length > 10 ? candidate.slice(-10) : candidate;
    if (local.length >= 10 && /^(\d)\1{7,}$/.test(local)) return true;
    if (local.length >= 10 && isSequentialDigitRun(local, 8)) return true;
  }

  return false;
}

function isDuplicateWithinWindow(email) {
  const key = normalizeEmailKey(email);
  if (!key) return false;

  const lastSubmittedAt = recentSubmissionsByEmail.get(key);
  if (!lastSubmittedAt) return false;

  return Date.now() - lastSubmittedAt < DUPLICATE_WINDOW_MS;
}

function recordSuccessfulSubmission(email) {
  const key = normalizeEmailKey(email);
  if (!key) return;

  recentSubmissionsByEmail.set(key, Date.now());
  pruneDuplicateStore();
}

function pruneDuplicateStore() {
  const cutoff = Date.now() - DUPLICATE_WINDOW_MS;
  for (const [email, submittedAt] of recentSubmissionsByEmail.entries()) {
    if (submittedAt < cutoff) {
      recentSubmissionsByEmail.delete(email);
    }
  }
}

function logIgnoredSubmission({ endpoint, reason, email, phone, field }) {
  console.warn('[SpamProtection] Ignored spam submission.', {
    endpoint: endpoint || 'contact-form',
    reason,
    field: field || undefined,
    email: redactEmail(email),
    phone: redactPhone(phone),
  });
}

/**
 * Evaluate a contact-form submission before Kissflow/email side effects.
 * @param {Object} params
 * @param {Record<string, unknown>} [params.fields]
 * @param {string} params.email
 * @param {string} [params.phone]
 * @param {string} [params.endpoint]
 * @returns {{ blocked: boolean, reason?: string, field?: string }}
 */
function evaluateContactSubmission({ fields = {}, email, phone, endpoint = 'contact-form' }) {
  for (const { path, value } of collectStringFields(fields)) {
    if (containsHtmlOrXss(value)) {
      logIgnoredSubmission({ endpoint, reason: 'xss_or_html', email, phone, field: path });
      return { blocked: true, reason: 'xss_or_html', field: path };
    }
  }

  if (isDisposableOrProbeEmail(email)) {
    logIgnoredSubmission({ endpoint, reason: 'disposable_or_probe_email', email, phone });
    return { blocked: true, reason: 'disposable_or_probe_email', field: 'email' };
  }

  if (phone && isSuspiciousPhone(phone)) {
    logIgnoredSubmission({ endpoint, reason: 'suspicious_phone', email, phone, field: 'phone' });
    return { blocked: true, reason: 'suspicious_phone', field: 'phone' };
  }

  if (isDuplicateWithinWindow(email)) {
    logIgnoredSubmission({ endpoint, reason: 'duplicate_within_10_minutes', email, phone });
    return { blocked: true, reason: 'duplicate_within_10_minutes', field: 'email' };
  }

  return { blocked: false };
}

function buildSpamSuccessResponse(res, statusHelper) {
  const payload = {
    message: 'Thank you for contacting us. We will get back to you soon.',
  };
  return statusHelper.responseStatus(res, 200, 'Contact form submitted successfully', payload);
}

module.exports = {
  DUPLICATE_WINDOW_MS,
  evaluateContactSubmission,
  recordSuccessfulSubmission,
  isDuplicateWithinWindow,
  containsHtmlOrXss,
  isDisposableOrProbeEmail,
  isSuspiciousPhone,
  logIgnoredSubmission,
  buildSpamSuccessResponse,
  redactEmail,
  redactPhone,
  __testOnly: {
    recentSubmissionsByEmail,
    resetDuplicateStore: () => recentSubmissionsByEmail.clear(),
  },
};

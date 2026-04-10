/**
 * Request metadata helpers for contact form and analytics.
 */

/**
 * Normalize phone to digits only.
 * @param {string} phone - Raw phone input
 * @returns {string} Digits-only string
 */
function phoneToDigitsOnly(phone) {
  if (phone == null || phone === '') return '';
  return String(phone).replace(/\D/g, '');
}

/**
 * Parse User-Agent string into device type and browser.
 * @param {string} ua - User-Agent header
 * @returns {{ deviceType: string, browser: string }}
 */
function parseUserAgent(ua) {
  if (!ua || typeof ua !== 'string') {
    return { deviceType: 'unknown', browser: 'unknown' };
  }
  const u = ua.toLowerCase();
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(u)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(u)) {
    deviceType = 'tablet';
  }
  let browser = 'unknown';
  if (u.includes('edg/')) browser = 'Edge';
  else if (u.includes('chrome/') && !u.includes('edg')) browser = 'Chrome';
  else if (u.includes('firefox/')) browser = 'Firefox';
  else if (u.includes('safari/') && !u.includes('chrome')) browser = 'Safari';
  else if (u.includes('opr/') || u.includes('opera')) browser = 'Opera';
  else if (u.includes('msie') || u.includes('trident/')) browser = 'IE';
  return { deviceType, browser };
}

/**
 * Get request metadata from Express request.
 * @param {import('express').Request} req
 * @returns {{
 *   timestamp: number,
 *   dateTime: string,
 *   date: string,
 *   time: string,
 *   ipAddress: string,
 *   userAgent: string,
 *   deviceType: string,
 *   browser: string,
 *   countryCode: string,
 *   referer: string,
 *   source: string
 * }}
 */
function getRequestMeta(req) {
  const now = new Date();
  const userAgent = req.get('user-agent') || req.get('User-Agent') || '';
  const { deviceType, browser } = parseUserAgent(userAgent);
  const referer = req.get('referer') || req.get('referrer') || '';
  const source = referer || (req.query && req.query.source) || (req.query && req.query.utm_source) || '';

  return {
    timestamp: now.getTime(),
    dateTime: now.toISOString(),
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 8),
    ipAddress: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || (req.headers && (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim()) || '',
    userAgent,
    deviceType,
    browser,
    countryCode: (req.headers && (req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || req.headers['x-country-code'])) || '',
    referer,
    source: source || ''
  };
}

module.exports = {
  getRequestMeta,
  phoneToDigitsOnly,
  parseUserAgent
};

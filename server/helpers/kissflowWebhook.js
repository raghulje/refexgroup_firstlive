/**
 * Kissflow webhook integration: queue submissions and send to webhook asynchronously.
 * Worker processes one item at a time with a delay between requests.
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');

const KISSFLOW_WEBHOOK_URL = 'https://refexgroup.kissflow.com/integration/2/AcCMptlq60zH/webhook/4e9yNyjAD6uxENJXAhNbtXzEGuOVQbDukBaeyWoG0kkqoeCkhIaxbK8FF4sWPWtcuQema2TcT-gLfVu3ot6g';

const QUEUE_DELAY_MS = 3500; // 3–4 seconds between requests
const WEBSITE_SLUG = 'refexgroup';

const queue = [];
let isProcessing = false;

/**
 * Generate a short random string for submissionId.
 * @returns {string}
 */
function randomString() {
  return crypto.randomBytes(6).toString('hex');
}

/**
 * Generate unique submission ID: websiteSlug-Date.now()-random
 * @returns {string}
 */
function generateSubmissionId() {
  return `${WEBSITE_SLUG}-${Date.now()}-${randomString()}`;
}

/**
 * POST payload to Kissflow webhook. Does not throw.
 * @param {object} payload - JSON body
 * @returns {Promise<void>}
 */
function postToWebhook(payload) {
  return new Promise((resolve) => {
    const url = new URL(KISSFLOW_WEBHOOK_URL);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    const body = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body, 'utf8')
      }
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('[Kissflow] Webhook sent successfully:', res.statusCode);
        } else {
          console.warn('[Kissflow] Webhook returned:', res.statusCode, data?.slice(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.warn('[Kissflow] Webhook request error (non-fatal):', err.message);
      resolve();
    });

    req.setTimeout(15000, () => {
      req.destroy();
      console.warn('[Kissflow] Webhook request timeout');
      resolve();
    });

    req.write(body);
    req.end();
  });
}

/**
 * Process one item from the queue and schedule next after delay.
 */
async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const item = queue.shift();
  if (!item) {
    isProcessing = false;
    return;
  }

  const { websiteName, formName, formData } = item;
  const submissionId = generateSubmissionId();
  const websiteAndForm = `${websiteName} - ${formName}`;

  const payload = {
    ...formData,
    submissionId,
    websiteName,
    formName,
    Website_and_form: websiteAndForm
  };

  try {
    await postToWebhook(payload);
  } catch (_) {
    // postToWebhook never throws; log anyway for safety
    console.warn('[Kissflow] Unexpected error in worker');
  }

  // Delay before processing next
  await new Promise((r) => setTimeout(r, QUEUE_DELAY_MS));
  isProcessing = false;

  if (queue.length > 0) {
    setImmediate(processQueue);
  }
}

/**
 * Queue a submission for the Kissflow webhook. Does not block.
 * @param {string} websiteName - e.g. "Refex Group"
 * @param {string} formName - e.g. "Contact form"
 * @param {object} formData - Form fields + request metadata (name, email, phone, etc.)
 */
function sendToKissflowWebhook(websiteName, formName, formData) {
  queue.push({ websiteName, formName, formData });
  processQueue();
}

module.exports = {
  sendToKissflowWebhook,
  generateSubmissionId
};

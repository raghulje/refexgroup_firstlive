/**
 * Spam protection tests for all contact-form endpoints.
 * Run: node scripts/test_spam_protection.js
 */

const assert = require('assert');
const {
  evaluateContactSubmission,
  recordSuccessfulSubmission,
  containsHtmlOrXss,
  isDisposableOrProbeEmail,
  isSuspiciousPhone,
  DUPLICATE_WINDOW_MS,
  __testOnly,
} = require('../helpers/spamProtection');
const { normalizeSubmissionBody } = require('../helpers/contactFormProcessor');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
  }
}

function validPayload(overrides = {}) {
  return {
    name: 'Raghul Customer',
    email: 'raghul.customer@company.com',
    phone: '9876512340',
    city: 'Chennai, Tamil Nadu',
    product: 'General Enquiry',
    enquiringFor: 'Sales',
    message: 'I would like to know more about your services and offerings.',
    ...overrides,
  };
}

function resetState() {
  __testOnly.resetDuplicateStore();
}

console.log('\nSpam protection unit tests\n');

resetState();

test('allows a legitimate submission', () => {
  const result = evaluateContactSubmission({
    fields: validPayload(),
    email: 'raghul.customer@company.com',
    phone: '9876512340',
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, false);
});

test('blocks XSS script payload in message', () => {
  const fields = validPayload({ message: "<script>alert('1')</script>" });
  const result = evaluateContactSubmission({
    fields,
    email: fields.email,
    phone: fields.phone,
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, true);
  assert.strictEqual(result.reason, 'xss_or_html');
});

test('blocks HTML injection in message', () => {
  const fields = validPayload({ message: '<h1>Testing Injection</h1>' });
  const result = evaluateContactSubmission({
    fields,
    email: fields.email,
    phone: fields.phone,
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, true);
  assert.strictEqual(result.reason, 'xss_or_html');
});

test('blocks disposable probe email test@gmail.com', () => {
  assert.strictEqual(isDisposableOrProbeEmail('test@gmail.com'), true);
  const result = evaluateContactSubmission({
    fields: validPayload({ email: 'test@gmail.com' }),
    email: 'test@gmail.com',
    phone: '9876512340',
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, true);
  assert.strictEqual(result.reason, 'disposable_or_probe_email');
});

test('blocks probe email TestingInjection@gmail.com', () => {
  assert.strictEqual(isDisposableOrProbeEmail('TestingInjection@gmail.com'), true);
  const result = evaluateContactSubmission({
    fields: validPayload({ email: 'TestingInjection@gmail.com' }),
    email: 'TestingInjection@gmail.com',
    phone: '9876512340',
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, true);
  assert.strictEqual(result.reason, 'disposable_or_probe_email');
});

test('blocks suspicious phone 918234567890', () => {
  assert.strictEqual(isSuspiciousPhone('918234567890'), true);
});

test('blocks suspicious phone 8234567890', () => {
  assert.strictEqual(isSuspiciousPhone('8234567890'), true);
});

test('blocks suspicious phone 919876542123', () => {
  assert.strictEqual(isSuspiciousPhone('919876542123'), true);
});

test('blocks suspicious phone in submission evaluation', () => {
  const result = evaluateContactSubmission({
    fields: validPayload({ phone: '919876542123' }),
    email: 'customer@example.com',
    phone: '919876542123',
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, true);
  assert.strictEqual(result.reason, 'suspicious_phone');
});

test('blocks duplicate submission within 10 minutes', () => {
  resetState();
  const email = 'unique.customer@example.com';
  recordSuccessfulSubmission(email);

  const result = evaluateContactSubmission({
    fields: validPayload({ email }),
    email,
    phone: '9876512340',
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, true);
  assert.strictEqual(result.reason, 'duplicate_within_10_minutes');
});

test('allows resubmission after duplicate window expires', () => {
  resetState();
  const email = 'window.customer@example.com';
  __testOnly.recentSubmissionsByEmail.set(email, Date.now() - DUPLICATE_WINDOW_MS - 1000);

  const result = evaluateContactSubmission({
    fields: validPayload({ email }),
    email,
    phone: '9876512340',
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, false);
});

test('detects HTML in any field including name', () => {
  assert.strictEqual(containsHtmlOrXss('<b>name</b>'), true);
  const result = evaluateContactSubmission({
    fields: validPayload({ name: '<img src=x onerror=alert(1)>' }),
    email: 'customer@example.com',
    phone: '9876512340',
    endpoint: 'contact-form',
  });
  assert.strictEqual(result.blocked, true);
});

const endpointCases = [
  ['contact-form', 'contact-form'],
  ['business-commute', 'business-commute'],
  ['ets', 'ets'],
  ['corporate-rentals', 'corporate-rentals'],
  ['create-enquiry', 'create-enquiry'],
];

console.log('\nEndpoint consistency checks\n');

for (const [label, endpoint] of endpointCases) {
  test(`${label} blocks XSS consistently`, () => {
    resetState();
    const result = evaluateContactSubmission({
      fields: validPayload({ message: "<script>alert('x')</script>" }),
      email: 'customer@example.com',
      phone: '9876512340',
      endpoint,
    });
    assert.strictEqual(result.blocked, true);
    assert.strictEqual(result.reason, 'xss_or_html');
  });
}

console.log('\nMobility endpoint payload normalization\n');

test('business-commute defaults product to Business Travel', () => {
  const body = normalizeSubmissionBody(validPayload({ product: '' }), {
    defaultProduct: 'Business Travel',
  });
  assert.strictEqual(body.product, 'Business Travel');
});

test('ets defaults product to Employee Transfers', () => {
  const body = normalizeSubmissionBody(validPayload({ product: '' }), {
    defaultProduct: 'Employee Transfers',
  });
  assert.strictEqual(body.product, 'Employee Transfers');
});

test('corporate-rentals defaults product to Spot Rental', () => {
  const body = normalizeSubmissionBody(validPayload({ product: '' }), {
    defaultProduct: 'Spot Rental',
  });
  assert.strictEqual(body.product, 'Spot Rental');
});

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);

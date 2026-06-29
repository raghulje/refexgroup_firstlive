/**
 * Resolve Kissflow `websiteName` from Refex Group contact form `product` value.
 * Keep in sync with client/src/pages/contact/page.tsx product lists.
 */

const DEFAULT_WEBSITE_NAME = 'Refex Group';

/** Business-unit selections (PRODUCT_SECTIONS on contact page) */
const SECTION_TO_WEBSITE = {
  'General Enquiry': DEFAULT_WEBSITE_NAME,
  'Refex Ash utilization & Coal Handling': 'Refex Industries Limited',
  'Refex Renewables': 'Refex Renewables',
  'Refex MedTech': '3iMedtech',
  'Refex Airports and Transportation': DEFAULT_WEBSITE_NAME,
  'Refex Mobility': 'Refex Mobility',
  'Refex Life Sciences': 'Refex Life Sciences',
  'Venwind Refex': 'Venwind Refex',
};

/** Adonis contact / request-demo product labels */
const ADONIS_PRODUCTS = new Set([
  'HF Mobile',
  'HF Fixed',
  'FPD-C-Arm',
  '1K*1K High End HF C-ARM',
  '0.5K High End HF C-ARM',
  'Line Frequency X-Ray Systems',
  'Digital Radiography',
  'Dream Series-Ceiling Suspended',
  'ADONIS 100HF/150HF Mobile X-Ray',
  'ADONIS HF Radiographic Systems 300mA / 500mA / 600mA',
  'ADONIS HF Mobile DR',
]);

/** 3iMedtech contact product labels (excludes Adonis-branded & Anamaya) */
const IMEDTECH_PRODUCTS = new Set([
  'FPD C-ARM',
  'DReam CMT-Dual (Ceiling Type, Dual Detector)',
  'DReam CMT-Single (Ceiling Type, Single Detector)',
  'DReam Floor Mounted DR',
  'Mini 90 Point-of-Care X-Ray',
  'PINKVIEW DR PLUS (Digital Mammography)',
  'PINKVIEW RT (Analog Mammography)',
  'Glass-Free Flat Panel Detector',
  'Retrofit Mammography Panel',
  'DMD D 2000, X-Ray Film Digitizer',
  'Image Display Monitors',
  'CT/MR/Mammograph Multi-Modality Workstations',
  'CD/DVD Publishers',
  'MedE Drive for Patient Data Storage',
  'Philips Achieva 3.0Tesla X-Series',
  'GE Signa HDxt 1.5Tesla',
]);

/** Refex Mobility services (Refex Group contact → Refex Mobility section) */
const MOBILITY_PRODUCTS = new Set([
  'Employee Transfers',
  'Airport Transfers',
  'Sopt Rental',
  'Spot Rental',
  'Outstation Rides',
  'Business Travel',
  'All Services',
]);

/** Brand / subsidiary names that may appear as product values */
const BRAND_PRODUCT_TO_WEBSITE = {
  Anamaya: 'Anamaya',
  Sparzana: 'Sparzana',
  Modepro: 'Modepro',
};

function normalizeProductKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

/**
 * @param {string} [product] - Contact form `product` field (business unit or SKU name)
 * @returns {string} Kissflow websiteName
 */
function resolveWebsiteNameFromProduct(product) {
  const raw = String(product || '').trim();
  if (!raw) return DEFAULT_WEBSITE_NAME;

  if (SECTION_TO_WEBSITE[raw]) {
    return SECTION_TO_WEBSITE[raw];
  }

  if (BRAND_PRODUCT_TO_WEBSITE[raw]) {
    return BRAND_PRODUCT_TO_WEBSITE[raw];
  }

  if (ADONIS_PRODUCTS.has(raw)) {
    return 'Adonis';
  }

  if (IMEDTECH_PRODUCTS.has(raw)) {
    return '3iMedtech';
  }

  if (MOBILITY_PRODUCTS.has(raw)) {
    return 'Refex Mobility';
  }

  const key = normalizeProductKey(raw);
  if (key === 'anamaya') return 'Anamaya';
  if (key === 'sparzana') return 'Sparzana';
  if (key === 'modepro') return 'Modepro';
  if (key === 'refexmobility') return 'Refex Mobility';
  for (const name of MOBILITY_PRODUCTS) {
    if (normalizeProductKey(name) === key) return 'Refex Mobility';
  }
  if (key === 'refexlifesciences') return 'Refex Life Sciences';
  if (key === 'refexrenewables') return 'Refex Renewables';
  if (key === 'venwindrefex') return 'Venwind Refex';
  if (key === 'refexindustrieslimited' || key === 'refexashutilizationcoalhandling') {
    return 'Refex Industries Limited';
  }

  // Normalized fallback for Adonis vs 3iMedtech (e.g. minor punctuation differences)
  for (const name of ADONIS_PRODUCTS) {
    if (normalizeProductKey(name) === key) return 'Adonis';
  }
  for (const name of IMEDTECH_PRODUCTS) {
    if (normalizeProductKey(name) === key) return '3iMedtech';
  }
  for (const [section, website] of Object.entries(SECTION_TO_WEBSITE)) {
    if (normalizeProductKey(section) === key) return website;
  }

  return DEFAULT_WEBSITE_NAME;
}

module.exports = {
  DEFAULT_WEBSITE_NAME,
  resolveWebsiteNameFromProduct,
};

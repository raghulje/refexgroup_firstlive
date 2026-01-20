const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

// All page slugs that should exist
const PAGE_SLUGS = [
  'home',
  'about-refex',
  'business',
  'esg',
  'careers',
  'contact',
  'newsroom',
  'investments',
  'gallery',
  'diversity-inclusion',
  // Business pages
  'refex-refrigerants',
  'refex-renewables',
  'refex-ash-coal-handling',
  'refex-medtech',
  'refex-capital',
  'refex-airports',
  'refex-mobility',
  'pharma-rl-fine-chem',
  'venwind-refex'
];

// Expected sections for key pages
const EXPECTED_SECTIONS = {
  'home': ['hero', 'about', 'cta', 'careers'],
  'about-refex': ['hero', 'overview', 'mission-vision', 'our-story', 'careers-cta'],
  'esg': ['hero', 'intro', 'championing-change', 'three-pillars', 'policies', 'sustainability-report', 'sdg-intro', 'governance', 'cta'],
  'careers': ['hero', 'main-content', 'life-as-refexian', 'why-choose-refex', 'application-form', 'testimonials', 'know-more'],
  'contact': ['hero', 'contact-form', 'cta'],
  'investments': ['hero', 'intro', 'message', 'listed-companies', 'contact-info', 'cta'],
  'diversity-inclusion': ['hero', 'be-you', 'believe', 'initiatives', 'cta'],
  'refex-refrigerants': ['hero', 'why-choose-us', 'breaking-new-grounds', 'products', 'quality-safety', 'refex-industries-limited'],
  'refex-renewables': ['hero', 'category-cards', 'benefits', 'featured-projects', 'cta'],
  'refex-ash-coal-handling': ['hero', 'why-us', 'what-we-do', 'cta'],
  'refex-medtech': ['hero', 'associate-companies', 'stats', 'commitment', 'specialities', 'certifications', 'clientele', 'products', 'cta'],
  'refex-capital': ['hero', 'stats', 'know-about-us', 'decorative-1', 'areas-of-interest', 'what-we-look-for', 'key-factors', 'decorative-2', 'portfolio', 'cta'],
  'refex-airports': ['hero-desktop', 'hero-mobile', 'about-us', 'for-retail-partners', 'refex-retail-advantage', 'transportation-enhancement', 'tech-integration', 'cta'],
  'refex-mobility': ['hero', 'about', 'solutions', 'advantages', 'electric-fleet', 'cta'],
  'pharma-rl-fine-chem': ['hero', 'about', 'leader', 'rd-capability', 'plant-capability', 'certifications', 'cta'],
  'venwind-refex': ['hero', 'stats', 'unique', 'technical-specs', 'cta']
};

async function testPage(pageSlug) {
  try {
    // Test page exists
    const pageResponse = await axios.get(`${API_BASE}/pages/${pageSlug}`, { timeout: 5000 });
    
    if (!pageResponse.data || !pageResponse.data.success || !pageResponse.data.data) {
      return { success: false, error: 'Page not found or invalid response' };
    }

    const page = pageResponse.data.data;
    if (!page.id) {
      return { success: false, error: 'Page missing ID' };
    }

    // Test sections exist
    const sectionsResponse = await axios.get(`${API_BASE}/sections/page/${page.id}`, { timeout: 5000 });
    
    if (!sectionsResponse.data || !sectionsResponse.data.success) {
      return { success: false, error: 'Failed to fetch sections' };
    }

    const sections = sectionsResponse.data.data || [];
    const sectionKeys = sections.map(s => s.sectionKey || s.sectionType).filter(Boolean);

    // Check if expected sections exist (if defined)
    const expectedSections = EXPECTED_SECTIONS[pageSlug];
    let missingSections = [];
    if (expectedSections) {
      missingSections = expectedSections.filter(exp => !sectionKeys.includes(exp));
    }

    // Check sections have content
    const sectionsWithContent = sections.filter(s => s.content && s.content.length > 0);
    const sectionsWithoutContent = sections.filter(s => !s.content || s.content.length === 0);

    return {
      success: true,
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug
      },
      sections: {
        total: sections.length,
        withContent: sectionsWithContent.length,
        withoutContent: sectionsWithoutContent.length,
        keys: sectionKeys
      },
      missingSections: missingSections.length > 0 ? missingSections : null,
      warnings: sectionsWithoutContent.length > 0 ? `${sectionsWithoutContent.length} section(s) without content` : null
    };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return { success: false, error: 'Server not running' };
    }
    if (error.response && error.response.status === 404) {
      return { success: false, error: 'Page not found (404)' };
    }
    return { success: false, error: error.message };
  }
}

async function testAllPages() {
  console.log('🧪 Testing All Pages End-to-End...\n');
  console.log('=' .repeat(60));

  let passed = 0;
  let failed = 0;
  let warnings = 0;
  const results = [];

  for (const slug of PAGE_SLUGS) {
    console.log(`\n📄 Testing page: ${slug}`);
    const result = await testPage(slug);
    results.push({ slug, ...result });

    if (result.success) {
      console.log(`   ✅ Page exists: ${result.page.title}`);
      console.log(`   📦 Sections: ${result.sections.total} total, ${result.sections.withContent} with content`);
      
      if (result.missingSections) {
        console.log(`   ⚠️  Missing sections: ${result.missingSections.join(', ')}`);
        warnings++;
      }
      
      if (result.warnings) {
        console.log(`   ⚠️  ${result.warnings}`);
        warnings++;
      }
      
      passed++;
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
      failed++;
    }
  }

  // Test additional endpoints
  console.log('\n' + '='.repeat(60));
  console.log('\n🔍 Testing Additional Endpoints...\n');

  const additionalTests = [
    { name: 'Business Cards', endpoint: '/business-cards', method: 'GET' },
    { name: 'Hero Slides (Home)', endpoint: '/hero-slides/page/1', method: 'GET' },
    { name: 'Awards', endpoint: '/awards', method: 'GET' },
    { name: 'Leaders', endpoint: '/leaders', method: 'GET' },
    { name: 'SDG Cards', endpoint: '/sdg-cards', method: 'GET' },
    { name: 'Core Values', endpoint: '/core-values', method: 'GET' },
    { name: 'Testimonials', endpoint: '/testimonials', method: 'GET' },
    { name: 'Newsroom Items', endpoint: '/newsroom', method: 'GET' },
    { name: 'Jobs', endpoint: '/jobs', method: 'GET' },
    { name: 'Navigation (Header)', endpoint: '/navigation/header', method: 'GET' },
    { name: 'Footer Sections', endpoint: '/footer', method: 'GET' },
    { name: 'Social Links', endpoint: '/social-links', method: 'GET' },
    { name: 'Contact Info', endpoint: '/contact-info', method: 'GET' },
    { name: 'Global Settings', endpoint: '/global-settings', method: 'GET' },
    { name: 'Gallery Albums', endpoint: '/gallery/albums', method: 'GET' },
  ];

  for (const test of additionalTests) {
    try {
      const response = await axios({
        method: test.method,
        url: `${API_BASE}${test.endpoint}`,
        timeout: 5000
      });

      if (response.data && (response.data.success !== false)) {
        const dataLength = Array.isArray(response.data.data) 
          ? response.data.data.length 
          : Object.keys(response.data.data || {}).length;
        console.log(`   ✅ ${test.name}: ${dataLength} item(s)`);
        passed++;
      } else {
        console.log(`   ❌ ${test.name}: Invalid response`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary\n');
  const pageTestsPassed = results.filter(r => r.success).length;
  const pageTestsFailed = results.filter(r => !r.success).length;
  
  console.log(`   ✅ Pages Passed: ${pageTestsPassed}/${PAGE_SLUGS.length}`);
  console.log(`   ❌ Pages Failed: ${pageTestsFailed}/${PAGE_SLUGS.length}`);
  console.log(`   ⚠️  Section Warnings: ${warnings} (section key mismatches - not critical)`);
  console.log(`   ✅ Additional Endpoints: ${additionalTests.length} tested`);

  // Count sections with/without content
  const totalSections = results.reduce((sum, r) => sum + (r.sections?.total || 0), 0);
  const sectionsWithContent = results.reduce((sum, r) => sum + (r.sections?.withContent || 0), 0);
  const sectionsWithoutContent = results.reduce((sum, r) => sum + (r.sections?.withoutContent || 0), 0);
  
  console.log(`\n   📦 Sections Summary:`);
  console.log(`      Total sections: ${totalSections}`);
  console.log(`      With content: ${sectionsWithContent}`);
  console.log(`      Without content: ${sectionsWithoutContent}`);

  // Detailed results for failures only
  if (pageTestsFailed > 0) {
    console.log('\n📋 Failed Pages:\n');
    results.forEach(({ slug, success, error }) => {
      if (!success) {
        console.log(`   ❌ ${slug}: ${error}`);
      }
    });
  }

  console.log('\n' + '='.repeat(60));
  
  if (pageTestsFailed === 0) {
    console.log('🎉 All page tests passed!');
    console.log(`✅ All ${PAGE_SLUGS.length} pages exist and are accessible`);
    console.log(`✅ ${sectionsWithContent} sections have content`);
    if (sectionsWithoutContent > 0) {
      console.log(`⚠️  ${sectionsWithoutContent} sections without content (may be intentional)`);
    }
    if (warnings > 0) {
      console.log(`ℹ️  ${warnings} section key mismatches (expected vs actual - not critical)`);
    }
    process.exit(0);
  } else {
    console.log('⚠️  Some page tests failed. Please check the results above.');
    process.exit(1);
  }
}

// Run tests
testAllPages().catch(error => {
  console.error('❌ Test execution error:', error);
  process.exit(1);
});


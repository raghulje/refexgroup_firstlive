const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  const tests = [
    { name: 'Health Check', endpoint: '/health', method: 'GET' },
    { name: 'Get All Pages', endpoint: '/pages', method: 'GET' },
    { name: 'Get Home Page', endpoint: '/pages/home', method: 'GET' },
    { name: 'Get Business Cards', endpoint: '/business-cards', method: 'GET' },
    { name: 'Get Hero Slides', endpoint: '/hero-slides/page/1', method: 'GET' },
    { name: 'Get Awards', endpoint: '/awards', method: 'GET' },
    { name: 'Get Leaders', endpoint: '/leaders', method: 'GET' },
    { name: 'Get SDG Cards', endpoint: '/sdg-cards', method: 'GET' },
    { name: 'Get Core Values', endpoint: '/core-values', method: 'GET' },
    { name: 'Get Testimonials', endpoint: '/testimonials', method: 'GET' },
    { name: 'Get Newsroom', endpoint: '/newsroom', method: 'GET' },
    { name: 'Get Jobs', endpoint: '/jobs', method: 'GET' },
    { name: 'Get Navigation', endpoint: '/navigation/header', method: 'GET' },
    { name: 'Get Footer', endpoint: '/footer', method: 'GET' },
    { name: 'Get Social Links', endpoint: '/social-links', method: 'GET' },
    { name: 'Get Contact Info', endpoint: '/contact-info', method: 'GET' },
    { name: 'Get Global Settings', endpoint: '/global-settings', method: 'GET' },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: `${API_BASE}${test.endpoint}`,
        timeout: 5000
      });

      if (response.data && (response.data.success !== false)) {
        console.log(`✅ ${test.name}: OK`);
        if (response.data.data) {
          const dataLength = Array.isArray(response.data.data) 
            ? response.data.data.length 
            : Object.keys(response.data.data || {}).length;
          console.log(`   └─ Data: ${dataLength} item(s)`);
        }
        passed++;
      } else {
        console.log(`❌ ${test.name}: Failed - Invalid response`);
        failed++;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${test.name}: Failed - Server not running (Connection refused)`);
      } else {
        console.log(`❌ ${test.name}: Failed - ${error.message}`);
        if (error.response) {
          console.log(`   └─ Status: ${error.response.status}`);
        }
      }
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the server.');
    process.exit(1);
  }
}

// Run tests
testAPI().catch(console.error);


/* eslint-disable no-console */
const axios = require('axios');

const API_BASE = process.env.API_URL || 'http://localhost:3001/api/v1';

async function testHeroSlidesAPI() {
  try {
    console.log('🧪 Testing Hero Slides API...\n');
    console.log(`API Base: ${API_BASE}\n`);

    // Get home page
    console.log('1. Getting home page...');
    const homePageResponse = await axios.get(`${API_BASE}/pages/slug/home`);
    console.log('Response structure:', JSON.stringify(homePageResponse.data, null, 2).substring(0, 500));
    const homePage = homePageResponse.data.data || homePageResponse.data;
    console.log(`   ✅ Home page found: ID ${homePage.id}\n`);

    // Get hero slides
    console.log('2. Getting hero slides...');
    const slidesResponse = await axios.get(`${API_BASE}/hero-slides/page/${homePage.id}`);
    const slides = slidesResponse.data.data;
    console.log(`   ✅ Found ${slides.length} slide(s)\n`);

    // Check each slide
    slides.forEach((slide, index) => {
      console.log(`\n--- Slide ${index + 1} (ID: ${slide.id}) ---`);
      console.log(`Title: ${slide.title}`);
      console.log(`Is Active: ${slide.isActive}`);
      console.log(`Background Image ID: ${slide.backgroundImageId || '(not set)'}`);
      
      if (slide.backgroundImage) {
        console.log(`✅ Background Image:`);
        console.log(`   - Media ID: ${slide.backgroundImage.id}`);
        console.log(`   - File Path: ${slide.backgroundImage.filePath}`);
        console.log(`   - Full URL: ${API_BASE.replace('/api/v1', '')}${slide.backgroundImage.filePath}`);
      } else {
        console.log(`❌ No background image`);
      }
    });

    console.log('\n✨ Test completed\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testHeroSlidesAPI();


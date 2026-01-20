const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

async function checkSections(pageSlug) {
  try {
    const pageRes = await axios.get(`${API_BASE}/pages/${pageSlug}`);
    const pageId = pageRes.data.data.id;
    const sectionsRes = await axios.get(`${API_BASE}/sections/page/${pageId}`);
    const sections = sectionsRes.data.data || [];
    const sectionKeys = sections.map(s => s.sectionKey || s.sectionType).filter(Boolean);
    console.log(`${pageSlug}: ${sectionKeys.join(', ')}`);
  } catch (error) {
    console.error(`${pageSlug}: Error - ${error.message}`);
  }
}

async function main() {
  const pages = ['home', 'refex-renewables', 'contact', 'diversity-inclusion'];
  for (const page of pages) {
    await checkSections(page);
  }
}

main();


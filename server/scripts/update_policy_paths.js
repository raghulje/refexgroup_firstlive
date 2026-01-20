/**
 * Migration script to update ESG policy document paths
 * Updates paths from /uploads/documents/general/general/... to /uploads/documents/...
 * 
 * Run this after manually moving PDFs to /uploads/documents/
 */

require("dotenv").config();
const db = require("../models");
const { Section, SectionContent, Page } = db;
const path = require('path');
const fs = require('fs');

async function updatePolicyPaths() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");

    // Find ESG page
    const esgPage = await Page.findOne({ where: { slug: 'esg' } });
    if (!esgPage) {
      console.error('ESG page not found');
      process.exit(1);
    }

    // Find policies section
    const policiesSection = await Section.findOne({
      where: { pageId: esgPage.id, sectionKey: 'policies' }
    });

    if (!policiesSection) {
      console.error('Policies section not found');
      process.exit(1);
    }

    // Get all policy-related content items
    const policyContentKeys = [
      'qualityPolicyUrl',
      'ehsPolicyUrl',
      'sustainabilityPolicyUrl',
      'grievancePolicyUrl',
      'abacPolicyUrl',
      'vendorCodeUrl'
    ];

    // Get individual policy URL content items
    const policyUrlContents = await SectionContent.findAll({
      where: {
        sectionId: policiesSection.id,
        contentKey: policyContentKeys
      }
    });

    // Also check for JSON policies array
    const policiesContent = await SectionContent.findOne({
      where: { sectionId: policiesSection.id, contentKey: 'policies' }
    });

    if (policyUrlContents.length === 0 && !policiesContent) {
      console.log('No policy content found. Nothing to update.');
      process.exit(0);
    }

    console.log(`\nFound ${policyUrlContents.length} individual policy URLs and ${policiesContent ? '1' : '0'} policies JSON to check...\n`);

    // Get list of files in /uploads/documents/
    const documentsDir = path.join(__dirname, '../uploads/documents');
    let availableFiles = [];
    if (fs.existsSync(documentsDir)) {
      availableFiles = fs.readdirSync(documentsDir).filter(file => 
        file.toLowerCase().endsWith('.pdf') || 
        file.toLowerCase().endsWith('.doc') || 
        file.toLowerCase().endsWith('.docx')
      );
      console.log(`Found ${availableFiles.length} document files in /uploads/documents/\n`);
    }

    let updatedCount = 0;
    let notFoundCount = 0;

    // Helper function to update a single path
    const updatePath = (oldLink, contentKey) => {
      // Skip if already correct path or external URL
      if (!oldLink || 
          oldLink.startsWith('http://') || 
          oldLink.startsWith('https://') ||
          (oldLink.startsWith('/uploads/documents/') && !oldLink.includes('/general/general/'))) {
        console.log(`"${contentKey}" - Already correct or external URL: ${oldLink}`);
        return { updated: false, newLink: oldLink };
      }

      // Extract filename from old path
      let filename = '';
      if (oldLink.includes('/general/general/')) {
        // Extract filename from old path: /uploads/documents/general/general/filename.pdf
        filename = oldLink.split('/general/general/')[1];
      } else if (oldLink.includes('/')) {
        // Just get the filename
        filename = path.basename(oldLink);
      } else {
        filename = oldLink;
      }

      // Try to find matching file (case-insensitive)
      const matchingFile = availableFiles.find(file => 
        file.toLowerCase() === filename.toLowerCase() ||
        file.toLowerCase().replace(/\s+/g, '_').toLowerCase() === filename.toLowerCase().replace(/\s+/g, '_')
      );

      if (matchingFile) {
        const newLink = `/uploads/documents/${matchingFile}`;
        console.log(`"${contentKey}"`);
        console.log(`    Old: ${oldLink}`);
        console.log(`    New: ${newLink}`);
        updatedCount++;
        return { updated: true, newLink };
      } else {
        console.log(`"${contentKey}" - File not found: ${filename}`);
        console.log(`    Current path: ${oldLink}`);
        notFoundCount++;
        return { updated: false, newLink: oldLink };
      }
    };

    // Update individual policy URL content items
    for (const contentItem of policyUrlContents) {
      const oldLink = contentItem.contentValue || '';
      const result = updatePath(oldLink, contentItem.contentKey);
      if (result.updated) {
        await contentItem.update({
          contentValue: result.newLink
        });
      }
    }

    // Update JSON policies array if it exists
    if (policiesContent) {
      try {
        const parsed = JSON.parse(policiesContent.contentValue || '{}');
        let policies = parsed.policies || parsed || [];
        
        if (Array.isArray(policies)) {
          const updatedPolicies = policies.map((policy, index) => {
            const oldLink = policy.link || policy.url || '';
            const result = updatePath(oldLink, `Policy ${index + 1} (${policy.title || 'Untitled'})`);
            
            if (result.updated) {
              return {
                ...policy,
                link: result.newLink,
                url: result.newLink
              };
            }
            return policy;
          });

          const updatedContent = {
            ...(typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}),
            policies: updatedPolicies
          };

          await policiesContent.update({
            contentValue: JSON.stringify(updatedContent)
          });
        }
      } catch (e) {
        console.error('Error updating JSON policies:', e);
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`   - Updated: ${updatedCount} paths`);
    console.log(`   - Not found: ${notFoundCount} paths`);
    console.log(`\n📝 Note: Paths with files not found in /uploads/documents/ were left unchanged.`);
    console.log(`   Make sure all PDF files are in server/uploads/documents/ folder.`);

    process.exit(0);
  } catch (error) {
    console.error('Error updating policy paths:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

updatePolicyPaths();


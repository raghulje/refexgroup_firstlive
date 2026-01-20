/**
 * Migration script to update Sustainability Report and ESG Dashboard paths
 * Updates from external URLs to local /uploads/documents/ paths
 */

require("dotenv").config();
const db = require("../models");
const { Section, SectionContent, Page } = db;
const path = require('path');
const fs = require('fs');

async function updateSustainabilityPaths() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");

    // Find ESG page
    const esgPage = await Page.findOne({ where: { slug: 'esg' } });
    if (!esgPage) {
      console.error('ESG page not found');
      process.exit(1);
    }

    // Find sustainability-report section
    const sustainabilitySection = await Section.findOne({
      where: { pageId: esgPage.id, sectionKey: 'sustainability-report' }
    });

    if (!sustainabilitySection) {
      console.error('Sustainability report section not found');
      process.exit(1);
    }

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
      console.log('Available files:', availableFiles.join(', '), '\n');
    }

    let updatedCount = 0;

    // Update sustainabilityReportUrl
    const sustainabilityReportContent = await SectionContent.findOne({
      where: { sectionId: sustainabilitySection.id, contentKey: 'sustainabilityReportUrl' }
    });

    if (sustainabilityReportContent) {
      const currentValue = sustainabilityReportContent.contentValue || '';
      console.log(`Current sustainabilityReportUrl: ${currentValue}`);

      // Find matching file (case-insensitive, try to match "Sustainability" and "Report")
      const matchingFile = availableFiles.find(file => {
        const fileLower = file.toLowerCase();
        return (fileLower.includes('sustainability') && fileLower.includes('report')) ||
               fileLower.includes('sustainability-report');
      });

      if (matchingFile) {
        const newPath = `/uploads/documents/${matchingFile}`;
        await sustainabilityReportContent.update({
          contentValue: newPath,
          mediaId: null // Clear mediaId if exists
        });
        console.log(`✅ Updated sustainabilityReportUrl to: ${newPath}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Could not find matching sustainability report file. Available files: ${availableFiles.join(', ')}`);
      }
    } else {
      console.log('sustainabilityReportUrl content not found');
    }

    // Update dashboardUrl
    const dashboardContent = await SectionContent.findOne({
      where: { sectionId: sustainabilitySection.id, contentKey: 'dashboardUrl' }
    });

    if (dashboardContent) {
      const currentValue = dashboardContent.contentValue || '';
      console.log(`\nCurrent dashboardUrl: ${currentValue}`);

      // Find matching file (case-insensitive, try to match "dashboard" or "esg")
      const matchingFile = availableFiles.find(file => {
        const fileLower = file.toLowerCase();
        return fileLower.includes('dashboard') || 
               (fileLower.includes('esg') && fileLower.includes('dashboard'));
      });

      if (matchingFile) {
        const newPath = `/uploads/documents/${matchingFile}`;
        await dashboardContent.update({
          contentValue: newPath,
          mediaId: null // Clear mediaId if exists
        });
        console.log(`✅ Updated dashboardUrl to: ${newPath}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Could not find matching dashboard file. Available files: ${availableFiles.join(', ')}`);
      }
    } else {
      console.log('dashboardUrl content not found');
    }

    // Also check for reports JSON array
    const reportsContent = await SectionContent.findOne({
      where: { sectionId: sustainabilitySection.id, contentKey: 'reports' }
    });

    if (reportsContent && reportsContent.contentType === 'json') {
      try {
        const reports = JSON.parse(reportsContent.contentValue || '[]');
        if (Array.isArray(reports) && reports.length > 0) {
          console.log(`\nFound ${reports.length} reports in JSON array...`);
          
          const updatedReports = reports.map((report, index) => {
            const oldLink = report.link || '';
            console.log(`\nReport ${index + 1}: "${report.title || 'Untitled'}"`);
            console.log(`  Current link: ${oldLink}`);

            // Skip if already local path
            if (oldLink.startsWith('/uploads/documents/')) {
              console.log(`  ✅ Already using local path`);
              return report;
            }

            // Skip external URLs for now (unless user wants to change them)
            if (oldLink.startsWith('http://') || oldLink.startsWith('https://')) {
              // Try to find matching file
              let matchingFile = null;
              
              if (oldLink.includes('Sustainability-Report') || (report.title && report.title.toLowerCase().includes('sustainability'))) {
                matchingFile = availableFiles.find(file => {
                  const fileLower = file.toLowerCase();
                  return (fileLower.includes('sustainability') && fileLower.includes('report'));
                });
              } else if (oldLink.includes('Dashboard') || (report.title && report.title.toLowerCase().includes('dashboard'))) {
                matchingFile = availableFiles.find(file => {
                  const fileLower = file.toLowerCase();
                  return fileLower.includes('dashboard');
                });
              }

              if (matchingFile) {
                const newPath = `/uploads/documents/${matchingFile}`;
                console.log(`  ✅ Updating to: ${newPath}`);
                updatedCount++;
                return {
                  ...report,
                  link: newPath
                };
              } else {
                console.log(`  ⚠️  No matching file found, keeping external URL`);
                return report;
              }
            }

            return report;
          });

          await reportsContent.update({
            contentValue: JSON.stringify(updatedReports)
          });
          console.log(`\n✅ Updated reports JSON array`);
        }
      } catch (e) {
        console.error('Error updating reports JSON:', e);
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`   - Updated: ${updatedCount} paths`);

    process.exit(0);
  } catch (error) {
    console.error('Error updating sustainability paths:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

updateSustainabilityPaths();


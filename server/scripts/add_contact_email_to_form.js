require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent } = require("../models");

async function addContactEmailToForm() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");

    // Find the contact page
    const contactPage = await Page.findOne({ where: { slug: 'contact' } });
    if (!contactPage) {
      console.error('Contact page not found');
      return;
    }

    // Find the contact-form section
    const formSection = await Section.findOne({
      where: {
        pageId: contactPage.id,
        sectionKey: 'contact-form'
      }
    });

    if (!formSection) {
      console.error('Contact form section not found');
      return;
    }

    // Check if contactEmail already exists
    const existingEmail = await SectionContent.findOne({
      where: {
        sectionId: formSection.id,
        contentKey: 'contactEmail'
      }
    });

    if (existingEmail) {
      console.log('Contact email already exists:', existingEmail.contentValue);
      // Update it to ensure it has a value
      if (!existingEmail.contentValue || existingEmail.contentValue.trim() === '') {
        await existingEmail.update({
          contentValue: 'info@refex.co.in'
        });
        console.log('✅ Updated contact email to: info@refex.co.in');
      } else {
        console.log('✅ Contact email is already set:', existingEmail.contentValue);
      }
    } else {
      // Create the contactEmail content item
      await SectionContent.create({
        sectionId: formSection.id,
        contentKey: 'contactEmail',
        contentValue: 'info@refex.co.in',
        contentType: 'text'
      });
      console.log('✅ Created contact email: info@refex.co.in');
    }

    console.log('✅ Contact email field added successfully!');
  } catch (error) {
    console.error('❌ Error adding contact email:', error);
    throw error;
  } finally {
    await db.sequelize.close();
  }
}

if (require.main === module) {
  addContactEmailToForm();
}

module.exports = addContactEmailToForm;


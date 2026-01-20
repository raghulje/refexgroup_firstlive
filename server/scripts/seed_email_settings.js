require("dotenv").config();
const db = require("../models");
const GlobalSetting = db.GlobalSettings;

async function seedEmailSettings() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");

    const emailSettings = [
      {
        key: 'contact_form_email',
        value: process.env.CONTACT_FORM_EMAIL || 'info@refex.co.in',
        valueType: 'string',
        description: 'Email address where contact form submissions will be sent'
      },
      {
        key: 'smtp_host',
        value: process.env.SMTP_HOST || 'smtp.gmail.com',
        valueType: 'string',
        description: 'SMTP server hostname'
      },
      {
        key: 'smtp_port',
        value: process.env.SMTP_PORT || '587',
        valueType: 'number',
        description: 'SMTP server port (587 for TLS, 465 for SSL)'
      },
      {
        key: 'smtp_secure',
        value: process.env.SMTP_SECURE || 'false',
        valueType: 'boolean',
        description: 'Use secure connection (SSL/TLS)'
      },
      {
        key: 'smtp_user',
        value: process.env.SMTP_USER || '',
        valueType: 'string',
        description: 'SMTP username/email'
      },
      {
        key: 'smtp_password',
        value: process.env.SMTP_PASSWORD || '',
        valueType: 'string',
        description: 'SMTP password (app password for Gmail)'
      },
      {
        key: 'smtp_from_email',
        value: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
        valueType: 'string',
        description: 'Email address to send from'
      },
      {
        key: 'smtp_from_name',
        value: process.env.SMTP_FROM_NAME || 'Refex Group Contact Form',
        valueType: 'string',
        description: 'Display name for sent emails'
      }
    ];

    for (const setting of emailSettings) {
      const [globalSetting, created] = await GlobalSetting.findOrCreate({
        where: { key: setting.key },
        defaults: setting
      });

      if (!created) {
        // Update existing setting
        await globalSetting.update({
          value: setting.value,
          valueType: setting.valueType,
          description: setting.description
        });
        console.log(`Updated setting: ${setting.key}`);
      } else {
        console.log(`Created setting: ${setting.key}`);
      }
    }

    console.log("\n✅ Email settings seeded successfully!");
    console.log("\n📝 Note: Update the following settings in Global Settings CMS:");
    console.log("   - contact_form_email: Email to receive contact form submissions");
    console.log("   - smtp_user: Your SMTP email/username");
    console.log("   - smtp_password: Your SMTP password (use app password for Gmail)");
    console.log("   - smtp_from_email: Email address to send from");
    console.log("\n🔒 For production, update these values in the CMS or set environment variables.");

  } catch (error) {
    console.error("Error seeding email settings:", error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

seedEmailSettings();


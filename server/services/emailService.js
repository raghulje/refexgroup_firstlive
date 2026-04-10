const nodemailer = require('nodemailer');
const db = require('../models');
const GlobalSetting = db.GlobalSettings;
const { Page, Section, SectionContent } = require('../models');

/**
 * Get contact email from contact-form section, fallback to global settings
 */
async function getContactEmail() {
  try {
    // First, try to get from contact-form section
    const contactPage = await Page.findOne({ where: { slug: 'contact' } });
    if (contactPage) {
      const contactFormSection = await Section.findOne({
        where: {
          pageId: contactPage.id,
          sectionKey: 'contact-form'
        },
        include: [{
          model: SectionContent,
          as: 'content',
          required: false
        }]
      });

      if (contactFormSection && contactFormSection.content) {
        const contactEmailContent = contactFormSection.content.find(
          (c) => c.contentKey === 'contactEmail'
        );
        if (contactEmailContent && contactEmailContent.contentValue) {
          return contactEmailContent.contentValue.trim();
        }
      }
    }
  } catch (error) {
    console.error('Error getting contact email from section:', error);
  }

  // Fallback to global settings
  try {
    const settings = await GlobalSetting.findAll();
    const settingsObj = {};
    settings.forEach(setting => {
      let value = setting.value;
      if (setting.valueType === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = setting.value;
        }
      } else if (setting.valueType === 'number') {
        value = Number(value);
      } else if (setting.valueType === 'boolean') {
        value = value === 'true';
      }
      settingsObj[setting.key] = value;
    });

    return settingsObj.contact_form_email || process.env.CONTACT_FORM_EMAIL || settingsObj.smtp_user || process.env.SMTP_USER || '';
  } catch (error) {
    console.error('Error getting contact email from global settings:', error);
    return process.env.CONTACT_FORM_EMAIL || process.env.SMTP_USER || '';
  }
}

/**
 * Get email configuration from EmailSettings table (CMS configured)
 */
async function getEmailConfig() {
  try {
    // First, try to get from EmailSettings table (CMS configured)
    const { EmailSettings } = require('../models');
    const emailSettings = await EmailSettings.findOne({
      where: { isActive: true }
    });

    if (emailSettings && emailSettings.smtpUser && emailSettings.smtpPassword) {
      // Prefer Email Settings (CMS) for recipient; fallback to section/global only if CMS fields are empty
      const contactEmailFromSection = await getContactEmail();

      return {
        host: emailSettings.smtpHost || 'smtp.zoho.in',
        port: emailSettings.smtpPort || 465,
        secure: emailSettings.smtpSecure === true,
        auth: {
          user: emailSettings.smtpUser,
          pass: emailSettings.smtpPassword
        },
        from: emailSettings.fromEmail || emailSettings.smtpUser,
        fromName: emailSettings.fromName || 'Refex Group Contact Form',
        contactEmail: emailSettings.contactEmail || emailSettings.receivingEmail || contactEmailFromSection || emailSettings.smtpUser
      };
    }

    // Fallback to GlobalSettings (legacy)
    const settings = await GlobalSetting.findAll();
    const settingsObj = {};
    settings.forEach(setting => {
      let value = setting.value;
      if (setting.valueType === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = setting.value;
        }
      } else if (setting.valueType === 'number') {
        value = Number(value);
      } else if (setting.valueType === 'boolean') {
        value = value === 'true';
      }
      settingsObj[setting.key] = value;
    });

    // Get contact email (from section or global settings)
    const contactEmail = await getContactEmail();

    return {
      host: settingsObj.smtp_host || process.env.SMTP_HOST || 'smtp.zoho.in',
      port: settingsObj.smtp_port || Number(process.env.SMTP_PORT) || 465,
      secure: settingsObj.smtp_secure === true || settingsObj.smtp_secure === 'true' || process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: settingsObj.smtp_user || process.env.SMTP_USER || '',
        pass: settingsObj.smtp_password || process.env.SMTP_PASSWORD || process.env.SMTP_PASS || ''
      },
      from: settingsObj.smtp_from_email || process.env.SMTP_FROM_EMAIL || settingsObj.smtp_user || process.env.SMTP_USER || '',
      fromName: settingsObj.smtp_from_name || process.env.SMTP_FROM_NAME || 'Refex Group Contact Form',
      contactEmail: contactEmail || settingsObj.smtp_user || process.env.SMTP_USER || ''
    };
  } catch (error) {
    console.error('Error getting email config:', error);
    // Fallback to environment variables
    return {
      host: process.env.SMTP_HOST || 'smtp.zoho.in',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || ''
      },
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
      fromName: process.env.SMTP_FROM_NAME || 'Refex Group Contact Form',
      contactEmail: process.env.CONTACT_FORM_EMAIL || process.env.SMTP_USER || ''
    };
  }
}

/**
 * Create email transporter
 */
async function createTransporter(verifyConnection = false) {
  const config = await getEmailConfig();

  const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.in';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER || config.auth.user;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || config.auth.pass;

  // Zoho SMTP configuration with debug enabled
  const transporterConfig = {
    host: smtpHost,
    port: smtpPort,
    secure: true,
    logger: true,
    debug: true,
    auth: smtpUser ? {
      user: smtpUser,
      pass: smtpPass
    } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  };

  const transporter = nodemailer.createTransport(transporterConfig);

  if (verifyConnection) {
    try {
      await transporter.verify();
      console.log('✅ SMTP transporter verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP transporter verification failed:', verifyError.message);
      if (verifyError.code === 'EAUTH' || /auth|invalid login/i.test(verifyError.message || '')) {
        throw new Error('SMTP authentication failed for Zoho. Verify SMTP_USER and SMTP_PASS (app-specific password).');
      }
      if (/ECONNREFUSED|ETIMEDOUT|connection/i.test(verifyError.message || '')) {
        throw new Error('Unable to connect to Zoho SMTP. Verify SMTP host, port, and network access.');
      }
      throw new Error(`SMTP verification failed: ${verifyError.message || 'Unknown SMTP error'}`);
    }
  }

  return transporter;
}

/**
 * Send contact form email
 */
async function sendContactFormEmail(formData) {
  try {
    const config = await getEmailConfig();
    
    // Validate email configuration
    if (!config.contactEmail) {
      throw new Error('Contact form email not configured. Please set the Receiving Email in Email Settings CMS.');
    }

    if (!config.auth.user || !config.auth.pass) {
      throw new Error('SMTP credentials not configured. Please configure SMTP settings in the Email Settings CMS.');
    }

    const transporter = await createTransporter(false);
    
    // Email subject
    const subject = `New Contact Form Submission - ${formData.enquiringFor || 'General Inquiry'}`;

    // Email HTML body
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #7cb342;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
          }
          .field {
            margin-bottom: 15px;
          }
          .label {
            font-weight: bold;
            color: #555;
            display: block;
            margin-bottom: 5px;
          }
          .value {
            color: #333;
            padding: 8px;
            background-color: white;
            border-radius: 3px;
            border: 1px solid #ddd;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span>
            <div class="value">${formData.name || 'Not provided'}</div>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <div class="value">${formData.email || 'Not provided'}</div>
          </div>
          <div class="field">
            <span class="label">Phone:</span>
            <div class="value">${formData.phone || 'Not provided'}</div>
          </div>
          <div class="field">
            <span class="label">Enquiring For:</span>
            <div class="value">${formData.enquiringFor || 'Not specified'}</div>
          </div>
          <div class="field">
            <span class="label">Message:</span>
            <div class="value" style="white-space: pre-wrap;">${formData.message || 'No message provided'}</div>
          </div>
          <div class="footer">
            <p>This email was sent from the Refex Group website contact form.</p>
            <p>Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email text body (fallback)
    const textBody = `
New Contact Form Submission

Name: ${formData.name || 'Not provided'}
Email: ${formData.email || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}
Enquiring For: ${formData.enquiringFor || 'Not specified'}

Message:
${formData.message || 'No message provided'}

---
This email was sent from the Refex Group website contact form.
Submitted on: ${new Date().toLocaleString()}
    `;

    // Send email
    const mailOptions = {
      from: `"${config.fromName || 'Refex Support'}" <${process.env.SMTP_USER || config.from}>`,
      to: config.contactEmail,
      replyTo: formData.email || config.from,
      subject: subject,
      text: textBody,
      html: htmlBody
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    
    // Provide more specific error messages
    let errorMessage = error.message || 'Failed to send email';
    
    if (errorMessage.includes('Invalid login') || errorMessage.includes('authentication') || errorMessage.includes('EAUTH')) {
      errorMessage = 'SMTP authentication failed. Please verify Zoho SMTP username and app-specific password.';
    } else if (errorMessage.includes('Insufficient permissions') || errorMessage.includes('permission')) {
      errorMessage = 'SMTP permission denied. Ensure Zoho SMTP app-specific password is valid and SMTP is enabled.';
    } else if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to SMTP server. Please check your SMTP Host and Port settings in Email Settings CMS.';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      errorMessage = 'Connection timeout. Please check your SMTP settings and network connection.';
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Test email configuration
 */
async function testEmailConfig() {
  try {
    const config = await getEmailConfig();
    const transporter = await createTransporter(true);

    if (!config.auth.user || !config.auth.pass) {
      return { success: false, error: 'SMTP credentials not configured' };
    }

    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendContactFormEmail,
  testEmailConfig,
  getEmailConfig
};


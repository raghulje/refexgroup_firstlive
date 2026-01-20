const { FormSubmission, EmailSettings } = require('../models');
const nodemailer = require('nodemailer');
const path = require('path');

// Helper function to create transporter
async function createTransporter() {
    const settings = await EmailSettings.findOne({
      where: { isActive: true }
    });

    if (!settings || !settings.smtpUser || !settings.smtpPassword) {
    return null;
    }

    const transporterConfig = {
      host: settings.smtpHost,
      port: settings.smtpPort,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    };

  // Configure SSL/TLS based on port
    if (settings.smtpPort === 465) {
      transporterConfig.secure = true;
    } else if (settings.smtpPort === 587) {
      transporterConfig.secure = false;
      transporterConfig.requireTLS = true;
      transporterConfig.tls = {
        rejectUnauthorized: false
      };
    } else {
      transporterConfig.secure = settings.smtpSecure || false;
      if (!transporterConfig.secure && settings.smtpPort !== 25) {
        transporterConfig.requireTLS = true;
      }
      transporterConfig.tls = {
        rejectUnauthorized: false
      };
    }

  return nodemailer.createTransport(transporterConfig);
}

// Helper function to send confirmation email to user
async function sendConfirmationEmail(formData, resumePath = null) {
  try {
    const settings = await EmailSettings.findOne({
      where: { isActive: true }
    });

    if (!settings || !settings.smtpUser || !settings.smtpPassword) {
      console.warn('Email settings not configured, skipping confirmation email');
      return { success: false, error: 'Email not configured' };
    }

    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'Failed to create transporter' };
    }

    let subject, htmlContent, attachments = [];

    if (formData.formType === 'career_application') {
      subject = 'Thank You for Your Career Application - Refex Group';
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #50b848 0%, #6ba644 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Thank You for Your Application</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 20px;">
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Dear ${formData.firstName} ${formData.lastName},
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Thank you for your interest in joining Refex Group. We have successfully received your career application and appreciate the time you took to apply.
                      </p>
                      
                      <div style="background-color: #f9f9f9; border-left: 4px solid #50b848; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your Application Details:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; color: #666666; width: 140px; font-weight: 600;">Name:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.firstName} ${formData.lastName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600;">Email:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.email}</td>
                          </tr>
                          ${formData.phone ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600;">Phone:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.phone}</td>
                          </tr>
                          ` : ''}
                          ${formData.message ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600; vertical-align: top;">Message:</td>
                            <td style="padding: 8px 0; color: #333333; white-space: pre-wrap;">${formData.message}</td>
                          </tr>
                          ` : ''}
                          ${resumePath ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600;">Resume:</td>
                            <td style="padding: 8px 0; color: #333333;">✓ Attached (${path.basename(resumePath)})</td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        Our team will review your application and get back to you soon. If you have any questions or need to update your application, please feel free to contact us.
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                        Best regards,<br>
                        <strong style="color: #50b848;">Refex Group</strong><br>
                        <span style="color: #666666; font-size: 14px;">Human Resources Team</span>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                      <p style="color: #666666; font-size: 12px; margin: 0; line-height: 1.5;">
                        This is an automated confirmation email. Please do not reply to this message.<br>
                        Submitted on: ${new Date().toLocaleString()}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else if (formData.formType === 'contact_form') {
      subject = 'Thank You for Contacting Refex Group';
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #50b848 0%, #6ba644 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Thank You for Contacting Us</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 20px;">
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Dear ${formData.firstName || formData.lastName ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim() : 'Valued Customer'},
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Thank you for reaching out to Refex Group. We have successfully received your inquiry and appreciate your interest in our services.
                      </p>
                      
                      <div style="background-color: #f9f9f9; border-left: 4px solid #50b848; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">Your Inquiry Details:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                          ${formData.firstName || formData.lastName ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; width: 140px; font-weight: 600;">Name:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.firstName || ''} ${formData.lastName || ''}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600;">Email:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.email}</td>
                          </tr>
                          ${formData.phone ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600;">Phone:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.phone}</td>
                          </tr>
                          ` : ''}
                          ${formData.company ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600;">Company:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.company}</td>
                          </tr>
                          ` : ''}
                          ${formData.subject ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600;">Subject:</td>
                            <td style="padding: 8px 0; color: #333333;">${formData.subject}</td>
                          </tr>
                          ` : ''}
                          ${formData.message ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-weight: 600; vertical-align: top;">Message:</td>
                            <td style="padding: 8px 0; color: #333333; white-space: pre-wrap;">${formData.message}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        Our team will review your inquiry and respond to you as soon as possible, typically within 24-48 hours. If your matter is urgent, please feel free to contact us directly.
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                        Best regards,<br>
                        <strong style="color: #50b848;">Refex Group</strong><br>
                        <span style="color: #666666; font-size: 14px;">Customer Relations Team</span>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                      <p style="color: #666666; font-size: 12px; margin: 0; line-height: 1.5;">
                        This is an automated confirmation email. Please do not reply to this message.<br>
                        Submitted on: ${new Date().toLocaleString()}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else {
      return { success: false, error: 'Unknown form type' };
    }

    const mailOptions = {
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to: formData.email,
      subject: subject,
      html: htmlContent,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${formData.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to send email
async function sendFormEmail(formData, resumePath = null) {
  try {
    const settings = await EmailSettings.findOne({
      where: { isActive: true }
    });

    if (!settings || !settings.smtpUser || !settings.smtpPassword) {
      console.warn('Email settings not configured, skipping email send');
      return { success: false, error: 'Email not configured' };
    }

    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'Failed to create transporter' };
    }

    // Prepare email content based on form type
    let subject, htmlContent;
    const attachments = [];

    if (formData.formType === 'career_application') {
      subject = `New Career Application - ${formData.firstName} ${formData.lastName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <div style="background: linear-gradient(135deg, #50b848 0%, #6ba644 100%); padding: 20px; text-align: center; margin-bottom: 20px;">
            <h2 style="color: white; margin: 0;">New Career Application</h2>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Applicant Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${formData.firstName} ${formData.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${formData.email}">${formData.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0;">${formData.phone || 'Not provided'}</td>
              </tr>
            </table>
          </div>

          ${formData.message ? `
          <div style="padding: 20px; background: white; border-left: 4px solid #50b848; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
          </div>
          ` : ''}

          ${resumePath ? `
          <div style="padding: 15px; background: #fff3cd; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;">
              <strong>📎 Resume attached:</strong> ${path.basename(resumePath)}
            </p>
          </div>
          ` : ''}

          <div style="padding: 15px; background: #f0f0f0; border-radius: 5px; font-size: 12px; color: #666;">
            <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0 0 0;"><strong>IP Address:</strong> ${formData.ipAddress || 'Unknown'}</p>
          </div>
        </div>
      `;

      // Add resume attachment if exists
      if (resumePath) {
        attachments.push({
          filename: path.basename(resumePath),
          path: resumePath
        });
      }
    } else if (formData.formType === 'contact_form') {
      subject = `New Contact Form Submission${formData.subject ? ` - ${formData.subject}` : ''}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <div style="background: linear-gradient(135deg, #50b848 0%, #6ba644 100%); padding: 20px; text-align: center; margin-bottom: 20px;">
            <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 150px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${formData.firstName || ''} ${formData.lastName || ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${formData.email}">${formData.email}</a></td>
              </tr>
              ${formData.phone ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0;">${formData.phone}</td>
              </tr>
              ` : ''}
              ${formData.company ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td>
                <td style="padding: 8px 0;">${formData.company}</td>
              </tr>
              ` : ''}
              ${formData.subject ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0;">${formData.subject}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          ${formData.message ? `
          <div style="padding: 20px; background: white; border-left: 4px solid #50b848; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
          </div>
          ` : ''}

          <div style="padding: 15px; background: #f0f0f0; border-radius: 5px; font-size: 12px; color: #666;">
            <p style="margin: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0 0 0;"><strong>IP Address:</strong> ${formData.ipAddress || 'Unknown'}</p>
          </div>
        </div>
      `;
    }

    // Determine recipient email based on form type
    let recipientEmail;
    if (formData.formType === 'career_application') {
      recipientEmail = settings.careersEmail || settings.receivingEmail;
    } else if (formData.formType === 'contact_form') {
      recipientEmail = settings.contactEmail || settings.receivingEmail;
    } else {
      recipientEmail = settings.receivingEmail;
    }

    if (!recipientEmail) {
      console.warn('No recipient email configured for form type:', formData.formType);
      return { success: false, error: 'Recipient email not configured' };
    }

    // Prepare CC emails
    const ccEmails = settings.ccEmails
      ? settings.ccEmails.split(',').map(email => email.trim()).filter(email => email)
      : [];

    // Send email
    const mailOptions = {
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to: recipientEmail,
      cc: ccEmails.length > 0 ? ccEmails : undefined,
      subject: subject,
      html: htmlContent,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error('Error sending form email:', error);
    return { success: false, error: error.message };
  }
}

// Submit career application
exports.submitCareerApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const resumeFile = req.file;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    // Get IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create form submission record
    const submission = await FormSubmission.create({
      formType: 'career_application',
      firstName,
      lastName,
      email,
      phone,
      message,
      resumeUrl: resumeFile ? `/uploads/resumes/${resumeFile.filename}` : null,
      status: 'new',
      ipAddress,
      userAgent
    });

    // Send email notification to admin
    const emailResult = await sendFormEmail(
      {
        formType: 'career_application',
        firstName,
        lastName,
        email,
        phone,
        message,
        ipAddress
      },
      resumeFile ? resumeFile.path : null
    );

    if (emailResult.success) {
      await submission.update({
        emailSent: true,
        emailSentAt: new Date()
      });
    }

    // Send confirmation email to applicant (non-blocking)
    sendConfirmationEmail(
      {
        formType: 'career_application',
        firstName,
        lastName,
        email,
        phone,
        message
      },
      resumeFile ? resumeFile.path : null
    ).catch(err => {
      console.error('Failed to send confirmation email:', err);
      // Don't fail the request if confirmation email fails
    });

    res.json({
      success: true,
      message: 'Application submitted successfully',
      submissionId: submission.id
    });
  } catch (error) {
    console.error('Error submitting career application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, subject, message } = req.body;

    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    // Get IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create form submission record
    const submission = await FormSubmission.create({
      formType: 'contact_form',
      firstName,
      lastName,
      email,
      phone,
      company,
      subject,
      message,
      status: 'new',
      ipAddress,
      userAgent
    });

    // Send email notification to admin
    const emailResult = await sendFormEmail({
      formType: 'contact_form',
      firstName,
      lastName,
      email,
      phone,
      company,
      subject,
      message,
      ipAddress
    });

    if (emailResult.success) {
      await submission.update({
        emailSent: true,
        emailSentAt: new Date()
      });
    }

    // Send confirmation email to user (non-blocking)
    sendConfirmationEmail({
      formType: 'contact_form',
      firstName,
      lastName,
      email,
      phone,
      company,
      subject,
      message
    }).catch(err => {
      console.error('Failed to send confirmation email:', err);
      // Don't fail the request if confirmation email fails
    });

    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: submission.id
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

// Get all form submissions (admin only)
exports.getFormSubmissions = async (req, res) => {
  try {
    const { formType, status, limit = 50, offset = 0 } = req.query;

    const where = {};
    if (formType) where.formType = formType;
    if (status) where.status = status;

    const submissions = await FormSubmission.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ error: 'Failed to fetch form submissions' });
  }
};

// Update submission status
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await FormSubmission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    await submission.update({ status });
    res.json(submission);
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
};

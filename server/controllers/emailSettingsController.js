const { EmailSettings } = require('../models');

// Get email settings
exports.getEmailSettings = async (req, res) => {
    try {
        let settings = await EmailSettings.findOne({
            where: { isActive: true }
        });

        // If no settings exist, create default
        if (!settings) {
            settings = await EmailSettings.create({
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                smtpSecure: false,
                smtpUser: '',
                smtpPassword: '',
                fromEmail: '',
                fromName: 'Refex Group',
                receivingEmail: '',
                careersEmail: '',
                contactEmail: '',
                isActive: true
            });
        }

        // Don't send password to frontend for security
        const settingsData = settings.toJSON();
        settingsData.smtpPassword = settingsData.smtpPassword ? '********' : '';

        res.json(settingsData);
    } catch (error) {
        console.error('Error fetching email settings:', error);
        res.status(500).json({ error: 'Failed to fetch email settings' });
    }
};

// Update email settings
exports.updateEmailSettings = async (req, res) => {
    try {
        const {
            smtpHost,
            smtpPort,
            smtpSecure,
            smtpUser,
            smtpPassword,
            fromEmail,
            fromName,
            receivingEmail,
            careersEmail,
            contactEmail,
            ccEmails
        } = req.body;

        let settings = await EmailSettings.findOne({
            where: { isActive: true }
        });

        const updateData = {
            smtpHost,
            smtpPort,
            smtpSecure,
            smtpUser,
            fromEmail,
            fromName,
            receivingEmail,
            careersEmail,
            contactEmail,
            ccEmails
        };

        // Only update password if it's not the masked value
        if (smtpPassword && smtpPassword !== '********') {
            updateData.smtpPassword = smtpPassword;
        }

        if (settings) {
            await settings.update(updateData);
            console.log('✅ Email settings updated successfully in database');
        } else {
            // For new settings, password is required
            if (!smtpPassword || smtpPassword.trim() === '') {
                return res.status(400).json({ 
                    error: 'SMTP password is required when creating new email settings' 
                });
            }
            settings = await EmailSettings.create({
                ...updateData,
                smtpPassword: smtpPassword,
                isActive: true
            });
            console.log('✅ New email settings created successfully in database');
        }

        // Reload to get fresh data from database
        await settings.reload();
        console.log('📧 Email settings saved to database:', {
            id: settings.id,
            smtpHost: settings.smtpHost,
            smtpPort: settings.smtpPort,
            smtpUser: settings.smtpUser,
            fromEmail: settings.fromEmail,
            hasPassword: !!settings.smtpPassword
        });

        // Don't send password back
        const settingsData = settings.toJSON();
        settingsData.smtpPassword = '********';

        res.json(settingsData);
    } catch (error) {
        console.error('Error updating email settings:', error);
        const errorMessage = error.message || 'Failed to update email settings';
        res.status(500).json({ 
            error: 'Failed to update email settings',
            details: errorMessage
        });
    }
};

// Test email configuration
exports.testEmailSettings = async (req, res) => {
    try {
        const { testEmail } = req.body;

        if (!testEmail) {
            return res.status(400).json({ error: 'Test email address is required' });
        }

        const settings = await EmailSettings.findOne({
            where: { isActive: true }
        });

        if (!settings) {
            return res.status(404).json({ error: 'Email settings not configured' });
        }

        const nodemailer = require('nodemailer');

        // Create transporter
        // Fix SSL/TLS configuration: 
        // - Port 465: secure = true (SSL)
        // - Port 587: secure = false, requireTLS = true (STARTTLS)
        const transporterConfig = {
            host: settings.smtpHost,
            port: settings.smtpPort,
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPassword
            },
            // Add timeout and connection options
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000
        };

        // Configure SSL/TLS based on port to prevent "wrong version number" error
        if (settings.smtpPort === 465) {
            // Port 465 uses SSL (implicit SSL)
            transporterConfig.secure = true;
        } else if (settings.smtpPort === 587) {
            // Port 587 uses STARTTLS (explicit TLS upgrade, NOT SSL)
            transporterConfig.secure = false;
            transporterConfig.requireTLS = true;
            // Don't use SSLv3 - use modern TLS
            transporterConfig.tls = {
                rejectUnauthorized: false
            };
        } else {
            // For other ports, use the smtpSecure setting
            transporterConfig.secure = settings.smtpSecure || false;
            if (!transporterConfig.secure && settings.smtpPort !== 25) {
                transporterConfig.requireTLS = true;
            }
        }

        const transporter = nodemailer.createTransport(transporterConfig);

        // Verify connection first
        try {
            await transporter.verify();
        } catch (verifyError) {
            console.error('SMTP connection verification failed:', verifyError);
            let errorMessage = verifyError.message || 'Unable to connect to SMTP server.';
            
            // Provide specific guidance for common Gmail errors
            if (errorMessage.includes('Invalid login') || errorMessage.includes('authentication') || errorMessage.includes('EAUTH')) {
                errorMessage = 'Authentication failed. For Gmail, please ensure:\n1. 2-Step Verification is enabled\n2. You are using an App-Specific Password (not your regular password)\n3. The app password is correct';
            } else if (errorMessage.includes('Insufficient permissions') || errorMessage.includes('permission')) {
                errorMessage = 'Insufficient permissions. For Gmail:\n1. Enable 2-Step Verification on your Google account\n2. Generate an App-Specific Password at: https://myaccount.google.com/apppasswords\n3. Use that 16-character password (no spaces) in the SMTP Password field';
            } else if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED')) {
                errorMessage = 'Cannot connect to SMTP server. Please verify:\n1. SMTP Host: smtp.gmail.com\n2. SMTP Port: 587 (or 465 for SSL)\n3. SSL/TLS checkbox: Unchecked for port 587, Checked for port 465';
            }
            
            return res.status(400).json({
                error: 'SMTP connection failed',
                details: errorMessage
            });
        }

        // Send test email
        try {
            await transporter.sendMail({
                from: `"${settings.fromName}" <${settings.fromEmail}>`,
                to: testEmail,
                subject: 'Test Email - Refex Group CMS',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #50b848;">Email Configuration Test</h2>
            <p>This is a test email from your Refex Group CMS.</p>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Sent at: ${new Date().toLocaleString()}<br>
              From: ${settings.fromEmail}
            </p>
          </div>
        `
            });

            res.json({ success: true, message: `Test email sent successfully to ${testEmail}` });
        } catch (sendError) {
            console.error('Error sending test email:', sendError);
            let errorMessage = sendError.message || 'Unknown error occurred while sending email';
            
            // Provide specific guidance for common Gmail errors
            if (errorMessage.includes('Insufficient permissions') || errorMessage.includes('permission')) {
                errorMessage = 'Insufficient permissions. For Gmail:\n1. Enable 2-Step Verification on your Google account\n2. Generate an App-Specific Password at: https://myaccount.google.com/apppasswords\n3. Use that 16-character password (no spaces) in the SMTP Password field\n4. Make sure you selected "Mail" as the app type when generating the password';
            } else if (errorMessage.includes('Invalid login') || errorMessage.includes('authentication') || errorMessage.includes('EAUTH')) {
                errorMessage = 'Authentication failed. For Gmail:\n1. 2-Step Verification must be enabled\n2. You must use an App-Specific Password (not your regular Gmail password)\n3. The app password must be correct (16 characters, no spaces)\n4. Verify your SMTP Username matches your Gmail address exactly';
            } else if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ETIMEDOUT')) {
                errorMessage = 'Connection failed. Please verify:\n1. SMTP Host: smtp.gmail.com\n2. SMTP Port: 587 (TLS) or 465 (SSL)\n3. SSL/TLS checkbox: Unchecked for port 587, Checked for port 465\n4. Your firewall/network allows SMTP connections';
            }
            
            return res.status(500).json({
                error: 'Failed to send test email',
                details: errorMessage
            });
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({
            error: 'Failed to send test email',
            details: error.message
        });
    }
};

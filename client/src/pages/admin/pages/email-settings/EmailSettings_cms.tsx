import { useState, useEffect } from 'react';
import { emailSettingsService } from '../../../../services/apiService';
import { NotificationToast, useNotification } from '../../shared/NotificationToast';

interface EmailSettingsProps {
    token?: string;
}

export default function EmailSettings_cms({ token: _token }: EmailSettingsProps) {
    const [settings, setSettings] = useState<any>(null);
    const [formData, setFormData] = useState({
        smtpHost: '',
        smtpPort: 587,
        smtpSecure: false,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: 'Refex Group',
        receivingEmail: '',
        careersEmail: '',
        contactEmail: '',
        ccEmails: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const { notification, showNotification, hideNotification } = useNotification();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await emailSettingsService.get();
            setSettings(data);
            setFormData({
                smtpHost: data.smtpHost || '',
                smtpPort: data.smtpPort || 587,
                smtpSecure: data.smtpSecure || false,
                smtpUser: data.smtpUser || '',
                smtpPassword: '', // Always start with empty - user needs to enter password if they want to change it
                fromEmail: data.fromEmail || '',
                fromName: data.fromName || 'Refex Group',
                receivingEmail: data.receivingEmail || '',
                careersEmail: data.careersEmail || '',
                contactEmail: data.contactEmail || '',
                ccEmails: data.ccEmails || ''
            });
        } catch (error) {
            console.error('Error fetching email settings:', error);
            showNotification('Failed to load email settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        showNotification(text, type);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        hideNotification();

        try {
            // Validate required fields (password is optional if settings already exist)
            if (!formData.smtpHost || !formData.smtpPort || !formData.smtpUser || !formData.fromEmail || !formData.fromName) {
                showNotification('Please fill in all required fields', 'error');
                setSaving(false);
                return;
            }
            
            // If no existing settings and no password provided, require password
            if (!settings && (!formData.smtpPassword || formData.smtpPassword.trim() === '')) {
                showNotification('Please enter SMTP password', 'error');
                setSaving(false);
                return;
            }

            // Handle password - only send if user entered a new one
            const { smtpPassword, ...dataWithoutPassword } = formData;
            const dataToSave: any = { ...dataWithoutPassword };
            
            // Only include password if user entered a new one
            if (smtpPassword && smtpPassword.trim() !== '' && smtpPassword !== '********') {
                dataToSave.smtpPassword = smtpPassword;
            }

            const data = await emailSettingsService.update(dataToSave);
            setSettings(data);
            showNotification('Email settings saved successfully', 'success');

            // Update settings state but preserve password in form if user just entered it
            const updatedSettings = { ...data };
            // Keep password in formData if user just entered it (for testing purposes)
            if (smtpPassword && smtpPassword.trim() !== '' && smtpPassword !== '********') {
                // Don't clear the password field - user might want to test it
                // Just update other fields from the response
                setFormData(prev => ({
                    ...prev,
                    smtpHost: data.smtpHost || prev.smtpHost,
                    smtpPort: data.smtpPort || prev.smtpPort,
                    smtpSecure: data.smtpSecure !== undefined ? data.smtpSecure : prev.smtpSecure,
                    smtpUser: data.smtpUser || prev.smtpUser,
                    fromEmail: data.fromEmail || prev.fromEmail,
                    fromName: data.fromName || prev.fromName,
                    receivingEmail: data.receivingEmail || prev.receivingEmail,
                    careersEmail: data.careersEmail || prev.careersEmail,
                    contactEmail: data.contactEmail || prev.contactEmail,
                    ccEmails: data.ccEmails || prev.ccEmails,
                    // Keep the password they just entered
                }));
            } else {
                // If no new password was entered, refresh all fields
                setFormData({
                    smtpHost: data.smtpHost || '',
                    smtpPort: data.smtpPort || 587,
                    smtpSecure: data.smtpSecure || false,
                    smtpUser: data.smtpUser || '',
                    smtpPassword: '', // Clear password field
                    fromEmail: data.fromEmail || '',
                    fromName: data.fromName || 'Refex Group',
                    receivingEmail: data.receivingEmail || '',
                    careersEmail: data.careersEmail || '',
                    contactEmail: data.contactEmail || '',
                    ccEmails: data.ccEmails || ''
                });
            }
            setSettings(updatedSettings);
        } catch (error: any) {
            console.error('Error saving email settings:', error);
            let errorMessage = 'Failed to save email settings';
            
            if (error.response) {
                errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             error.response.data?.details ||
                             `Server error: ${error.response.status} ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message || 'An unexpected error occurred';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        if (!testEmail) {
            showNotification('Please enter a test email address', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(testEmail)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Check if required settings are configured
        if (!formData.smtpHost || !formData.smtpUser || !formData.fromEmail) {
            showNotification('Please save your email settings first before testing', 'error');
            return;
        }
        
        // Check if password is configured (either in form or in saved settings)
        if ((!formData.smtpPassword || formData.smtpPassword.trim() === '') && (!settings?.smtpPassword || settings.smtpPassword === '********')) {
            showNotification('Please enter and save your SMTP password before testing', 'error');
            return;
        }

        setTesting(true);
        hideNotification();
        
        // Show immediate feedback
        showNotification('Sending test email... Please wait.', 'info');

        try {
            const response = await emailSettingsService.test(testEmail);
            if (response.success || response.message) {
                showNotification(response.message || `✅ Test email sent successfully to ${testEmail}. Please check your inbox.`, 'success');
            } else {
                showNotification(`✅ Test email sent successfully to ${testEmail}. Please check your inbox.`, 'success');
            }
            setTestEmail('');
        } catch (error: any) {
            console.error('Error sending test email:', error);
            let errorMessage = 'Failed to send test email';
            
            if (error.response) {
                // Server responded with error
                const errorData = error.response.data;
                errorMessage = errorData?.details || 
                             errorData?.error || 
                             errorData?.message || 
                             errorData?.data?.error ||
                             `Server error (${error.response.status}): ${error.response.statusText}`;
                
                // Handle "Insufficient permissions" specifically for Gmail - use backend's detailed message
                if (errorMessage.includes('Insufficient permissions') || errorMessage.includes('permission')) {
                    // Backend already provides detailed instructions, use them
                    if (!errorMessage.includes('https://myaccount.google.com/apppasswords')) {
                        errorMessage = 'Insufficient permissions. For Gmail with 2FA enabled, you must use an App-Specific Password. Generate one at: https://myaccount.google.com/apppasswords';
                    }
                } else if (errorMessage.includes('Invalid login') || errorMessage.includes('authentication') || errorMessage.includes('EAUTH')) {
                    if (!errorMessage.includes('App-Specific Password')) {
                        errorMessage = 'Authentication failed. For Gmail with 2FA enabled, you must use an App-Specific Password, not your regular password. Generate one at: https://myaccount.google.com/apppasswords';
                    }
                } else if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED')) {
                    errorMessage = 'Cannot connect to SMTP server. Please check your SMTP Host and Port settings.';
                } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
                    errorMessage = 'Connection timeout. Please check your SMTP settings and network connection.';
                }
            } else if (error.request) {
                // Request made but no response
                errorMessage = 'No response from server. Please check your connection and try again.';
            } else {
                // Error setting up request
                errorMessage = error.message || 'An unexpected error occurred';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Email Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Configure SMTP settings for sending emails from the website</p>
                </div>
            </div>


            {/* Settings Form */}
            <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* SMTP Host */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Host <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.smtpHost}
                            onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="smtp.gmail.com"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">e.g., smtp.gmail.com, smtp.office365.com</p>
                    </div>

                    {/* SMTP Port */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Port <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.smtpPort}
                            onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="587"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">587 for TLS, 465 for SSL</p>
                    </div>

                    {/* SMTP Secure */}
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.smtpSecure}
                                onChange={(e) => handleInputChange('smtpSecure', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Use SSL/TLS (check for port 465, uncheck for port 587)</span>
                        </label>
                    </div>

                    {/* SMTP User */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Username/Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.smtpUser}
                            onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your-email@gmail.com"
                            required
                        />
                    </div>

                    {/* SMTP Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={formData.smtpPassword}
                            onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={settings?.smtpPassword ? "Enter new password (leave blank to keep current)" : "App-specific password"}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {settings?.smtpPassword ? "Leave blank to keep current password. For Gmail, use an app-specific password." : "For Gmail, use an app-specific password"}
                        </p>
                    </div>

                    {/* From Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.fromEmail}
                            onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="noreply@refex.group"
                            required
                        />
                    </div>

                    {/* From Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.fromName}
                            onChange={(e) => handleInputChange('fromName', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Refex Group"
                            required
                        />
                    </div>

                    {/* Receiving Email (Legacy) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Receiving Email (Legacy)
                        </label>
                        <input
                            type="email"
                            value={formData.receivingEmail}
                            onChange={(e) => handleInputChange('receivingEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="hr@refex.group"
                        />
                        <p className="text-xs text-gray-500 mt-1">Legacy field - use specific emails below instead</p>
                    </div>

                    {/* Careers Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Careers Form Email
                        </label>
                        <input
                            type="email"
                            value={formData.careersEmail}
                            onChange={(e) => handleInputChange('careersEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="careers@refex.group"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email to receive careers form submissions</p>
                    </div>

                    {/* Contact Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Form Email
                        </label>
                        <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="contact@refex.group"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email to receive contact form submissions</p>
                    </div>

                    {/* CC Emails */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CC Emails (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.ccEmails}
                            onChange={(e) => handleInputChange('ccEmails', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="email1@example.com, email2@example.com"
                        />
                        <p className="text-xs text-gray-500 mt-1">Comma-separated email addresses</p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <i className="ri-loader-4-line animate-spin"></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="ri-save-line"></i>
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Test Email Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Email Configuration</h3>
                <p className="text-sm text-gray-600 mb-3">Send a test email to verify your SMTP configuration is working correctly.</p>
                
                {(!settings || !settings.smtpHost || !settings.smtpUser || !settings.fromEmail || (!formData.smtpPassword && (!settings.smtpPassword || settings.smtpPassword === '********'))) && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 flex items-center gap-2">
                            <i className="ri-information-line"></i>
                            <span>Please save your email settings above before sending a test email.</span>
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter test email address"
                    />
                    <button
                        type="button"
                        onClick={handleTestEmail}
                        disabled={testing || !testEmail || !settings || !settings.smtpHost || !settings.smtpUser || !settings.fromEmail || (!formData.smtpPassword && (!settings.smtpPassword || settings.smtpPassword === '********'))}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                        {testing ? (
                            <>
                                <i className="ri-loader-4-line animate-spin text-sm"></i>
                                <span>Sending Test Email...</span>
                            </>
                        ) : (
                            <>
                                <i className="ri-mail-send-line text-sm"></i>
                                <span>Send Test Email</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <i className="ri-information-line"></i>
                    Gmail Configuration Help
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>1.</strong> Enable 2-factor authentication on your Gmail account</p>
                    <p><strong>2.</strong> Generate an app-specific password: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">https://myaccount.google.com/apppasswords</a></p>
                    <p><strong>3.</strong> Use the generated app password in the "SMTP Password" field above</p>
                    <p><strong>4.</strong> SMTP Host: smtp.gmail.com, Port: 587, SSL/TLS: Unchecked</p>
                </div>
            </div>

            {/* Toast Notification */}
            <NotificationToast
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={hideNotification}
                duration={notification.type === 'error' ? 8000 : 5000}
            />
        </div>
    );
}

module.exports = (sequelize, DataTypes) => {
    const EmailSettings = sequelize.define('EmailSettings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        smtpHost: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'smtp.gmail.com'
        },
        smtpPort: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 587
        },
        smtpSecure: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Use TLS (true for port 465, false for port 587)'
        },
        smtpUser: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'SMTP username/email'
        },
        smtpPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'SMTP password or app-specific password'
        },
        fromEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Email address to send from'
        },
        fromName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Refex Group'
        },
        receivingEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Email address to receive form submissions (legacy, kept for backward compatibility)'
        },
        careersEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Email address to receive careers form submissions'
        },
        contactEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Email address to receive contact form submissions'
        },
        ccEmails: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Comma-separated CC email addresses'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'email_settings',
        timestamps: true,
        underscored: true
    });

    return EmailSettings;
};

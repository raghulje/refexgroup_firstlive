module.exports = (sequelize, DataTypes) => {
    const FormSubmission = sequelize.define('FormSubmission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        formType: {
            type: DataTypes.ENUM('career_application', 'contact_form'),
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        resumeUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Path to uploaded resume file'
        },
        // Contact form specific fields
        subject: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Status tracking
        status: {
            type: DataTypes.ENUM('new', 'read', 'responded', 'archived'),
            allowNull: false,
            defaultValue: 'new'
        },
        emailSent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        emailSentAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'form_submissions',
        timestamps: true
    });

    return FormSubmission;
};

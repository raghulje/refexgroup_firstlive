const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HomeCareersSection = sequelize.define('HomeCareersSection', {
        tagline: { type: DataTypes.STRING, allowNull: true },
        title: { type: DataTypes.STRING, allowNull: true }, // HTML supported
        description: { type: DataTypes.TEXT, allowNull: true },
        primaryButtonText: { type: DataTypes.STRING, allowNull: true },
        primaryButtonLink: { type: DataTypes.STRING, allowNull: true },
        secondaryButtonText: { type: DataTypes.STRING, allowNull: true },
        secondaryButtonLink: { type: DataTypes.STRING, allowNull: true },
        imageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'media',
                key: 'id'
            }
        },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    }, { tableName: 'home_careers_sections', timestamps: true, underscored: true });

    HomeCareersSection.associate = (models) => {
        HomeCareersSection.belongsTo(models.Media, {
            foreignKey: 'imageId',
            as: 'image'
        });
    };

    return HomeCareersSection;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HomeCTASection = sequelize.define('HomeCTASection', {
        title: { type: DataTypes.STRING, allowNull: false },
        linkText: { type: DataTypes.STRING, allowNull: true },
        linkUrl: { type: DataTypes.STRING, allowNull: true },
        orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    }, { tableName: 'home_cta_sections', timestamps: true, underscored: true });

    return HomeCTASection;
};

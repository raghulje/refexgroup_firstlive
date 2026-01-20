const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RefrigerantsContent = sequelize.define('RefrigerantsContent', {
        hero_text: { type: DataTypes.TEXT, allowNull: true },
        hero_subtext: { type: DataTypes.TEXT, allowNull: true },
        intro_text: { type: DataTypes.TEXT, allowNull: true },
        breaking_ground_text: { type: DataTypes.TEXT, allowNull: true },
        quality_text: { type: DataTypes.TEXT, allowNull: true },
        safety_text: { type: DataTypes.TEXT, allowNull: true },
        hero_bg_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'refrigerants_content', timestamps: true });

    RefrigerantsContent.associate = (models) => {
        RefrigerantsContent.belongsTo(models.Media, { as: 'heroBg', foreignKey: 'hero_bg_id' });
    };

    return RefrigerantsContent;
};

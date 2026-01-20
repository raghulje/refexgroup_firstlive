const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ESGPageContent = sequelize.define('ESGPageContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_description: { type: DataTypes.TEXT, allowNull: true },
        intro_text_bold: { type: DataTypes.TEXT, allowNull: true },
        intro_text_regular: { type: DataTypes.TEXT, allowNull: true },
        champion_title: { type: DataTypes.STRING, allowNull: true },
        champion_text: { type: DataTypes.TEXT, allowNull: true },
        sdg_content_text: { type: DataTypes.TEXT, allowNull: true },
        governance_mission: { type: DataTypes.TEXT, allowNull: true },
        governance_vision: { type: DataTypes.TEXT, allowNull: true },
        hero_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        intro_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        sdg_hero_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        sustainability_report_pdf: { type: DataTypes.STRING, allowNull: true },
        esg_dashboard_pdf: { type: DataTypes.STRING, allowNull: true },
    }, { tableName: 'esg_page_content', timestamps: true });

    ESGPageContent.associate = (models) => {
        ESGPageContent.belongsTo(models.Media, { as: 'heroImage', foreignKey: 'hero_image_id' });
        ESGPageContent.belongsTo(models.Media, { as: 'introImage', foreignKey: 'intro_image_id' });
        ESGPageContent.belongsTo(models.Media, { as: 'sdgHeroImage', foreignKey: 'sdg_hero_image_id' });
    };

    return ESGPageContent;
};

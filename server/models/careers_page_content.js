const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CareersPageContent = sequelize.define('CareersPageContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_description: { type: DataTypes.TEXT, allowNull: true },
        intro_title: { type: DataTypes.STRING, allowNull: true },
        intro_text_1: { type: DataTypes.TEXT, allowNull: true },
        intro_text_2: { type: DataTypes.TEXT, allowNull: true },
        video_url: { type: DataTypes.STRING, allowNull: true },
        life_at_refex_title: { type: DataTypes.STRING, allowNull: true },
        life_at_refex_desc: { type: DataTypes.TEXT, allowNull: true },
        why_choose_refex_json: { type: DataTypes.JSON, allowNull: true },
        hero_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        life_at_refex_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'careers_page_content', timestamps: true });

    CareersPageContent.associate = (models) => {
        CareersPageContent.belongsTo(models.Media, { as: 'heroImage', foreignKey: 'hero_image_id' });
        CareersPageContent.belongsTo(models.Media, { as: 'lifeAtRefexImage', foreignKey: 'life_at_refex_image_id' });
    };

    return CareersPageContent;
};

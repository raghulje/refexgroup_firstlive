const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AboutPageContent = sequelize.define('AboutPageContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_description: { type: DataTypes.TEXT, allowNull: true },
        intro_quote: { type: DataTypes.STRING, allowNull: true },
        stats_years: { type: DataTypes.INTEGER, allowNull: true },
        stats_people: { type: DataTypes.INTEGER, allowNull: true },
        vision_text: { type: DataTypes.TEXT, allowNull: true },
        mission_text: { type: DataTypes.TEXT, allowNull: true },
        hero_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        intro_logo_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        group_photo_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'about_page_content', timestamps: true });

    AboutPageContent.associate = (models) => {
        AboutPageContent.belongsTo(models.Media, { as: 'heroImage', foreignKey: 'hero_image_id' });
        AboutPageContent.belongsTo(models.Media, { as: 'introLogo', foreignKey: 'intro_logo_id' });
        AboutPageContent.belongsTo(models.Media, { as: 'groupPhoto', foreignKey: 'group_photo_id' });
    };

    return AboutPageContent;
};

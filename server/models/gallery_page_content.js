const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const GalleryPageContent = sequelize.define('GalleryPageContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_desc: { type: DataTypes.TEXT, allowNull: true },
        welcome_title: { type: DataTypes.STRING, allowNull: true },
        welcome_text: { type: DataTypes.TEXT, allowNull: true },
        hero_bg_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        welcome_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'gallery_page_content', timestamps: true });

    GalleryPageContent.associate = (models) => {
        GalleryPageContent.belongsTo(models.Media, { as: 'heroBg', foreignKey: 'hero_bg_id' });
        GalleryPageContent.belongsTo(models.Media, { as: 'welcomeImage', foreignKey: 'welcome_image_id' });
    };

    return GalleryPageContent;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const NewsroomPageContent = sequelize.define('NewsroomPageContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_description: { type: DataTypes.TEXT, allowNull: true },
        hero_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'newsroom_page_content', timestamps: true });

    NewsroomPageContent.associate = (models) => {
        NewsroomPageContent.belongsTo(models.Media, { as: 'heroImage', foreignKey: 'hero_image_id' });
    };

    return NewsroomPageContent;
};

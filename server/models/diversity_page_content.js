const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const DiversityPageContent = sequelize.define('DiversityPageContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_desc: { type: DataTypes.TEXT, allowNull: true },
        beyou_title: { type: DataTypes.STRING, allowNull: true },
        beyou_desc: { type: DataTypes.TEXT, allowNull: true },
        believe_title: { type: DataTypes.STRING, allowNull: true },
        believe_desc: { type: DataTypes.TEXT, allowNull: true },
        hero_bg_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        beyou_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        believe_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'diversity_page_content', timestamps: true });

    DiversityPageContent.associate = (models) => {
        DiversityPageContent.belongsTo(models.Media, { as: 'heroBg', foreignKey: 'hero_bg_id' });
        DiversityPageContent.belongsTo(models.Media, { as: 'beyouImage', foreignKey: 'beyou_image_id' });
        DiversityPageContent.belongsTo(models.Media, { as: 'believeImage', foreignKey: 'believe_image_id' });
    };

    return DiversityPageContent;
};

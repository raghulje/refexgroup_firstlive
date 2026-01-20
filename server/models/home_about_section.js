const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HomeAboutSection = sequelize.define('HomeAboutSection', {
        title: { type: DataTypes.STRING, allowNull: true },
        tagline: { type: DataTypes.STRING, allowNull: true },
        content_paragraph_1: { type: DataTypes.TEXT, allowNull: true },
        content_paragraph_2: { type: DataTypes.TEXT, allowNull: true },
        content_paragraph_3: { type: DataTypes.TEXT, allowNull: true },
        content_paragraph_4: { type: DataTypes.TEXT, allowNull: true },
        button_text: { type: DataTypes.STRING, allowNull: true },
        button_link: { type: DataTypes.STRING, allowNull: true },
        main_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        logo_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'home_about_section', timestamps: true });

    HomeAboutSection.associate = (models) => {
        HomeAboutSection.belongsTo(models.Media, { as: 'mainImage', foreignKey: 'main_image_id' });
        HomeAboutSection.belongsTo(models.Media, { as: 'logoImage', foreignKey: 'logo_image_id' });
    };

    return HomeAboutSection;
};

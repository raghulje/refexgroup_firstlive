const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ContactPageContent = sequelize.define('ContactPageContent', {
        context_box_title: { type: DataTypes.STRING, allowNull: true },
        office_address: { type: DataTypes.TEXT, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: true },
        map_embed_url: { type: DataTypes.TEXT, allowNull: true },
        hero_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'contact_page_content', timestamps: true });

    ContactPageContent.associate = (models) => {
        ContactPageContent.belongsTo(models.Media, { as: 'heroImage', foreignKey: 'hero_image_id' });
    };

    return ContactPageContent;
};

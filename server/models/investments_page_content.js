const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const InvestmentsPageContent = sequelize.define('InvestmentsPageContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_desc: { type: DataTypes.TEXT, allowNull: true },
        intro_title: { type: DataTypes.TEXT, allowNull: true },
        cmd_message_quote: { type: DataTypes.TEXT, allowNull: true },
        cmd_message_text: { type: DataTypes.TEXT, allowNull: true },
        stock_refex_bse: { type: DataTypes.STRING, allowNull: true },
        stock_refex_nse: { type: DataTypes.STRING, allowNull: true },
        stock_renew_bse: { type: DataTypes.STRING, allowNull: true },
        contact_email: { type: DataTypes.STRING, allowNull: true },
        hero_bg_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
        cmd_image_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'investments_page_content', timestamps: true });

    InvestmentsPageContent.associate = (models) => {
        InvestmentsPageContent.belongsTo(models.Media, { as: 'heroBg', foreignKey: 'hero_bg_id' });
        InvestmentsPageContent.belongsTo(models.Media, { as: 'cmdImage', foreignKey: 'cmd_image_id' });
    };

    return InvestmentsPageContent;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RenewablesContent = sequelize.define('RenewablesContent', {
        hero_title: { type: DataTypes.STRING, allowNull: true },
        hero_scroller_years: { type: DataTypes.INTEGER, allowNull: true },
        hero_scroller_locations: { type: DataTypes.INTEGER, allowNull: true },
        hero_scroller_states: { type: DataTypes.INTEGER, allowNull: true },
        hero_bg_id: { type: DataTypes.INTEGER, references: { model: 'Media', key: 'id' } },
    }, { tableName: 'renewables_content', timestamps: true });

    RenewablesContent.associate = (models) => {
        RenewablesContent.belongsTo(models.Media, { as: 'heroBg', foreignKey: 'hero_bg_id' });
    };

    return RenewablesContent;
};

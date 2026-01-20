const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RefrigerantsProduct = sequelize.define('RefrigerantsProduct', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Media', key: 'id' },
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, { tableName: 'refrigerants_products', timestamps: true });

    RefrigerantsProduct.associate = (models) => {
        RefrigerantsProduct.belongsTo(models.Media, { as: 'image', foreignKey: 'image_id' });
    };

    return RefrigerantsProduct;
};

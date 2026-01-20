const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RefrigerantsFeature = sequelize.define('RefrigerantsFeature', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        icon_svg: {
            type: DataTypes.TEXT, // Using text to store SVG code if needed, or URL
            allowNull: true,
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, { tableName: 'refrigerants_features', timestamps: true });

    return RefrigerantsFeature;
};

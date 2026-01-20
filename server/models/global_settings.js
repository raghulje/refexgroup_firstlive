const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const GlobalSetting = sequelize.define('GlobalSettings', {
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        valueType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'string',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'global_settings',
        timestamps: true,
    });

    return GlobalSetting;
};

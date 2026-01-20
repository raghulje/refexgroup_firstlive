const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ESGPolicy = sequelize.define('ESGPolicy', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, { tableName: 'esg_policies', timestamps: true });

    return ESGPolicy;
};

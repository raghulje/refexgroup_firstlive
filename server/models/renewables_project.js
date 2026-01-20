const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RenewablesProject = sequelize.define('RenewablesProject', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        capacity: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        images_json: {
            type: DataTypes.JSON, // Array of image URLs
            allowNull: true,
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, { tableName: 'renewables_projects', timestamps: true });

    return RenewablesProject;
};

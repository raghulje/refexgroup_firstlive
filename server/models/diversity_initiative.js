const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const DiversityInitiative = sequelize.define('DiversityInitiative', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
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
    }, { tableName: 'diversity_initiatives', timestamps: true });

    DiversityInitiative.associate = (models) => {
        DiversityInitiative.belongsTo(models.Media, { as: 'image', foreignKey: 'image_id' });
    };

    return DiversityInitiative;
};

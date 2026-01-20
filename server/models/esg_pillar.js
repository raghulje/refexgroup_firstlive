const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ESGPillar = sequelize.define('ESGPillar', {
        type: {
            type: DataTypes.ENUM('environment', 'health', 'csr'),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        main_image_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Media', key: 'id' },
        },
        sub_points_json: {
            type: DataTypes.JSON, // Array of {title, description}
            allowNull: true,
        },
    }, { tableName: 'esg_pillars', timestamps: true });

    ESGPillar.associate = (models) => {
        ESGPillar.belongsTo(models.Media, { as: 'mainImage', foreignKey: 'main_image_id' });
    };

    return ESGPillar;
};

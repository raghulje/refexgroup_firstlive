const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HomeVideoSection = sequelize.define('HomeVideoSection', {
        videoUrl: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        thumbnailImageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'media',
                key: 'id'
            }
        },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    }, { tableName: 'home_video_sections', timestamps: true, underscored: true });

    HomeVideoSection.associate = (models) => {
        HomeVideoSection.belongsTo(models.Media, {
            foreignKey: 'thumbnailImageId',
            as: 'thumbnailImage'
        });
    };

    return HomeVideoSection;
};

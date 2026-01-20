"use strict";

module.exports = (sequelize, DataTypes) => {
  const GalleryImage = sequelize.define(
    "GalleryImage",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      galleryYear: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'gallery_events',
          key: 'id',
        },
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "gallery_images",
      underscored: true,
    }
  );

  GalleryImage.associate = function(models) {
    GalleryImage.belongsTo(models.Media, { foreignKey: 'imageId', as: 'image' });
    GalleryImage.belongsTo(models.GalleryEvent, { foreignKey: 'eventId', as: 'event' });
  };

  return GalleryImage;
};


"use strict";

module.exports = (sequelize, DataTypes) => {
  const GalleryEvent = sequelize.define(
    "GalleryEvent",
    {
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'gallery_albums',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      coverImageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "gallery_events",
      underscored: true,
    }
  );

  GalleryEvent.associate = function(models) {
    GalleryEvent.belongsTo(models.GalleryAlbum, { foreignKey: 'albumId', as: 'album' });
    GalleryEvent.belongsTo(models.Media, { foreignKey: 'coverImageId', as: 'coverImage' });
    GalleryEvent.hasMany(models.GalleryImage, { foreignKey: 'eventId', as: 'images' });
    GalleryEvent.hasMany(models.GalleryDocument, { foreignKey: 'eventId', as: 'documents' });
  };

  return GalleryEvent;
};


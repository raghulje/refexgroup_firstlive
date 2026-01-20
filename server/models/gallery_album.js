"use strict";

module.exports = (sequelize, DataTypes) => {
  const GalleryAlbum = sequelize.define(
    "GalleryAlbum",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
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
      albumType: {
        type: DataTypes.ENUM('year', 'month', 'category', 'custom'),
        allowNull: false,
        defaultValue: 'custom',
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
      tableName: "gallery_albums",
      underscored: true,
    }
  );

  GalleryAlbum.associate = function (models) {
    GalleryAlbum.belongsTo(models.Media, { foreignKey: 'coverImageId', as: 'coverImage' });
    GalleryAlbum.hasMany(models.GalleryEvent, { foreignKey: 'albumId', as: 'events' });
  };

  return GalleryAlbum;
};


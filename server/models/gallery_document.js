"use strict";

module.exports = (sequelize, DataTypes) => {
  const GalleryDocument = sequelize.define(
    "GalleryDocument",
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'gallery_events',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      documentType: {
        type: DataTypes.ENUM('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'other'),
        allowNull: false,
        defaultValue: 'pdf',
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
      tableName: "gallery_documents",
      underscored: true,
    }
  );

  GalleryDocument.associate = function(models) {
    GalleryDocument.belongsTo(models.GalleryEvent, { foreignKey: 'eventId', as: 'event' });
    GalleryDocument.belongsTo(models.Media, { foreignKey: 'documentId', as: 'document' });
  };

  return GalleryDocument;
};


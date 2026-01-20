"use strict";

module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define(
    "Media",
    {
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fileType: {
        type: DataTypes.ENUM('image', 'video', 'icon', 'logo', 'document', 'svg'),
        allowNull: false,
        defaultValue: 'image',
      },
      altText: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pageName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Page name for organization (e.g., home, about, business)'
      },
      sectionName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Section name for organization (e.g., hero, about, awards)'
      },
    },
    {
      tableName: "media",
      underscored: true,
    }
  );

  return Media;
};


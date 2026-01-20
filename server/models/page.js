"use strict";

module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define(
    "Page",
    {
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'published',
      },
      templateType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "pages",
      underscored: true,
    }
  );

  Page.associate = function (models) {
    Page.hasMany(models.Section, { foreignKey: 'pageId', as: 'sections' });
    Page.hasMany(models.HeroSlide, { foreignKey: 'pageId', as: 'heroSlides' });
  };

  return Page;
};


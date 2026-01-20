"use strict";

module.exports = (sequelize, DataTypes) => {
  const HeroSlide = sequelize.define(
    "HeroSlide",
    {
      pageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pages',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      backgroundImageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      buttonText: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buttonLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      videoId: {
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
      tableName: "hero_slides",
      underscored: true,
    }
  );

  HeroSlide.associate = function(models) {
    HeroSlide.belongsTo(models.Page, { foreignKey: 'pageId', as: 'page' });
    HeroSlide.belongsTo(models.Media, { foreignKey: 'backgroundImageId', as: 'backgroundImage' });
  };

  return HeroSlide;
};


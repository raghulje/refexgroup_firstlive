"use strict";

module.exports = (sequelize, DataTypes) => {
  const BusinessCard = sequelize.define(
    "BusinessCard",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      linkUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hoverColor: {
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
      tableName: "business_cards",
      underscored: true,
    }
  );

  BusinessCard.associate = function(models) {
    BusinessCard.belongsTo(models.Media, { foreignKey: 'imageId', as: 'image' });
  };

  return BusinessCard;
};


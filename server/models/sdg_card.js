"use strict";

module.exports = (sequelize, DataTypes) => {
  const SdgCard = sequelize.define(
    "SdgCard",
    {
      sdgNumber: {
        type: DataTypes.INTEGER,
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
      contribution: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      iconId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      bannerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gradientColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gradientStartPosition: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gradientEndPosition: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gradientDirection: {
        type: DataTypes.FLOAT,
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
      tableName: "sdg_cards",
      underscored: true,
    }
  );

  SdgCard.associate = function(models) {
    SdgCard.belongsTo(models.Media, { foreignKey: 'iconId', as: 'icon' });
    SdgCard.belongsTo(models.Media, { foreignKey: 'bannerId', as: 'banner' });
  };

  return SdgCard;
};


"use strict";

module.exports = (sequelize, DataTypes) => {
  const Award = sequelize.define(
    "Award",
    {
      awardType: {
        type: DataTypes.STRING,
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
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      recipient: {
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
      tableName: "awards",
      underscored: true,
    }
  );

  Award.associate = function(models) {
    Award.belongsTo(models.Media, { foreignKey: 'imageId', as: 'image' });
  };

  return Award;
};


"use strict";

module.exports = (sequelize, DataTypes) => {
  const CoreValue = sequelize.define(
    "CoreValue",
    {
      letter: {
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
      iconId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
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
      tableName: "core_values",
      underscored: true,
    }
  );

  CoreValue.associate = function(models) {
    CoreValue.belongsTo(models.Media, { foreignKey: 'iconId', as: 'icon' });
  };

  return CoreValue;
};


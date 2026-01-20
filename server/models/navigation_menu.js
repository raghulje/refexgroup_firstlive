"use strict";

module.exports = (sequelize, DataTypes) => {
  const NavigationMenu = sequelize.define(
    "NavigationMenu",
    {
      menuLocation: {
        type: DataTypes.ENUM('header', 'footer', 'mobile'),
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      linkType: {
        type: DataTypes.ENUM('internal', 'external', 'dropdown'),
        allowNull: false,
        defaultValue: 'internal',
      },
      linkUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'navigation_menus',
          key: 'id',
        },
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
      megaMenuTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      megaMenuMediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
    },
    {
      tableName: "navigation_menus",
      underscored: true,
    }
  );

  NavigationMenu.associate = function (models) {
    NavigationMenu.belongsTo(models.NavigationMenu, { foreignKey: 'parentId', as: 'parent' });
    NavigationMenu.hasMany(models.NavigationMenu, { foreignKey: 'parentId', as: 'children' });
    NavigationMenu.belongsTo(models.Media, { foreignKey: 'iconId', as: 'icon' });
    NavigationMenu.belongsTo(models.Media, { foreignKey: 'megaMenuMediaId', as: 'megaMenuImage' });
  };

  return NavigationMenu;
};


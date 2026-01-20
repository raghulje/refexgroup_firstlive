"use strict";

module.exports = (sequelize, DataTypes) => {
  const NewsroomItem = sequelize.define(
    "NewsroomItem",
    {
      type: {
        type: DataTypes.ENUM('press', 'event'),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'order_index',
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      badge: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      featuredImageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "newsroom_items",
      underscored: true,
    }
  );

  NewsroomItem.associate = function(models) {
    NewsroomItem.belongsTo(models.Media, { foreignKey: 'featuredImageId', as: 'featuredImage' });
  };

  return NewsroomItem;
};


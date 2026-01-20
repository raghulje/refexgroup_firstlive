"use strict";

module.exports = (sequelize, DataTypes) => {
  const SocialLink = sequelize.define(
    "SocialLink",
    {
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      iconClass: {
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
      tableName: "social_links",
      underscored: true,
    }
  );

  return SocialLink;
};


"use strict";

module.exports = (sequelize, DataTypes) => {
  const FooterSection = sequelize.define(
    "FooterSection",
    {
      sectionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sectionTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      links: {
        type: DataTypes.JSON,
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
      tableName: "footer_sections",
      underscored: true,
    }
  );

  return FooterSection;
};


"use strict";

module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "Section",
    {
      pageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pages',
          key: 'id',
        },
      },
      sectionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sectionKey: {
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
      tableName: "sections",
      underscored: true,
    }
  );

  Section.associate = function(models) {
    Section.belongsTo(models.Page, { foreignKey: 'pageId', as: 'page' });
    Section.hasMany(models.SectionContent, { foreignKey: 'sectionId', as: 'content' });
  };

  return Section;
};


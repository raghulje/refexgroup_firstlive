"use strict";

module.exports = (sequelize, DataTypes) => {
  const SectionContent = sequelize.define(
    "SectionContent",
    {
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'sections',
          key: 'id',
        },
      },
      contentKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contentValue: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contentType: {
        type: DataTypes.ENUM('text', 'html', 'json', 'media'),
        allowNull: false,
        defaultValue: 'text',
      },
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
      },
    },
    {
      tableName: "section_contents",
      underscored: true,
    }
  );

  SectionContent.associate = function(models) {
    SectionContent.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
    SectionContent.belongsTo(models.Media, { foreignKey: 'mediaId', as: 'media' });
  };

  return SectionContent;
};


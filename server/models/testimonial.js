"use strict";

module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define(
    "Testimonial",
    {
      quote: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authorPosition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authorImageId: {
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
      tableName: "testimonials",
      underscored: true,
    }
  );

  Testimonial.associate = function(models) {
    Testimonial.belongsTo(models.Media, { foreignKey: 'authorImageId', as: 'authorImage' });
  };

  return Testimonial;
};


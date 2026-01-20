"use strict";

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    "Job",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      requirements: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      responsibilities: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "jobs",
      underscored: true,
    }
  );

  return Job;
};


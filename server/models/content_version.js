"use strict";

module.exports = (sequelize, DataTypes) => {
  const ContentVersion = sequelize.define(
    "ContentVersion",
    {
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of entity (e.g., "hero-slide", "business-card", "section-content")',
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID of the entity this version belongs to',
      },
      versionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Version number (increments with each change)',
      },
      content: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Full snapshot of the content at this version',
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Summary of what changed in this version',
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'User who created this version',
      },
      action: {
        type: DataTypes.ENUM('create', 'update', 'delete', 'publish', 'unpublish'),
        allowNull: false,
        defaultValue: 'update',
      },
      isCurrent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether this is the current version',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Optional notes about this version',
      },
    },
    {
      tableName: "content_versions",
      underscored: true,
      indexes: [
        {
          fields: ['entity_type', 'entity_id'],
        },
        {
          fields: ['created_by'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  ContentVersion.associate = (models) => {
    ContentVersion.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });
  };

  return ContentVersion;
};


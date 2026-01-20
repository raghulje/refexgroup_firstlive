"use strict";

module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'User who performed the action',
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of entity (e.g., "hero-slide", "user", "media")',
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the entity (null for bulk operations)',
      },
      action: {
        type: DataTypes.ENUM('create', 'update', 'delete', 'publish', 'unpublish', 'login', 'logout', 'export', 'import'),
        allowNull: false,
      },
      oldValue: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous value before change',
      },
      newValue: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'New value after change',
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Summary of specific fields that changed',
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'IP address of the user',
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'User agent string',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Human-readable description of the action',
      },
    },
    {
      tableName: "audit_logs",
      underscored: true,
      indexes: [
        {
          fields: ['user_id'],
        },
        {
          fields: ['entity_type', 'entity_id'],
        },
        {
          fields: ['action'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return AuditLog;
};


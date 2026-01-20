"use strict";

module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define(
    "ActivityLog",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      activityType: {
        type: DataTypes.ENUM(
          'content_created',
          'content_updated',
          'content_deleted',
          'content_published',
          'content_unpublished',
          'user_login',
          'user_logout',
          'user_created',
          'user_updated',
          'media_uploaded',
          'media_deleted',
          'export_generated',
          'settings_changed'
        ),
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Type of entity involved',
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of entity involved',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Short title for the activity',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed description',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional metadata',
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the activity has been read',
      },
    },
    {
      tableName: "activity_logs",
      underscored: true,
      indexes: [
        {
          fields: ['user_id'],
        },
        {
          fields: ['activity_type'],
        },
        {
          fields: ['created_at'],
        },
        {
          fields: ['is_read'],
        },
      ],
    }
  );

  ActivityLog.associate = (models) => {
    ActivityLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return ActivityLog;
};


"use strict";

module.exports = (sequelize, DataTypes) => {
  const LoginHistory = sequelize.define(
    "LoginHistory",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      loginStatus: {
        type: DataTypes.ENUM('success', 'failed', 'locked'),
        allowNull: false,
        defaultValue: 'success',
      },
      failureReason: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Reason for failed login (e.g., "invalid_password", "account_locked")',
      },
      logoutAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When the user logged out',
      },
      sessionDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Session duration in seconds',
      },
    },
    {
      tableName: "login_history",
      underscored: true,
      indexes: [
        {
          fields: ['user_id'],
        },
        {
          fields: ['login_status'],
        },
        {
          fields: ['created_at'],
        },
      ],
    }
  );

  LoginHistory.associate = (models) => {
    LoginHistory.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return LoginHistory;
};


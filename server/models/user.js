"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      role: {
        type: DataTypes.ENUM('Super Admin', 'Admin', 'Editor', 'Viewer'),
        allowNull: false,
        defaultValue: 'Editor',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failedLoginAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['passwordHash'] },
        },
      },
    }
  );

  // Instance method to check if account is locked
  User.prototype.isLocked = function() {
    return this.lockedUntil && this.lockedUntil > new Date();
  };

  // Instance method to lock account
  User.prototype.lockAccount = async function(minutes = 30) {
    this.lockedUntil = new Date(Date.now() + minutes * 60 * 1000);
    await this.save();
  };

  // Instance method to unlock account
  User.prototype.unlockAccount = async function() {
    this.lockedUntil = null;
    this.failedLoginAttempts = 0;
    await this.save();
  };

  // Instance method to increment failed login attempts
  User.prototype.incrementFailedAttempts = async function() {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
      await this.lockAccount(30); // Lock for 30 minutes
    } else {
      await this.save();
    }
  };

  // Instance method to reset failed attempts on successful login
  User.prototype.resetFailedAttempts = async function() {
    this.failedLoginAttempts = 0;
    this.lastLogin = new Date();
    await this.save();
  };

  return User;
};


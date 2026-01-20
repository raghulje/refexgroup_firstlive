"use strict";

module.exports = (sequelize, DataTypes) => {
    const CmsPermission = sequelize.define(
        "CmsPermission",
        {
            role: {
                type: DataTypes.ENUM('Super Admin', 'Admin', 'Editor', 'Viewer'),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            pageKey: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            canCreate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            canEdit: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            canDelete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            canView: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            tableName: "cms_permissions",
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['role', 'page_key'],
                    name: 'unique_role_page',
                },
            ],
        }
    );

    return CmsPermission;
};

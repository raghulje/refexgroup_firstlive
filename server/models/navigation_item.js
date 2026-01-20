const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const NavigationItem = sequelize.define('NavigationItem', {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true, // Submenus might not have a direct path
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'navigation_items',
                key: 'id',
            },
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        section_type: {
            type: DataTypes.STRING, // 'header', 'footer_quick_links', 'footer_business_links', 'footer_other_links'
            defaultValue: 'header',
        }
    }, {
        tableName: 'navigation_items',
        timestamps: true,
    });

    NavigationItem.associate = (models) => {
        NavigationItem.hasMany(models.NavigationItem, { as: 'children', foreignKey: 'parent_id' });
        NavigationItem.belongsTo(models.NavigationItem, { as: 'parent', foreignKey: 'parent_id' });
    };

    return NavigationItem;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CareerTestimonial = sequelize.define('CareerTestimonial', {
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Media', key: 'id' },
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, { tableName: 'career_testimonials', timestamps: true });

    CareerTestimonial.associate = (models) => {
        CareerTestimonial.belongsTo(models.Media, { as: 'image', foreignKey: 'image_id' });
    };

    return CareerTestimonial;
};

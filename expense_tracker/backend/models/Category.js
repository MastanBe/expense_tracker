
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


class Category extends Model {}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users', 
            key: 'id',
        },
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
});

Category.associate = (models) => {
    Category.belongsTo(models.User, { foreignKey: 'userId' });
    Category.hasMany(models.Expense, { foreignKey: 'categoryId' });
   
};

module.exports = Category;

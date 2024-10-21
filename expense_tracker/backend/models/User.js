
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    security_question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    security_answer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});

User.associate = (models) => {
    User.hasMany(models.Expense, { foreignKey: 'userId' });
    User.hasMany(models.MonthlyBudget, { foreignKey: 'userId' });
    User.hasMany(models.Category, { foreignKey: 'userId' });
    User.hasMany(models.CategoryWiseBudget, { foreignKey: 'userId' });
};

module.exports = User;

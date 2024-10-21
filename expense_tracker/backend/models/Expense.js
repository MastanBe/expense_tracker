
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


class Expense extends Model {}

Expense.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    expense_url: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id',
        },
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
    monthlyBudgetId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'monthly_budgets', 
            key: 'id',
        },
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Expense',
    tableName: 'expenses',
    timestamps: true,
});

Expense.associate = (models) => {
    Expense.belongsTo(models.User, { foreignKey: 'userId' });
    Expense.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Expense.belongsTo(models.MonthlyBudget, { foreignKey: 'monthlyBudgetId' });
};

module.exports = Expense;

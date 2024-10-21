const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class MonthlyBudget extends Model {}

MonthlyBudget.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_monthly_budget: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    remaining_monthly_budget: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    remaining_categories_budget: {  
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0, 
    },
    current_spent_amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0,
    },
    budget_exceeded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    budget_exceeded_at: {
        type: DataTypes.DATE,
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
    modelName: 'MonthlyBudget',
    tableName: 'monthly_budgets',
    timestamps: true,
});

MonthlyBudget.associate = (models) => {
    MonthlyBudget.belongsTo(models.User, { foreignKey: 'userId' });
    MonthlyBudget.hasMany(models.Expense, { foreignKey: 'monthlyBudgetId' });
    MonthlyBudget.hasMany(models.CategoryWiseBudget, { foreignKey: 'monthlyBudgetId' });
};

module.exports = MonthlyBudget;

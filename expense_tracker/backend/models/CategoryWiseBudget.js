
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


class CategoryWiseBudget extends Model {}

CategoryWiseBudget.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    category_budget: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    remaining_category_budget: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    current_category_spent_amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0,
    },
    category_budget_exceeded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    category_budget_exceeded_at: {
        type: DataTypes.DATE,
    },
}, {
    sequelize,
    modelName: 'CategoryWiseBudget',
    tableName: 'categoryWise_budgets',
    timestamps: true,
});


CategoryWiseBudget.associate = (models) => {
    CategoryWiseBudget.belongsTo(models.Category, { foreignKey: 'categoryId' });
    CategoryWiseBudget.belongsTo(models.MonthlyBudget, { foreignKey: 'monthlyBudgetId' });
    CategoryWiseBudget.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = CategoryWiseBudget;

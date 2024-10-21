const MonthlyBudget = require('../models/MonthlyBudget');
const CategoryWiseBudget = require('../models/CategoryWiseBudget');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const generateMonthlyReport = async (month, year, userId) => {
    try {
        const monthlyBudget = await MonthlyBudget.findOne({
            where: {
                month,
                year,
                userId
            },
            include: [
                {
                    model: Expense,
                    where: { userId },
                    include: [{ model: Category, attributes: ['category_name'] }],
                    required: false
                },
                {
                    model: CategoryWiseBudget,
                    where: { userId },
                    required: false
                }
            ]
        });

        if (!monthlyBudget) {
            return { message: 'No budget found for the specified month and year.' };
        }

        const totalExpenses = monthlyBudget.Expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const totalCategoryBudgets = monthlyBudget.CategoryWiseBudgets.reduce((sum, budget) => sum + parseFloat(budget.category_budget), 0);

        return {
            month: monthlyBudget.month,
            year: monthlyBudget.year,
            totalMonthlyBudget: monthlyBudget.total_monthly_budget,
            remainingMonthlyBudget: monthlyBudget.remaining_monthly_budget,
            totalExpenses,
            totalCategoryBudgets,
            remainingCategoriesBudget: monthlyBudget.remaining_categories_budget,
            budgetExceeded: monthlyBudget.budget_exceeded,
            exceededAt: monthlyBudget.budget_exceeded_at,
            details: monthlyBudget.Expenses.map(expense => ({
                name: expense.name,
                amount: expense.amount,
                date: expense.createdAt,
                categoryName: expense.Category ? expense.Category.category_name : 'Uncategorized' 
            }))
        };
    } catch (error) {
        console.error('Error generating monthly report:', error);
        throw error;
    }
};

const generateYearlyReport = async (year, userId) => {
    try {
        const monthlyBudgets = await MonthlyBudget.findAll({
            where: {
                year,
                userId
            },
            include: [
                {
                    model: Expense,
                    where: { userId },
                    include: [{ model: Category, attributes: ['category_name'] }], 
                    required: false 
                }
            ]
        });

        const report = monthlyBudgets.map(monthlyBudget => {
            const totalExpenses = monthlyBudget.Expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
            return {
                month: monthlyBudget.month,
                year: monthlyBudget.year,
                totalMonthlyBudget: monthlyBudget.total_monthly_budget,
                remainingMonthlyBudget: monthlyBudget.remaining_monthly_budget,
                totalExpenses,
                budgetExceeded: monthlyBudget.budget_exceeded,
                exceededAt: monthlyBudget.budget_exceeded_at,
                details: monthlyBudget.Expenses.map(expense => ({
                    name: expense.name,
                    amount: expense.amount,
                    date: expense.createdAt,
                    categoryName: expense.Category ? expense.Category.category_name : 'Uncategorized' 
                }))
            };
        });

        return {
            year,
            monthlyReports: report
        };
    } catch (error) {
        console.error('Error generating yearly report:', error);
        throw error;
    }
};

const generateMonthlyReportCsv = async (month, year, userId) => {
    try {
        const monthlyBudget = await MonthlyBudget.findOne({
            where: {
                month,
                year,
                userId
            },
            include: [
                {
                    model: Expense,
                    where: { userId },
                    include: [{ model: Category, attributes: ['category_name'] }], 
                    required: false
                },
                {
                    model: CategoryWiseBudget,
                    where: { userId },
                    required: false 
                }
            ]
        });

        if (!monthlyBudget) {
            throw new Error('No budget found for the specified month and year.');
        }

        const totalExpenses = monthlyBudget.Expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);


        const records = monthlyBudget.Expenses.map(expense => ({
            month: monthlyBudget.month,
            year: monthlyBudget.year,
            totalMonthlyBudget: monthlyBudget.total_monthly_budget,
            remainingMonthlyBudget: monthlyBudget.remaining_monthly_budget,
            totalExpenses,
            expenseName: expense.name,
            expenseAmount: expense.amount,
            categoryName: expense.Category ? expense.Category.category_name : 'Uncategorized',
            expenseDate: expense.createdAt
        }));

       
        const csvWriter = createCsvWriter({
            path: `monthly_report_${month}_${year}.csv`,
            header: [
                { id: 'month', title: 'Month' },
                { id: 'year', title: 'Year' },
                { id: 'totalMonthlyBudget', title: 'Total Month Budget' },
                { id: 'remainingMonthlyBudget', title: 'Remaining Month Budget' },
                { id: 'totalExpenses', title: 'Total Expenses' },
                { id: 'expenseName', title: 'Expense Name' },
                { id: 'expenseAmount', title: 'Expense Amount' },
                { id: 'categoryName', title: 'Category Name' },
                { id: 'expenseDate', title: 'Expense Date' }
            ],
        });

        await csvWriter.writeRecords(records);

        return {
            message: 'Monthly report generated successfully.',
            filePath: `monthly_report_${month}_${year}.csv`,
        };
    } catch (error) {
        console.error('Error generating monthly report:', error);
        throw error;
    }
};

const generateYearlyReportCsv = async (year, userId) => {
    try {
        const monthlyBudgets = await MonthlyBudget.findAll({
            where: {
                year,
                userId
            },
            include: [
                {
                    model: Expense,
                    where: { userId },
                    include: [{ model: Category, attributes: ['category_name'] }], 
                    required: false 
                },
                {
                    model: CategoryWiseBudget,
                    where: { userId },
                    required: false 
                }
            ]
        });

        const records = monthlyBudgets.flatMap(monthlyBudget => {
            const totalExpenses = monthlyBudget.Expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

            return monthlyBudget.Expenses.map(expense => ({
                month: monthlyBudget.month,
                year: monthlyBudget.year,
                totalMonthlyBudget: monthlyBudget.total_monthly_budget,
                remainingMonthlyBudget: monthlyBudget.remaining_monthly_budget,
                totalExpenses,
                expenseName: expense.name,
                expenseAmount: expense.amount,
                categoryName: expense.Category ? expense.Category.category_name : 'Uncategorized',
                expenseDate: expense.createdAt
            }));
        });


        const csvWriter = createCsvWriter({
            path: `yearly_report_${year}.csv`,
            header: [
                { id: 'month', title: 'Month' },
                { id: 'year', title: 'Year' },
                { id: 'totalMonthlyBudget', title: 'Total Month Budget' },
                { id: 'remainingMonthlyBudget', title: 'Remaining Month Budget' },
                { id: 'totalExpenses', title: 'Total Expenses' },
                { id: 'expenseName', title: 'Expense Name' },
                { id: 'expenseAmount', title: 'Expense Amount' },
                { id: 'categoryName', title: 'Category Name' },
                { id: 'expenseDate', title: 'Expense Date' }
                
            ],
        });

        await csvWriter.writeRecords(records);

        return {
            message: 'Yearly report generated successfully.',
            filePath: `yearly_report_${year}.csv`,
        };
    } catch (error) {
        console.error('Error generating yearly report:', error);
        throw error;
    }
};

module.exports = {
    generateMonthlyReport,
    generateYearlyReport,
    generateMonthlyReportCsv,
    generateYearlyReportCsv
};

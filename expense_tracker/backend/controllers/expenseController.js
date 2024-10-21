const Expense = require('../models/Expense');
const MonthlyBudget = require('../models/MonthlyBudget'); 
const CategoryWiseBudget = require('../models/CategoryWiseBudget'); 

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
        });

        return res.json({ success: true, expenses });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const getExpenseById = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findOne({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        return res.json({ success: true, expense });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getExpenseByMonthlyId = async (req, res) => {
    const { monthlyBudgetId } = req.params;

    try {
        const expense = await Expense.findAll({
            where: {
                monthlyBudgetId,
                userId: req.user.id,
            },
        });

        if (!expense.length) { 
            return res.status(404).json({ success: false, message: 'No expenses found for this monthly budget ID' });
        }

        return res.json({ success: true, expense });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const getExpensesByYear = async (req, res) => {
    const { year } = req.params;

    try {
       
        const budgets = await MonthlyBudget.findAll({
            where: {
                year,
                userId: req.user.id,
            },
        });

        if (budgets.length === 0) {
            return res.status(404).json({ success: false, message: 'No budgets found for the specified year' });
        }

        
        const monthlyBudgetIds = budgets.map(budget => budget.id);

       
        const expenses = await Expense.findAll({
            where: {
                monthlyBudgetId: monthlyBudgetIds,
                userId: req.user.id,
            },
        });

        return res.status(200).json({ success: true, expenses });
    } catch (error) {
        console.error('Error fetching expenses by year:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching expenses' });
    }
};

const getExpensesByMonthAndYear = async (req, res) => {
    const { month, year } = req.params;

    try {
        
        const monthlyBudget = await MonthlyBudget.findOne({
            where: {
                month: month,
                year: year,
                userId: req.user.id,
            },
        });

        if (!monthlyBudget) {
            return res.status(404).json({ success: false, message: 'No budgets found for the specified month and year' });
        }

      
        const monthlyBudgetId = monthlyBudget.id;

       
        const expenses = await Expense.findAll({
            where: {
               monthlyBudgetId: monthlyBudgetId,
                userId: req.user.id,
            },
        });

        if (!expenses.length) {
            return res.status(404).json({ success: false, message: 'No expenses found for the specified month and year' });
        }

        res.status(200).json({ success: true, expenses });
    } catch (error) {
        console.error('Error fetching expenses by month and year:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching expenses' });
    }
};
const createExpense = async (req, res) => {
    const { name, amount, expense_url, categoryId, monthlyBudgetId } = req.body;

    try {
      
        const monthlyBudget = await MonthlyBudget.findByPk(monthlyBudgetId);
        if (!monthlyBudget) {
            return res.status(404).json({ success: false, message: 'Monthly budget not found' });
        }

       
        const categoryBudget = await CategoryWiseBudget.findOne({
            where: { categoryId, monthlyBudgetId, userId: req.user.id }
        });
        if (!categoryBudget) {
            return res.status(404).json({ success: false, message: 'Category budget not found' });
        }

        
        const expense = await Expense.create({
            name,
            amount,
            expense_url,
            categoryId,
            userId: req.user.id,
            monthlyBudgetId
        });

       
        categoryBudget.current_category_spent_amount += parseFloat(amount);
        categoryBudget.remaining_category_budget -= parseFloat(amount);

        if (categoryBudget.remaining_category_budget < 0) {
            categoryBudget.category_budget_exceeded = true;
            categoryBudget.category_budget_exceeded_at = new Date();
        }
        await categoryBudget.save();
        monthlyBudget.current_monthly_spent_amount += parseFloat(amount);
        monthlyBudget.remaining_monthly_budget -= parseFloat(amount);
        if (monthlyBudget.remaining_monthly_budget < 0) {
            monthlyBudget.monthly_budget_exceeded = true;
            monthlyBudget.monthly_budget_exceeded_at = new Date();
        }

        await monthlyBudget.save();

        res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            expense
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ success: false, message: 'Server error while creating expense' });
    }
};



const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { name, amount, expense_url, categoryId, monthlyBudgetId } = req.body;

    try {
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const originalAmount = parseFloat(expense.amount);
        const newAmount = parseFloat(amount);

        if (isNaN(originalAmount) || isNaN(newAmount)) {
            return res.status(400).json({ success: false, message: 'Invalid amounts provided' });
        }

        const difference = newAmount - originalAmount; 

        if (isNaN(difference)) {
            return res.status(400).json({ success: false, message: 'Invalid amount difference' });
        }

        const categoryBudget = await CategoryWiseBudget.findOne({
            where: { categoryId, monthlyBudgetId, userId: req.user.id }
        });
        if (!categoryBudget) {
            return res.status(404).json({ success: false, message: 'Category budget not found' });
        }

        const monthlyBudget = await MonthlyBudget.findByPk(monthlyBudgetId);
        if (!monthlyBudget) {
            return res.status(404).json({ success: false, message: 'Monthly budget not found' });
        }

        categoryBudget.current_category_spent_amount = parseFloat(categoryBudget.current_category_spent_amount) + difference;  // Ensure it's a number
        categoryBudget.remaining_category_budget = parseFloat(categoryBudget.remaining_category_budget) - difference;  // Ensure it's a number

        categoryBudget.category_budget_exceeded = categoryBudget.remaining_category_budget < 0;
        categoryBudget.category_budget_exceeded_at = categoryBudget.category_budget_exceeded ? new Date() : null;

        await categoryBudget.save();
        monthlyBudget.current_monthly_spent_amount = parseFloat(monthlyBudget.current_monthly_spent_amount) + difference;  // Ensure it's a number
        monthlyBudget.remaining_monthly_budget = parseFloat(monthlyBudget.remaining_monthly_budget) - difference;  // Ensure it's a number

        monthlyBudget.monthly_budget_exceeded = monthlyBudget.remaining_monthly_budget < 0;
        monthlyBudget.monthly_budget_exceeded_at = monthlyBudget.monthly_budget_exceeded ? new Date() : null;

        await monthlyBudget.save();
        expense.name = name;
        expense.amount = newAmount;
        expense.expense_url = expense_url;
        expense.categoryId = categoryId;
        expense.monthlyBudgetId = monthlyBudgetId;

        await expense.save();

        res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            expense
        });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ success: false, message: 'Server error while updating expense' });
    }
};
const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
       
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const { amount, categoryId, monthlyBudgetId } = expense;

        
        const expenseAmount = parseFloat(amount);
        if (isNaN(expenseAmount)) {
            return res.status(400).json({ success: false, message: 'Invalid expense amount' });
        }

        
        const categoryBudget = await CategoryWiseBudget.findOne({
            where: { categoryId, monthlyBudgetId, userId: req.user.id }
        });
        if (!categoryBudget) {
            return res.status(404).json({ success: false, message: 'Category budget not found' });
        }

        
        const monthlyBudget = await MonthlyBudget.findByPk(monthlyBudgetId);
        if (!monthlyBudget) {
            return res.status(404).json({ success: false, message: 'Monthly budget not found' });
        }

      
        categoryBudget.current_category_spent_amount = parseFloat(categoryBudget.current_category_spent_amount);
        categoryBudget.remaining_category_budget = parseFloat(categoryBudget.remaining_category_budget);

       
        categoryBudget.current_category_spent_amount -= expenseAmount; 
        categoryBudget.remaining_category_budget += expenseAmount; 

      
        categoryBudget.category_budget_exceeded = categoryBudget.remaining_category_budget < 0; 
        categoryBudget.category_budget_exceeded_at = categoryBudget.category_budget_exceeded ? new Date() : null; 

        await categoryBudget.save();
        monthlyBudget.current_monthly_spent_amount = parseFloat(monthlyBudget.current_monthly_spent_amount);
        monthlyBudget.remaining_monthly_budget = parseFloat(monthlyBudget.remaining_monthly_budget);
        monthlyBudget.current_monthly_spent_amount -= expenseAmount; 
        monthlyBudget.remaining_monthly_budget += expenseAmount; 


        monthlyBudget.monthly_budget_exceeded = monthlyBudget.remaining_monthly_budget < 0; 
        monthlyBudget.monthly_budget_exceeded_at = monthlyBudget.monthly_budget_exceeded ? new Date() : null; 

        await monthlyBudget.save(); 

   
        await expense.destroy();

       
        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            expense
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting expense' });
    }
};



module.exports = {
    createExpense,
    updateExpense,
    getExpenses,
    getExpenseById,
    getExpenseByMonthlyId,
    getExpensesByYear,
    getExpensesByMonthAndYear,
    deleteExpense,
};

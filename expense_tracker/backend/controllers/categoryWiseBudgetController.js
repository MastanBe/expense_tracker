const CategoryWiseBudget=require('../models/CategoryWiseBudget')
const MonthlyBudget  = require('../models/MonthlyBudget');


const getAllCategoryWiseBudgets = async (req, res) => {
    try {
        const categoryWiseBudgets = await CategoryWiseBudget.findAll();
        res.json(categoryWiseBudgets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getCategoryWiseBudgetById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const categoryWiseBudget = await CategoryWiseBudget.findByPk(id);
        
        if (!categoryWiseBudget) {
            return res.status(404).json({ message: 'CategoryWiseBudget not found' });
        }
        
        res.json(categoryWiseBudget);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createCategoryWiseBudget = async (req, res) => {
    const { categoryId, monthlyBudgetId, category_budget } = req.body;

    try {
        const userId = req.user.id; 
        const monthlyBudget = await MonthlyBudget.findByPk(monthlyBudgetId);

        if (!monthlyBudget) {
            return res.status(404).json({ message: 'MonthlyBudget not found' });
        }

        if (monthlyBudget.remaining_categories_budget <= 0) {
            return res.status(400).json({
                message: 'Cannot create category budget. No remaining categories budget available.',
            });
        }

        const categories = await CategoryWiseBudget.findAll({
            where: { monthlyBudgetId },
        });

        const currentCategoryBudgetSum = categories.reduce((sum, cat) => sum + parseFloat(cat.category_budget), 0);

        if (currentCategoryBudgetSum + parseFloat(category_budget) > parseFloat(monthlyBudget.total_monthly_budget)) {
            return res.status(400).json({
                message: `Cannot create category budget. Adding this budget exceeds the total monthly budget of ${monthlyBudget.total_monthly_budget}.`,
            });
        }

        const categoryWiseBudget = await CategoryWiseBudget.create({
            categoryId,
            userId, 
            monthlyBudgetId,
            category_budget,
            remaining_category_budget: category_budget,
        });

        
        monthlyBudget.remaining_categories_budget -= parseFloat(category_budget);
        await monthlyBudget.save();

        res.status(201).json({ categoryWiseBudget, remaining_categories_budget: monthlyBudget.remaining_categories_budget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateCategoryWiseBudget = async (req, res) => {
    const { id } = req.params;
    const { category_budget } = req.body; 

    try {
        const categoryWiseBudget = await CategoryWiseBudget.findByPk(id);
        if (!categoryWiseBudget) {
            return res.status(404).json({ message: 'CategoryWiseBudget not found' });
        }

       
        const monthlyBudget = await MonthlyBudget.findByPk(categoryWiseBudget.monthlyBudgetId);
        if (!monthlyBudget) {
            return res.status(404).json({ message: 'MonthlyBudget not found' });
        }

     
        if (monthlyBudget.remaining_categories_budget <= 0) {
            return res.status(400).json({
                message: 'Cannot update category budget. No remaining categories budget available.',
            });
        }
        const oldBudget = parseFloat(categoryWiseBudget.category_budget);
        const budgetDifference = parseFloat(category_budget) - oldBudget;

     
        const categories = await CategoryWiseBudget.findAll({
            where: { monthlyBudgetId: categoryWiseBudget.monthlyBudgetId },
        });

       
        const currentCategoryBudgetSum = categories
            .filter(cat => cat.id !== id)
            .reduce((sum, cat) => sum + parseFloat(cat.category_budget), 0);

        if (currentCategoryBudgetSum + parseFloat(category_budget) > parseFloat(monthlyBudget.total_monthly_budget)) {
            return res.status(400).json({
                message: `Cannot update category budget. This exceeds the total monthly budget of ${monthlyBudget.total_monthly_budget}.`,
            });
        }

      
        categoryWiseBudget.category_budget = category_budget;
        categoryWiseBudget.remaining_category_budget = category_budget; 
        await categoryWiseBudget.save();

        
        monthlyBudget.remaining_categories_budget = parseFloat(monthlyBudget.remaining_categories_budget) - budgetDifference;
        await monthlyBudget.save();

        res.json({ categoryWiseBudget, remaining_categories_budget: monthlyBudget.remaining_categories_budget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



const deleteCategoryWiseBudget = async (req, res) => {
    const { id } = req.params;

    try {
       
        const categoryWiseBudget = await CategoryWiseBudget.findByPk(id);

        if (!categoryWiseBudget) {
            return res.status(404).json({ message: 'CategoryWiseBudget not found' });
        }

     
        const monthlyBudget = await MonthlyBudget.findByPk(categoryWiseBudget.monthlyBudgetId);

        if (!monthlyBudget) {
            return res.status(404).json({ message: 'MonthlyBudget not found' });
        }

        
        monthlyBudget.remaining_categories_budget = parseFloat(monthlyBudget.total_monthly_budget)
        await monthlyBudget.save();
        await categoryWiseBudget.destroy();

        res.json({
            message: 'CategoryWiseBudget deleted successfully',
            remaining_categories_budget: monthlyBudget.remaining_categories_budget,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllCategoryWiseBudgets,
    getCategoryWiseBudgetById,
    createCategoryWiseBudget,
    updateCategoryWiseBudget,
    deleteCategoryWiseBudget,
};

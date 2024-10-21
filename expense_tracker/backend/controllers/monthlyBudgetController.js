const MonthlyBudget = require('../models/MonthlyBudget');
const CategoryWiseBudget = require('../models/CategoryWiseBudget'); 


const createBudget = async (req, res) => {
    const { month, year, total_monthly_budget } = req.body;
    
    try {
        const existingBudget = await MonthlyBudget.findOne({
            where: {
                month,
                year,
                userId: req.user.id,
            },
        });

        if (existingBudget) {
            return res.status(400).json({ success: false, message: 'Budget already exists for this month and year' });
        }

        const monthlyBudget = await MonthlyBudget.create({
            month,
            year,
            total_monthly_budget,
            remaining_monthly_budget: total_monthly_budget,
            remaining_categories_budget: total_monthly_budget,
            current_spent_amount: 0,
            budget_exceeded: false,
            userId: req.user.id,
        });

        return res.status(201).json({ success: true, monthlyBudget });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const getBudgets = async (req, res) => {
    try {
        const budgets = await MonthlyBudget.findAll({
            where: { userId: req.user.id },
        });

        return res.status(200).json({ success: true, budgets });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const getBudgetById = async (req, res) => {
    const { id } = req.params;

    try {
        const budget = await MonthlyBudget.findOne({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Monthly budget not found' });
        }

        return res.status(200).json({ success: true, budget });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getBudgetByMonthAndYear = async (req, res) => {
    const { month, year } = req.params;

    try {
        const budget = await MonthlyBudget.findOne({
            where: {
                month,
                year,
                userId: req.user.id,
            },
        });

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Monthly budget not found for the specified month and year' });
        }

        return res.status(200).json({ success: true, budget });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getBudgetsByYear = async (req, res) => {
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

        return res.status(200).json({ success: true, budgets });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { month, year, total_monthly_budget } = req.body;

    try {
        const budget = await MonthlyBudget.findOne({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Monthly budget not found' });
        }
       
        budget.month = month;
        budget.year = year;
        budget.total_monthly_budget = total_monthly_budget;

     
        budget.remaining_monthly_budget = total_monthly_budget; 
        budget.remaining_categories_budget= total_monthly_budget; 

        await budget.save();

         const categoriesToDelete = await CategoryWiseBudget.findAll({
            where: {
                monthlyBudgetId: budget.id,
            },
        });

       
        await Promise.all(categoriesToDelete.map(async (category) => {
            await category.destroy();
        }));
        return res.status(200).json({ success: true, message: 'Monthly budget updated successfully', budget });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const deleteBudget = async (req, res) => {
    const { id } = req.params;

    try {
        const budget = await MonthlyBudget.findOne({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Monthly budget not found' });
        }
      
        const categoriesToDelete = await CategoryWiseBudget.findAll({
            where: {
                monthlyBudgetId: budget.id,
            },
        });

        
        await Promise.all(categoriesToDelete.map(async (category) => {
            await category.destroy();
        }));

        await budget.destroy();

        return res.status(200).json({ success: true, message: 'Monthly budget deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    getBudgetByMonthAndYear,
    getBudgetsByYear,
    updateBudget,
    deleteBudget,
};

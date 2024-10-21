const express = require('express');
const {
    createExpense,
    getExpenses,
    getExpenseById,
    getExpenseByMonthlyId,
    getExpensesByYear,
    updateExpense,
    deleteExpense,
} = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/', authMiddleware, createExpense);
router.get('/', authMiddleware, getExpenses);
router.get('/:id', authMiddleware, getExpenseById);
router.get('/monthlyId/:monthlyBudgetId', authMiddleware,getExpenseByMonthlyId);
router.get('/year/:year',authMiddleware,getExpensesByYear);
router.get('/month/:month/year/:year',authMiddleware,getExpensesByYear);
router.put('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;

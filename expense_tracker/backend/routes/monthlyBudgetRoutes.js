const express = require('express');
const { 
    createBudget, 
    getBudgets, 
    getBudgetById, 
    getBudgetByMonthAndYear,
    getBudgetsByYear,
    updateBudget, 
    deleteBudget 
} = require('../controllers/monthlyBudgetController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/', authMiddleware, createBudget);
router.get('/', authMiddleware, getBudgets);
router.get('/:id', authMiddleware, getBudgetById);
router.get('/year/:year', authMiddleware, getBudgetsByYear);
router.get('/month/:month/year/:year', authMiddleware, getBudgetByMonthAndYear);
router.put('/:id', authMiddleware, updateBudget);
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;

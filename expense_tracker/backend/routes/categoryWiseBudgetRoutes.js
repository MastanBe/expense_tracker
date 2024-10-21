const express = require('express');
const {
    createCategoryWiseBudget,
    getAllCategoryWiseBudgets,
    getCategoryWiseBudgetById,
    updateCategoryWiseBudget,
    deleteCategoryWiseBudget,
} = require('../controllers/categoryWiseBudgetController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/', authMiddleware, createCategoryWiseBudget);

router.get('/', authMiddleware, getAllCategoryWiseBudgets);
router.get('/:id', authMiddleware,getCategoryWiseBudgetById);
router.put('/:id', authMiddleware, updateCategoryWiseBudget);

router.delete('/:id', authMiddleware, deleteCategoryWiseBudget);

module.exports = router;

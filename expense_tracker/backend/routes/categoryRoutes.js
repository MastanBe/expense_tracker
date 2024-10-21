const express = require('express');
const {
    createCategory,
    getCategories,
    getCategoryById,
    getCategoriesByYear,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createCategory);
router.get('/', authMiddleware, getCategories);
router.get('/:id', authMiddleware, getCategoryById);

router.get('/year/:year', authMiddleware, getCategoriesByYear);


router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;

const Category = require('../models/Category');
const { Op } = require('sequelize');
const createCategory = async (req, res) => {
    const { category_name } = req.body;

    try {
        const category = await Category.create({
            category_name,
            userId: req.user.id, 
        });
        return res.status(201).json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getCategoriesByYear = async (req, res) => {
    const { year } = req.params; 
    const userId = req.user.id;

    try {
        const whereCondition = { userId };

        if (year) {
            const startDate = new Date(Date.UTC(year, 0, 1)); 
            const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); 


            whereCondition.createdAt = {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            };
        }

        const categories = await Category.findAll({
            where: whereCondition,
        });

        return res.json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { userId: req.user.id },
        });
        return res.json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({
            where: {
                id,
                userId: req.user.id, 
            },
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        return res.json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    try {
        const category = await Category.findOne({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        category.category_name = category_name;
        await category.save();

        return res.json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await category.destroy();
        return res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoriesByYear,
    getCategoryById,
    updateCategory,
    deleteCategory,
};

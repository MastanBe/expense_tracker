import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryBudgetSuccess, fetchCategoryBudgetsSuccess, updateCategoryBudgetSuccess, deleteCategoryBudgetSuccess } from '../redux/actions/categoryBudgetActions';
import { useNavigate } from 'react-router-dom';

const CategoryBudget = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [categories, setCategories] = useState([]);
    const [monthlyBudgets, setMonthlyBudgets] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: '',
        category_budget: '',
        monthlyBudgetId: '',
    });
    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const categoryBudgets = useSelector((state) => state.categoryBudgets.categoryBudgets || []);

   
    const getMonthName = (month) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[month - 1] || 'Unknown Month'; 
    };

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            } else {
                setErrorMessage('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setErrorMessage('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [token]);

  
    const fetchMonthlyBudgets = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/monthly-budgets', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            
            if (data.success) {
                setMonthlyBudgets(data.budgets);
            } else {
                setErrorMessage('Failed to fetch monthly budgets');
            }
        } catch (error) {
            console.error('Error fetching monthly budgets:', error);
            setErrorMessage('Failed to fetch monthly budgets');
        } finally {
            setLoading(false);
        }
    }, [token]);

   
    const createCategoryBudget = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/category-wise-budgets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.categoryWiseBudget) {
                dispatch(createCategoryBudgetSuccess(data.categoryWiseBudget));
                clearForm();
            } else {
                setErrorMessage('creating category budget exceeds Monthly Budget');
            }
        } catch (error) {
            console.error('Error creating category budget:', error);
            setErrorMessage('Failed to create category budget');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryBudgets = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/category-wise-budgets', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data) {
                dispatch(fetchCategoryBudgetsSuccess(data));
            } else {
                alert('Failed to fetch category budgets');
            }
        } catch (error) {
            console.error('Error fetching budgets:', error);
            alert('Failed to fetch budgets');
        } finally {
            setLoading(false);
        }
    }, [token, dispatch]);

    
    const updateCategoryBudget = async (categoryId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/category-wise-budgets/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log("data is in update",data);
            
            if (data) {
                dispatch(updateCategoryBudgetSuccess(data.categoryWiseBudget));
                clearForm();
            } else {
                setErrorMessage('Failed to update category budget');
            }
        } catch (error) {
            console.error('Error updating category budget:', error);
            setErrorMessage('Failed to update category budget');
        } finally {
            setLoading(false);
        }
    };

   
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedBudgetId) {
            updateCategoryBudget(selectedBudgetId);
        } else {
            createCategoryBudget();
        }
    };

    
    const handleEdit = (categoryBudget) => {
        setFormData({
            categoryId: categoryBudget.categoryId,
            category_budget: categoryBudget.category_budget,
            monthlyBudgetId: categoryBudget.monthlyBudgetId,
        });
        setSelectedBudgetId(categoryBudget.id);
    };

   
    const deleteCategoryBudget = async (budgetId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/category-wise-budgets/${budgetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data) {
                dispatch(deleteCategoryBudgetSuccess(budgetId));
            } else {
                setErrorMessage('Failed to delete category budget');
            }
        } catch (error) {
            console.error('Error deleting category budget:', error);
            setErrorMessage('Failed to delete category budget');
        } finally {
            setLoading(false);
        }
    };

    
    const clearForm = () => {
        setFormData({ categoryId: '', category_budget: '', monthlyBudgetId: '' });
        setSelectedBudgetId(null);
        setErrorMessage('');
    };

   
    useEffect(() => {
        fetchCategories();
        fetchMonthlyBudgets();
        fetchCategoryBudgets();
    }, [fetchCategories, fetchMonthlyBudgets, fetchCategoryBudgets]);

   
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.category_name : 'Unknown Category';
    };

    const getMonthYear = (monthlyBudgetId) => {
        const budget = monthlyBudgets.find(bud => bud.id === monthlyBudgetId);
        return budget ? `${getMonthName(budget.month)} ${budget.year}` : 'Unknown Month/Year';
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white  bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Category Budgets</h1>
            <button onClick={() => navigate('/welcome')} className=" bg-gray-500 mb-4 cursor-pointer hover:bg-gray-600 text-white p-2 rounded-md w-60">
                    Back
                </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {loading && <p className="text-blue-500">Loading...</p>}

            <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row md:items-center">
                <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="mb-4 md:mb-0 md:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Budget Amount"
                    value={formData.category_budget}
                    onChange={(e) => setFormData({ ...formData, category_budget: e.target.value })}
                    required
                    className="mb-4 md:mb-0 md:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <select
                    value={formData.monthlyBudgetId}
                    onChange={(e) => setFormData({ ...formData, monthlyBudgetId: e.target.value })}
                    required
                    className="mb-4 md:mb-0 md:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                >
                    <option value="">Select Month</option>
                    {monthlyBudgets.map((budget) => (
                        <option key={budget.id} value={budget.id}>{`${getMonthName(budget.month)} ${budget.year}`}</option>
                    ))}
                </select>
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
            </form>

            <h2 className="text-2xl font-bold mb-4">Budget List</h2>
            <div className="border border-gray-300 bg-white rounded-md p-4 overflow-y-auto flex-grow">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border px-4 py-2">Id</th>
                                <th className="border px-4 py-2">Category Name</th>
                                <th className="border px-4 py-2">Month & Year</th>
                                <th className="border px-4 py-2">CategoryBudget</th>
                                <th className="border px-4 py-2">Current Category Spent amount</th>
                                <th className="border px-4 py-2">Remaining CategoryBudget</th>
                                <th className="border px-4 py-2">Actions</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {categoryBudgets.map((budget) => (
                                <tr key={budget.id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{budget.id}</td>
                                    <td className="border px-4 py-2">{getCategoryName(budget.categoryId)}</td>
                                    <td className="border px-4 py-2">{getMonthYear(budget.monthlyBudgetId)}</td>
                                    <td className="border px-4 py-2">₹{budget.category_budget}</td>
                                    <td className="border px-4 py-2">₹{budget.current_category_spent_amount}</td>
                                    <td className="border px-4 py-2">₹{parseFloat(budget.remaining_category_budget).toFixed(2)}</td>
                                    <td className=" px-4 py-2 flex  justify-center  text-center  align-middle mt-2 space-x-2">
                                        <button
                                            onClick={() => handleEdit(budget)}
                                            className="bg-yellow-500 text-white p-1 rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCategoryBudget(budget.id)}
                                            className="bg-red-500 text-white p-1 rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default CategoryBudget;

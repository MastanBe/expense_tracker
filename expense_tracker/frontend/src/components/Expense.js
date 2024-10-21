import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchExpensesSuccess,
    createExpenseSuccess,
    updateExpenseSuccess,
    deleteExpenseSuccess,
    expenseError,
} from '../redux/actions/expenseActions';
import { useNavigate } from 'react-router-dom';

const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

const Expense = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { expenses, error } = useSelector((state) => state.expenses || {});

    const [expenseForm, setExpenseForm] = useState({
        name: '',
        amount: 0,
        expense_url: '',
        categoryId: '',
        monthlyBudgetId: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [monthlyBudgets, setMonthlyBudgets] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/expenses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    dispatch(fetchExpensesSuccess(data.expenses));
                } else {
                    dispatch(expenseError(data.message));
                }
            } catch {
                dispatch(expenseError('Failed to fetch expenses'));
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setCategories(data.categories);
                } else {
                    dispatch(expenseError(data.message));
                }
            } catch {
                dispatch(expenseError('Failed to fetch categories'));
            }
        };

        const fetchMonthlyBudgets = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/monthly-budgets', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setMonthlyBudgets(data.budgets);
                } else {
                    dispatch(expenseError(data.message));
                }
            } catch {
                dispatch(expenseError('Failed to fetch monthly budgets'));
            }
        };

        fetchExpenses();
        fetchCategories();
        fetchMonthlyBudgets();
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'amount' ? parseFloat(value) : value
        setExpenseForm((prevState) => ({
            ...prevState,
            [name]: parsedValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(typeof expenseForm.amount);
        
        

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId
            ? `http://localhost:5000/api/expenses/${editingId}`
            : 'http://localhost:5000/api/expenses';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(expenseForm),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    if (editingId) {
                        dispatch(updateExpenseSuccess(data.expense));
                    } else {
                        dispatch(createExpenseSuccess(data.expense));
                    }
                    setExpenseForm({
                        name: '',
                        amount: 0,
                        expense_url: '',
                        categoryId: '',
                        monthlyBudgetId: '',
                    });
                    setEditingId(null);
                } else {
                    dispatch(expenseError(data.message));
                }
            })
            .catch(() => {
                dispatch(expenseError('Failed to save expense'));
            });
    };

    const handleEdit = (expense) => {
        setExpenseForm(expense);
        setEditingId(expense.id);
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/api/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    dispatch(deleteExpenseSuccess(id));
                } else {
                    dispatch(expenseError(data.message));
                }
            })
            .catch(() => {
                dispatch(expenseError('Failed to delete expense'));
            });
    };

    const handleBack = () => {
        navigate('/welcome'); 
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 bg-gradient-to-r from-purple-300 via-pink-300 to-red-200 ">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Expense Manager</h2>
            
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button onClick={handleBack} className="bg-gray-500 text-white rounded-md p-2 mb-4 w-40   hover:bg-gray-600 transition">
                Back
            </button>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Expense Name"
                        value={expenseForm.name}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={expenseForm.amount}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="expense_url"
                        placeholder="Expense URL"
                        value={expenseForm.expense_url}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />

                
                    <select
                        name="categoryId"
                        value={expenseForm.categoryId}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>

                   
                    <select
                        name="monthlyBudgetId"
                        value={expenseForm.monthlyBudgetId}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select Monthly Budget</option>
                        {monthlyBudgets.length > 0 && monthlyBudgets.map((budget) => (
                            <option key={budget.id} value={budget.id}>
                                {monthNames[budget.month - 1]} - {budget.year}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-md p-3 w-full hover:bg-blue-700 transition"
                    >
                        {editingId ? 'Update Expense' : 'Add Expense'}
                    </button>
                </div>
            </form>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Expense List</h3>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Amount</th>
                        <th className="border border-gray-300 px-4 py-2">Month</th>
                        <th className="border border-gray-300 px-4 py-2">Year</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length > 0 && expenses.map((expense) => {
                        const budget = monthlyBudgets.find(b => b.id === expense.monthlyBudgetId);
                        return (
                            <tr key={expense.id} className="border-b hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{expense.name}</td>
                                <td className="border border-gray-300 px-4 py-2">₹{expense.amount}</td>
                                <td className="border border-gray-300 px-4 py-2">{budget ? monthNames[budget.month - 1] : 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-2">{budget ? budget.year : 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                                    <button onClick={() => handleEdit(expense)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Expense;


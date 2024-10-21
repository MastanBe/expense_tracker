import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setBudgets, addBudget, editBudget, deleteBudget } from '../redux/actions/monthlyBudgetActions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const MonthlyBudget = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const budgets = useSelector((state) => state.monthlyBudgets.budgets);

    const [selectedDate, setSelectedDate] = useState(null);
    const [totalMonthlyBudget, setTotalMonthlyBudget] = useState('');
    const [editingBudget, setEditingBudget] = useState(null);
    const [showBudgets, setShowBudgets] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        const fetchBudgets = async () => {
            const response = await fetch('http://localhost:5000/api/monthly-budgets', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                dispatch(setBudgets(data.budgets));
            }
        };
        fetchBudgets();
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !totalMonthlyBudget) return;

        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            alert("You cannot select a past month.");
            return;
        }

        const budgetData = {
            month: month,
            year: year,
            month_name: format(selectedDate, 'MMMM'),
            total_monthly_budget: totalMonthlyBudget,
        };

        if (editingBudget) {
            const response = await fetch(`http://localhost:5000/api/monthly-budgets/${editingBudget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(budgetData),
            });
            const data = await response.json();
            if (data.success) {
                dispatch(editBudget(data.budget));
            }
        } else {
            const response = await fetch('http://localhost:5000/api/monthly-budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(budgetData),
            });
            const data = await response.json();
            if (data.success) {
                dispatch(addBudget(data.monthlyBudget));
            }
        }

    
        setSelectedDate(null);
        setTotalMonthlyBudget('');
        setEditingBudget(null);
        setShowForm(false);
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setSelectedDate(new Date(budget.year, budget.month - 1));
        setTotalMonthlyBudget(budget.total_monthly_budget);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:5000/api/monthly-budgets/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (data.success) {
            dispatch(deleteBudget(id));
        }
    };

    const getMonthName = (monthNumber) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNumber - 1];
    };
    console.log("month bud",budgets);

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4 text-center">Monthly Budgets</h2>
            <div className="flex justify-between mb-4 ">
                <button onClick={() => navigate('/welcome')} className="bg-gray-500 w-40 text-white p-2 rounded-md">
                    Back
                </button>
                <button
                    onClick={() => {
                        setShowBudgets(!showBudgets);
                        setShowForm(false); 
                    }}
                    className="bg-blue-500 w-60 text-white p-2 rounded-md"
                >
                    {showBudgets ? 'Hide Monthly Budgets' : 'Show Monthly Budgets'}
                </button>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setShowBudgets(false); 
                    }}
                    className="bg-green-500 w-40 text-white p-2 rounded-md"
                >
                    {showForm ? 'Cancel' : 'Create Budget'}
                </button>
            </div>

            {showForm && (
                <div className="border border-gray-300 p-4 bg-white rounded-md mb-4">
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            showMonthYearPicker
                            dateFormat="MMMM yyyy"
                            className="border p-2 mr-2 w-max rounded-md"
                            placeholderText="Select Month and Year"
                            required
                        />
                        <input
                            type="number"
                            value={totalMonthlyBudget}
                            onChange={(e) => setTotalMonthlyBudget(e.target.value)}
                            placeholder="Total Monthly Budget"
                            className="border p-2 mr-2 w-max mt-2 rounded-md"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md mt-2">
                            {editingBudget ? 'Update Budget' : 'Create Budget'}
                        </button>
                    </form>
                </div>
            )}
            

            {showBudgets && (
                <div className="border border-gray-300 bg-white rounded-md p-4 overflow-y-auto flex-grow">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border px-4 py-2">Id</th>
                                <th className="border px-4 py-2">Month</th>
                                <th className="border px-4 py-2">Year</th>
                                <th className="border px-4 py-2">Total Budget</th>
                                <th className="border px-4 py-2">Current Spent Amount</th>
                                <th className="border px-4 py-2">Remaining Budget</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                            
                            {budgets.map((budget) => (
                                <tr key={budget.id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{budget.id}</td>
                                    <td className="border px-4 py-2">{getMonthName(budget.month)}</td>
                                    <td className="border px-4 py-2">{budget.year}</td>
                                    <td className="border px-4 py-2">₹{budget.total_monthly_budget}</td>
                                    <td className="border px-4 py-2">₹{budget.total_monthly_budget - budget.remaining_monthly_budget}</td>
                                    <td className="border px-4 py-2">₹{budget.remaining_monthly_budget}</td>
                                    <td className="border px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(budget)}
                                            className="bg-yellow-500 text-white p-1 rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(budget.id)}
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
            )}
        </div>
    );
};

export default MonthlyBudget;

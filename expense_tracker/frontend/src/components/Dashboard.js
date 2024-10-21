import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpensesSuccess, expenseError } from '../redux/actions/expenseActions';
import { setBudgets } from '../redux/actions/monthlyBudgetActions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chart.js/auto';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const { expenses = [], error: expensesError } = useSelector((state) => state.expenses || {});
    const { budgets = [], error: budgetsError } = useSelector((state) => state.monthlyBudgets || {});
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('monthly');
    const [monthlyBudgetId, setMonthlyBudgetId] = useState(null); 

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();
                const url = viewMode === 'monthly'
                    ? `http://localhost:5000/api/monthly-budgets/month/${month}/year/${year}`
                    : `http://localhost:5000/api/monthly-budgets/year/${year}`;

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();

                if (data.success) {
                    dispatch(setBudgets(data.budgets || data.budget));
                    setTotalBudget(viewMode === 'monthly' ? data.budget?.total_monthly_budget || 0 : data.budgets.reduce((acc, b) => acc + parseFloat(b.total_monthly_budget), 0) || 0);

                    if (viewMode === 'monthly') {
                        const monthlyId = data.budget?.id;
                        setMonthlyBudgetId(monthlyId);
                        if (!monthlyId) {
                            setTotalExpense(0);
                            dispatch(fetchExpensesSuccess([]));
                            return;
                        }
                        await fetchExpenses(monthlyId);
                    } else {
                        await fetchYearlyExpenses(year);
                    }
                } else {
                    setTotalBudget(0);
                    dispatch(expenseError(data.message));
                    setTotalExpense(0);
                    dispatch(fetchExpensesSuccess([]));
                }
            } catch (err) {
                dispatch(expenseError('Failed to fetch budgets'));
                setTotalExpense(0);
            } finally {
                setLoading(false);
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
                    const categoryMap = data.categories.reduce((acc, category) => {
                        acc[category.id] = category.category_name;
                        return acc;
                    }, {});
                    setCategories(categoryMap);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchBudgets();
        fetchCategories();
    }, [dispatch, selectedDate, viewMode]);

    const fetchExpenses = async (monthlyBudgetId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/expenses/monthlyId/${monthlyBudgetId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                dispatch(fetchExpensesSuccess(data.expense));
                const totalExpenseAmount = data.expense.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
                setTotalExpense(totalExpenseAmount);
            } else {
                setTotalExpense(0);
                dispatch(expenseError(data.message));
            }
        } catch (err) {
            setTotalExpense(0);
            dispatch(expenseError('Failed to fetch expenses'));
        }
    };

    const fetchYearlyExpenses = async (year) => {
        try {
            const response = await fetch(`http://localhost:5000/api/expenses/year/${year}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                dispatch(fetchExpensesSuccess(data.expenses));
                const totalExpenseAmount = data.expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
                setTotalExpense(totalExpenseAmount);
            } else {
                setTotalExpense(0);
                dispatch(expenseError(data.message));
            }
        } catch (err) {
            dispatch(expenseError('Failed to fetch yearly expenses'));
            setTotalExpense(0);
        }
    };

    const barChartData = {
        labels: ['Total Budget', 'Total Expense'],
        datasets: [
            {
                label: 'Budget vs Expense',
                data: [totalBudget, totalExpense],
                backgroundColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
                borderWidth: 1,
            },
        ],
    };

    const categoryWiseExpenses = expenses.reduce((acc, expense) => {
        const category = categories[expense.categoryId] || 'Uncategorized';
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
        return acc;
    }, {});

    const pieChartData = {
        labels: Object.keys(categoryWiseExpenses),
        datasets: [
            {
                data: Object.values(categoryWiseExpenses),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gradient-to-r from-purple-200 via-pink-200 to-red-300 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            {(expensesError || budgetsError) && (
                <div className="text-red-500 mb-2">
                    {expensesError || budgetsError}
                </div>
            )}

            <div className="flex items-center space-x-4 mb-4">
                <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-60"
                >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat={viewMode === 'monthly' ? "MMMM yyyy" : "yyyy"}
                    showMonthYearPicker={viewMode === 'monthly'}
                    showYearPicker={viewMode === 'yearly'}
                    className="border border-gray-300 rounded p-2"
                />
                <button onClick={() => navigate('/welcome')} className="bg-gray-500 text-white p-2 rounded-md w-60">
                    Back
                </button>
            </div>

          
            {monthlyBudgetId && (
                <div className="mb-4 text-lg font-semibold">
                    Month: {selectedDate.toLocaleString('default', { month: 'long' })}, Year: {selectedDate.getFullYear()}
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
                    <h2 className="text-lg font-semibold text-gray-600 ">Total Budget</h2>
                    <p className="text-2xl text-green-400">₹{parseFloat(totalBudget) || 0}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between">
                    <h2 className="text-lg font-semibold  text-">Total Expense</h2>
                    <p className="text-2xl text-red-400">₹{parseFloat(totalExpense) || 0}</p>
                </div>
            </div>



            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Budget vs Expense</h2>
                <div style={{ width: '500px', height: '300px' }}>
                    <Bar
                        data={barChartData}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            </div>


            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Category-wise Expenses</h2>
                <div style={{ width: '400px', height: '400px' }}>
                    <Pie
                        data={pieChartData}
                        options={{
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            </div>


            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Expense Details</h2>
                <table className="min-w-full bg-white shadow-md rounded ">
                    <thead>
                        <tr className="bg-red-300">
                            <th className="py-2 px-4 text-left">Expense Name</th>
                            <th className="py-2 px-4 text-left">Category</th>
                            <th className="py-2 px-4 text-left">Amount</th>
                            <th className="py-2 px-4 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                <td className="py-2 px-4">{expense.name}</td>
                                <td className="py-2 px-4">{categories[expense.categoryId] || 'Uncategorized'}</td>
                                <td className="py-2 px-4">₹{expense.amount}</td>
                                <td className="py-2 px-4">
                                    {new Date(expense.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;

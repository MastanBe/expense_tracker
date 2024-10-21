import React from 'react';
import { Link } from 'react-router-dom';
import { logoutSuccess } from '../redux/actions/authActions'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        dispatch(logoutSuccess());
        navigate('/') 
    };
    return (
        <nav className="bg-gradient-to-b from-purple-800 to-indigo-600 text-white w-64 min-h-screen p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Navigation</h2>
            <ul className="space-y-4">
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                    <Link to="/dashboard" className="block p-3 rounded hover:text-gray-200">Dashboard</Link>
                </li>
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                    <Link to="/expense" className="block p-3 rounded hover:text-gray-200">Expense</Link>
                </li>
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                    <Link to="/monthlybudget" className="block p-3 rounded hover:text-gray-200">Monthly Budget</Link>
                </li>
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                    <Link to="/category" className="block p-3 rounded hover:text-gray-200">Category</Link>
                </li>
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                    <Link to="/categorybudget" className="block p-3 rounded hover:text-gray-200">Category Budget</Link>
                </li>
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                    <Link to="/report" className="block p-3 rounded hover:text-gray-200">Reports</Link>
                </li>
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                    <Link to="/predict" className="block p-3 rounded hover:text-gray-200">Predict Next year</Link>
                </li>
                <li className="transition duration-200 hover:bg-indigo-700 rounded">
                     <button onClick={handleLogout} className="transition duration-200 pl-2 hover:bg-indigo-700 rounded">Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;

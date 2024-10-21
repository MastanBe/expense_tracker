import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess, loginFail } from '../../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            dispatch(loginSuccess(user, token));
            navigate('/welcome'); 
        } catch (error) {
            console.error('Error during login:', error);
            if (error.response) {
                dispatch(loginFail(error.response.data.error || 'Login failed'));
            } else {
                dispatch(loginFail('Network error or server not reachable'));
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                 <button type="submit" onClick={() => navigate('/recover')} className=" text-red-500 p-2 rounded w-full hover:underline mb-2 text-right">Forgot Password</button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">Login</button>
                <button type="submit" onClick={() => navigate('/signup')} className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 mt-4">Create New Account</button>
            </form>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess, loginFail } from '../../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        securityQuestion: '',
        securityAnswer: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData); 
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                security_question: formData.securityQuestion, 
                security_answer: formData.securityAnswer, 
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            dispatch(loginSuccess(user, token));
            navigate('/welcome'); 

        } catch (error) {
          
            console.error('Error during signup:', error); 
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response data:', error.response.data); 
                dispatch(loginFail(error.response.data.error || 'An error occurred')); 
            } else {
                dispatch(loginFail('Network error or server not reachable'));
            }
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <input
                    type="text"
                    name="securityQuestion"
                    placeholder="Security Question"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <input
                    type="text"
                    name="securityAnswer"
                    placeholder="Security Answer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">Sign Up</button>
                <button type="submit" onClick={() => navigate('/')} className="bg-red-400 text-white p-2 rounded w-full hover:bg-red-600 mt-4">Account Already Exists</button>
            </form>
        </div>
    );
};

export default SignUp;

import React from 'react';
import { logoutSuccess } from '../../redux/actions/authActions'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
const Logout = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        dispatch(logoutSuccess());
        navigate('/') 
    };

    return (
        <div>
            <h2>You are logged out</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;

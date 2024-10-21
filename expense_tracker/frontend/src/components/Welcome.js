import React from 'react';
import Sidebar from './Sidebar'; 
import Dashboard from './Dashboard';

const Welcome = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-semibold mb-4">Welcome to Your Financial Dashboard</h2>
               <Dashboard/>
            </div>
        </div>
    );
};

export default Welcome;

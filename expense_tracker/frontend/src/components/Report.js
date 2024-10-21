import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { useNavigate } from 'react-router-dom';

const getMonthName = (monthNumber) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1]; 
};
const Report = () => {
    console.log("Report component rendered");
    const navigate=useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [yearlyDate, setYearlyDate] = useState(null); 
    const [message, setMessage] = useState('');
    const [monthlyReportData, setMonthlyReportData] = useState(null); 
    const [yearlyReportData, setYearlyReportData] = useState([]); 

    
    const getAuthToken = () => {
        return localStorage.getItem('token'); 
    };
    console.log("Auth Token ", getAuthToken());

    const handleMonthlyReportDownload = async () => {
        if (!selectedDate) {
            setMessage('Please select a month and year for the monthly report.');
            return;
        }
        const month = selectedDate.getMonth() + 1; 
        const year = selectedDate.getFullYear(); 

        try {
            const response = await axios.get(`http://localhost:5000/api/report/monthly-report/csv/${month}/${year}`, {
                responseType: 'blob', 
                headers: {
                    Authorization: `Bearer ${getAuthToken()}` 
                }
            });

           
            const reportResponse = await axios.get(`http://localhost:5000/api/report/monthly-report/${month}/${year}`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}` 
                }
            });

            setMonthlyReportData(reportResponse.data); 

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `monthly_report_${month}_${year}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading monthly report:', error);
            setMessage('Failed to download monthly report.');
        }
    };

    const handleYearlyReportDownload = async () => {
        if (!yearlyDate) {
            setMessage('Please select a year for the yearly report.');
            return;
        }

        const year = yearlyDate.getFullYear(); 

        try {
            const response = await axios.get(`http://localhost:5000/api/report/yearly-report/csv/${year}`, {
                responseType: 'blob', 
                headers: {
                    Authorization: `Bearer ${getAuthToken()}` 
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `yearly_report_${year}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading yearly report:', error);
            setMessage('Failed to download yearly report.');
        }
    };

    const handleViewMonthlyReport = async () => {
        if (!selectedDate) {
            setMessage('Please select a month and year to view the report.');
            return;
        }
        const month = selectedDate.getMonth() + 1; 
        const year = selectedDate.getFullYear(); 

        try {
            const response = await axios.get(`http://localhost:5000/api/report/monthly-report/${month}/${year}`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}` 
                }
            });
            setMonthlyReportData(response.data); 
            console.log("Monthly Report Data: ", response.data);
        } catch (error) {
            console.error('Error fetching monthly report:', error);
            setMessage('Failed to fetch monthly report data.');
        }
    };

    const handleViewYearlyReport = async () => {
        if (!yearlyDate) {
            setMessage('Please select a year to view the yearly report.');
            return;
        }

        const year = yearlyDate.getFullYear(); 

        try {
            const response = await axios.get(`http://localhost:5000/api/report/yearly-report/${year}`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });
            setYearlyReportData(response.data.monthlyReports); 
            console.log("Yearly Report Data: ", response.data.monthlyReports);
        } catch (error) {
            console.error('Error fetching yearly report:', error);
            setMessage('Failed to fetch yearly report data.');
        }
    };

    return (
        <div className="  mx-auto p-6 bg-gradient-to-r from-purple-400 via-pink-300 to-red-300 w-screen  bg-white rounded-lg shadow-lg">
            <button onClick={() => navigate('/welcome')} className="bg-gray-500 w-40 text-white p-2  mb-10 rounded-md">
                    Back
                </button>
            <h1 className="text-3xl font-bold mb-6 text-center">Download Reports</h1>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Monthly Report</h2>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM yyyy" 
                    showMonthYearPicker
                    className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleMonthlyReportDownload}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Download Monthly Report
                </button>
                <button
                    onClick={handleViewMonthlyReport}
                    className="mt-2 w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    View Monthly Report
                </button>
            </div>

           
            <div>
                <h2 className="text-2xl font-semibold mb-4">Yearly Report</h2>
                <DatePicker
                    selected={yearlyDate}
                    onChange={(date) => setYearlyDate(date)}
                    showYearPicker
                    dateFormat="yyyy" 
                    className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleYearlyReportDownload}
                    className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-200"
                >
                    Download Yearly Report
                </button>
                <button
                    onClick={handleViewYearlyReport}
                    className="mt-2 w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    View Yearly Report
                </button>
            </div>

            {message && <p className="text-red-500 mt-4 text-center">{message}</p>}

           
            {monthlyReportData && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4 w-auto">Monthly Report Data</h2>
                    <table className="min-w-full border  border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Month</th>
                                <th className="border border-gray-300 p-2">Year</th>
                                <th className="border border-gray-300 p-2">Total Monthly Budget</th>
                                <th className="border border-gray-300 p-2">Remaining Monthly Budget</th>
                                <th className="border border-gray-300 p-2">Total Expenses</th>
                                <th className="border border-gray-300 p-2">Expense Name</th>
                                <th className="border border-gray-300 p-2">Amount</th>
                                <th className="border border-gray-300 p-2">Date</th>
                                <th className="border border-gray-300 p-2">Category Name</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {monthlyReportData.details.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{getMonthName(monthlyReportData.month)}</td>
                                    <td className="border border-gray-300 p-2">{monthlyReportData.year}</td>
                                    <td className="border border-gray-300 p-2">₹{monthlyReportData.totalMonthlyBudget}</td>
                                    <td className="border border-gray-300 p-2">₹{monthlyReportData.remainingMonthlyBudget}</td>
                                    <td className="border border-gray-300 p-2">₹{monthlyReportData.totalExpenses}</td>
                                    <td className="border border-gray-300 p-2">{item.name}</td>
                                    <td className="border border-gray-300 p-2">₹{item.amount}</td>
                                    <td className="border border-gray-300 p-2">{item.date}</td>
                                    <td className="border border-gray-300 p-2">{item.categoryName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            
            {yearlyReportData.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Yearly Report Data</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Month</th>
                                <th className="border border-gray-300 p-2">Year</th>
                                <th className="border border-gray-300 p-2">Total Monthly Budget</th>
                                <th className="border border-gray-300 p-2">Remaining Monthly Budget</th>
                                <th className="border border-gray-300 p-2">Total Expenses</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {yearlyReportData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{getMonthName(item.month)}</td>
                                    <td className="border border-gray-300 p-2">{item.year}</td>
                                    <td className="border border-gray-300 p-2">₹{item.totalMonthlyBudget}</td>
                                    <td className="border border-gray-300 p-2">₹{item.remainingMonthlyBudget}</td>
                                    <td className="border border-gray-300 p-2">₹{item.totalExpenses}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Report;

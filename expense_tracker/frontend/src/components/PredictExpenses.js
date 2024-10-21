import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getYear } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PredictExpenses = () => {
  const [yearlyDate, setYearlyDate] = useState(null); 
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  const handlePredict = async () => {
    if (!yearlyDate) {
      setError('Please select a year.');
      return;
    }

    try {
      const selectedYear = getYear(yearlyDate); 
      const response = await axios.get('http://localhost:5001/predict_expenses', {
        params: { year: selectedYear },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPredictions(response.data);
      setError(null); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching predictions');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-white">Predict Expenses</h1>
      
      <div className="mb-6">
        <label className="block text-white text-lg font-medium mb-2">Select Year:</label>
        <DatePicker
          selected={yearlyDate}
          onChange={(date) => setYearlyDate(date)}
          showYearPicker
          dateFormat="yyyy"
          placeholderText="Select year"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={handlePredict}
        className="bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4"
      >
        Predict Next Year
      </button>

      <button
        onClick={() => navigate('/welcome')}
        className="bg-gray-200 text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      >
        Back
      </button>

      {error && (
        <div className="mt-4 text-red-200 text-center">
          {error}
        </div>
      )}

      {predictions && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Current Year Expenses</h2>
          {predictions.current_year_expenses && predictions.current_year_expenses.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {predictions.current_year_expenses.map((expense) => (
                  <tr key={expense.category} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{expense.category}</td>
                    <td className="py-2 px-4 border-b">${expense.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white mb-2">No current year expenses data available.</p>
          )}

          <h2 className="text-2xl font-semibold text-white mb-4">Predicted Next Year Expenses</h2>
          {predictions.predicted_expenses && Object.keys(predictions.predicted_expenses).length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Predicted Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(predictions.predicted_expenses).map((category) => (
                  <tr key={category} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{category}</td>
                    <td className="py-2 px-4 border-b">${predictions.predicted_expenses[category]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-white mb-2">No predicted expenses data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictExpenses;

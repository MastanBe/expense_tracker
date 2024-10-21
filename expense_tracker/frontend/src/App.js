
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Logout from './components/Auth/Logout';
import RecoverPassword from './components/Auth/RecoverPassword';
import PrivateRoute from './components/PrivateRoute';
import Welcome from './components/Welcome';
import Category from './components/Category';
import MonthlyBudget from './components/MonthlyBudget';
import CategoryBudget from './components/CategoryBudget';
import Expense from './components/Expense';
import Dashboard from './components/Dashboard';
import Report from './components/Report';
import PredictExpenses from './components/PredictExpenses';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/recover" element={<RecoverPassword />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route
                    path="/category"
                    element={
                        <PrivateRoute>
                            <Category />
                        </PrivateRoute>
                    }
                />
                  <Route
                    path="/monthlybudget"
                    element={
                        <PrivateRoute>
                            <MonthlyBudget/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/categorybudget"
                    element={
                        <PrivateRoute>
                            <CategoryBudget/> 
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/expense"
                    element={
                        <PrivateRoute>
                            <Expense/> 
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard/> 
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/report"
                    element={
                        <PrivateRoute>
                            <Report/>
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/predict"
                    element={
                        <PrivateRoute>
                            <PredictExpenses/>
                        </PrivateRoute>
                    }
                />
            </Routes>
      
        </Router>
    );
};

export default App;

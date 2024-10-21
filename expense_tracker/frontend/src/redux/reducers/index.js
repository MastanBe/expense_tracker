import { combineReducers } from 'redux';
import monthlyBudgetReducer from './monthlyBudgetReducer';
import categoryBudgetReducer from './categoryBudgetReducer';
import categoryReducer from './categoryReducer';
import expenseReducer from './expenseReducer';
import authReducer from './authReducer'; 

const rootReducer = combineReducers({
    auth: authReducer,
    monthlyBudgets:  monthlyBudgetReducer,
    categoryBudgets: categoryBudgetReducer,
    categories: categoryReducer,
    expenses: expenseReducer,
});

export default rootReducer;

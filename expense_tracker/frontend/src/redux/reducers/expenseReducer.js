

import {
    FETCH_EXPENSES_SUCCESS,
    CREATE_EXPENSE_SUCCESS,
    UPDATE_EXPENSE_SUCCESS,
    DELETE_EXPENSE_SUCCESS,
    EXPENSE_ERROR,
} from '../actions/expenseActions';

const initialState = {
    expenses: [],
    error: null,
};

const expenseReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EXPENSES_SUCCESS:
            return {
                ...state,
                expenses: action.payload,
                error: null,
            };
        case CREATE_EXPENSE_SUCCESS:
            return {
                ...state,
                expenses: [...state.expenses, action.payload],
                error: null,
            };
        case UPDATE_EXPENSE_SUCCESS:
            return {
                ...state,
                expenses: state.expenses.map((expense) =>
                    expense.id === action.payload.id ? action.payload : expense
                ),
                error: null,
            };
        case DELETE_EXPENSE_SUCCESS:
            return {
                ...state,
                expenses: state.expenses.filter((expense) => expense.id !== action.payload),
                error: null,
            };
        case EXPENSE_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default expenseReducer;

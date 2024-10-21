import {
    FETCH_CATEGORY_BUDGETS_SUCCESS,
    CREATE_CATEGORY_BUDGET_SUCCESS,
    UPDATE_CATEGORY_BUDGET_SUCCESS,
    DELETE_CATEGORY_BUDGET_SUCCESS,
    CATEGORY_BUDGET_ERROR,
} from '../actions/categoryBudgetActions';

const initialState = {
    categoryBudgets: [],
    error: null,
};

const categoryBudgetReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORY_BUDGETS_SUCCESS:
            return {
                ...state,
                categoryBudgets: action.payload,
            };
        case CREATE_CATEGORY_BUDGET_SUCCESS:
            return {
                ...state,
                categoryBudgets: [...state.categoryBudgets, action.payload],
            };
        case UPDATE_CATEGORY_BUDGET_SUCCESS:
            return {
                ...state,
                categoryBudgets: state.categoryBudgets.map((budget) =>
                    budget.id === action.payload.id ? action.payload : budget
                ),
            };
        case DELETE_CATEGORY_BUDGET_SUCCESS:
            return {
                ...state,
                categoryBudgets: state.categoryBudgets.filter(
                    (budget) => budget.id !== action.payload
                ),
            };
        case CATEGORY_BUDGET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default categoryBudgetReducer;

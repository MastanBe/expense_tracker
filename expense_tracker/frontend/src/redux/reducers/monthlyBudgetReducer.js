import { SET_BUDGETS, ADD_BUDGET, EDIT_BUDGET, DELETE_BUDGET } from '../actions/monthlyBudgetActions';

const initialState = {
    budgets: [],
};

const monthlyBudgetReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BUDGETS:
            return {
                ...state,
                budgets: action.payload,
            };
        case ADD_BUDGET:
            return {
                ...state,
                budgets: [...state.budgets, action.payload],
            };
        case EDIT_BUDGET:
            return {
                ...state,
                budgets: state.budgets.map((budget) =>
                    budget.id === action.payload.id ? action.payload : budget
                ),
            };
        case DELETE_BUDGET:
            return {
                ...state,
                budgets: state.budgets.filter((budget) => budget.id !== action.payload),
            };
        default:
            return state;
    }
};

export default monthlyBudgetReducer;

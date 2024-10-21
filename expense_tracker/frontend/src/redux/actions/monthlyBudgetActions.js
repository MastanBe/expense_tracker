
export const SET_BUDGETS = 'SET_BUDGETS';
export const ADD_BUDGET = 'ADD_BUDGET';
export const EDIT_BUDGET = 'EDIT_BUDGET';
export const DELETE_BUDGET = 'DELETE_BUDGET';


export const setBudgets = (budgets) => ({
    type: SET_BUDGETS,
    payload: budgets,
});


export const addBudget = (budget) => ({
    type: ADD_BUDGET,
    payload: budget,
});


export const editBudget = (budget) => ({
    type: EDIT_BUDGET,
    payload: budget,
});


export const deleteBudget = (id) => ({
    type: DELETE_BUDGET,
    payload: id,
});

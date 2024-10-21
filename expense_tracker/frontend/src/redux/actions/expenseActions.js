
export const FETCH_EXPENSES_SUCCESS = 'FETCH_EXPENSES_SUCCESS';
export const CREATE_EXPENSE_SUCCESS = 'CREATE_EXPENSE_SUCCESS';
export const UPDATE_EXPENSE_SUCCESS = 'UPDATE_EXPENSE_SUCCESS';
export const DELETE_EXPENSE_SUCCESS = 'DELETE_EXPENSE_SUCCESS';
export const EXPENSE_ERROR = 'EXPENSE_ERROR';


export const fetchExpensesSuccess = (expenses) => ({
    type: FETCH_EXPENSES_SUCCESS,
    payload: expenses,
});

export const createExpenseSuccess = (expense) => ({
    type: CREATE_EXPENSE_SUCCESS,
    payload: expense,
});

export const updateExpenseSuccess = (expense) => ({
    type: UPDATE_EXPENSE_SUCCESS,
    payload: expense,
});

export const deleteExpenseSuccess = (id) => ({
    type: DELETE_EXPENSE_SUCCESS,
    payload: id,
});

export const expenseError = (error) => ({
    type: EXPENSE_ERROR,
    payload: error,
});

export const FETCH_CATEGORY_BUDGETS_SUCCESS = 'FETCH_CATEGORY_BUDGETS_SUCCESS';
export const CREATE_CATEGORY_BUDGET_SUCCESS = 'CREATE_CATEGORY_BUDGET_SUCCESS';
export const UPDATE_CATEGORY_BUDGET_SUCCESS = 'UPDATE_CATEGORY_BUDGET_SUCCESS';
export const DELETE_CATEGORY_BUDGET_SUCCESS = 'DELETE_CATEGORY_BUDGET_SUCCESS';
export const CATEGORY_BUDGET_ERROR = 'CATEGORY_BUDGET_ERROR';


export const fetchCategoryBudgetsSuccess = (data) => ({
    type: FETCH_CATEGORY_BUDGETS_SUCCESS,
    payload:data,
});

export const createCategoryBudgetSuccess = (categoryBudget) => ({
    type: CREATE_CATEGORY_BUDGET_SUCCESS,
    payload: categoryBudget,
});

export const updateCategoryBudgetSuccess = (categoryBudget) => ({
    type: UPDATE_CATEGORY_BUDGET_SUCCESS,
    payload: categoryBudget,
});

export const deleteCategoryBudgetSuccess = (id) => ({
    type: DELETE_CATEGORY_BUDGET_SUCCESS,
    payload: id,
});

export const categoryBudgetError = (error) => ({
    type: CATEGORY_BUDGET_ERROR,
    payload: error,
});

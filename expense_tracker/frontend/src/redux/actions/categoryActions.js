export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export const fetchCategories = (categories) => ({
    type: FETCH_CATEGORIES,
    payload: categories,
});

export const addCategory = (category) => ({
    type: ADD_CATEGORY,
    payload: category,
});

export const updateCategory = (category) => ({
    type: UPDATE_CATEGORY,
    payload: category,
});

export const deleteCategory = (id) => ({
    type: DELETE_CATEGORY,
    payload: id,
});

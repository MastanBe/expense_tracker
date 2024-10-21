

import { LOGIN_SUCCESS, LOGOUT_SUCCESS, AUTH_ERROR, LOGIN_FAIL } from '../actions/authActions';

const initialState = {
    isAuthenticated: false,
    token: null,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload,
                error: null,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                error: null,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL: 
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;

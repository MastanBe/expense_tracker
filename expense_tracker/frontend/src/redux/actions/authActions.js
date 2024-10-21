
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL'; 


export const authError = (error) => ({
    type: AUTH_ERROR,
    payload: error,
});

export const loginSuccess = (token) => ({
    type: LOGIN_SUCCESS,
    payload: token,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
});

export const loginFail = (error) => ({
    type: LOGIN_FAIL,
    payload: error,
});

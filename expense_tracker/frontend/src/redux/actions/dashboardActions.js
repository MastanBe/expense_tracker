
export const FETCH_DASHBOARD_DATA_SUCCESS = 'FETCH_DASHBOARD_DATA_SUCCESS';
export const DASHBOARD_ERROR = 'DASHBOARD_ERROR';


export const fetchDashboardDataSuccess = (data) => ({
    type: FETCH_DASHBOARD_DATA_SUCCESS,
    payload: data,
});

export const dashboardError = (error) => ({
    type: DASHBOARD_ERROR,
    payload: error,
});

import { createSlice } from '@reduxjs/toolkit';

const getStoredValue = (key) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const safeParseUser = (value) => {
    if (!value) return null;
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        // Corrupted persisted user data can crash app bootstrap if unguarded.
        try {
            localStorage.removeItem('smartprep_user');
            localStorage.removeItem('smartprep_token');
        } catch {
            // Ignore storage access errors.
        }
        return null;
    }
};

const token = getStoredValue('smartprep_token');
const user = getStoredValue('smartprep_user');

const initialState = {
    user: safeParseUser(user),
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            localStorage.setItem('smartprep_token', action.payload.token);
            localStorage.setItem('smartprep_user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('smartprep_token');
            localStorage.removeItem('smartprep_user');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('smartprep_user', JSON.stringify(state.user));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;

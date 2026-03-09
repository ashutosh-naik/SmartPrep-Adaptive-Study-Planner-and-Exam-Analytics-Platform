import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboard: null,
    performance: null,
    readiness: null,
    loading: false,
    error: null,
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setLoading: (state, action) => { state.loading = action.payload; },
        setDashboard: (state, action) => { state.dashboard = action.payload; state.loading = false; },
        setPerformance: (state, action) => { state.performance = action.payload; state.loading = false; },
        setReadiness: (state, action) => { state.readiness = action.payload; state.loading = false; },
        setError: (state, action) => { state.error = action.payload; state.loading = false; },
    },
});

export const { setLoading, setDashboard, setPerformance, setReadiness, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;

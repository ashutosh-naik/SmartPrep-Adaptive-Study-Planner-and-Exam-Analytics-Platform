import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    weeklyPlan: [],
    todaysTasks: [],
    backlog: [],
    loading: false,
    error: null,
};

const plannerSlice = createSlice({
    name: 'planner',
    initialState,
    reducers: {
        setLoading: (state, action) => { state.loading = action.payload; },
        setWeeklyPlan: (state, action) => { state.weeklyPlan = action.payload; state.loading = false; },
        setTodaysTasks: (state, action) => { state.todaysTasks = action.payload; state.loading = false; },
        setBacklog: (state, action) => { state.backlog = action.payload; state.loading = false; },
        setError: (state, action) => { state.error = action.payload; state.loading = false; },
        updateTaskStatus: (state, action) => {
            const { id, status } = action.payload;
            state.todaysTasks = state.todaysTasks.map(t => t.id === id ? { ...t, status } : t);
            state.weeklyPlan = state.weeklyPlan.map(day => ({
                ...day,
                tasks: day.tasks?.map(t => t.id === id ? { ...t, status } : t) || []
            }));
        },
    },
});

export const { setLoading, setWeeklyPlan, setTodaysTasks, setBacklog, setError, updateTaskStatus } = plannerSlice.actions;
export default plannerSlice.reducer;

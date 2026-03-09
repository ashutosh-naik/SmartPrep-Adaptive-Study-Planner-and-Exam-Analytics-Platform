import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tests: [],
    currentTest: null,
    result: null,
    loading: false,
    error: null,
};

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        setLoading: (state, action) => { state.loading = action.payload; },
        setTests: (state, action) => { state.tests = action.payload; state.loading = false; },
        setCurrentTest: (state, action) => { state.currentTest = action.payload; state.loading = false; },
        setResult: (state, action) => { state.result = action.payload; state.loading = false; },
        clearCurrentTest: (state) => { state.currentTest = null; state.result = null; },
        setError: (state, action) => { state.error = action.payload; state.loading = false; },
    },
});

export const { setLoading, setTests, setCurrentTest, setResult, clearCurrentTest, setError } = testSlice.actions;
export default testSlice.reducer;

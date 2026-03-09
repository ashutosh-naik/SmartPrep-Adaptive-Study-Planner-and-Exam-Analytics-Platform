import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import plannerReducer from './plannerSlice';
import testReducer from './testSlice';
import analyticsReducer from './analyticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        planner: plannerReducer,
        test: testReducer,
        analytics: analyticsReducer,
    },
});

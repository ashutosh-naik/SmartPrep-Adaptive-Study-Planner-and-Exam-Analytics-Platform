import axiosInstance from './axiosInstance';

export const analyticsService = {
    getDashboard: async () => {
        const response = await axiosInstance.get('/analytics/dashboard');
        return response.data;
    },

    getPerformance: async () => {
        const response = await axiosInstance.get('/analytics/performance');
        return response.data;
    },

    getReadiness: async () => {
        const response = await axiosInstance.get('/analytics/readiness');
        return response.data;
    },

    getUserProfile: async () => {
        const response = await axiosInstance.get('/user/profile');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await axiosInstance.put('/user/profile', data);
        return response.data;
    },
};

import axiosInstance from './axiosInstance';

export const plannerService = {
    generatePlan: async (data) => {
        const response = await axiosInstance.post('/planner/generate', data);
        return response.data;
    },

    getWeeklyPlan: async (weekStart) => {
        const response = await axiosInstance.get(`/planner/weekly?week=${weekStart}`);
        return response.data;
    },

    getDailyPlan: async (date) => {
        const response = await axiosInstance.get(`/planner/daily?date=${date}`);
        return response.data;
    },

    getBacklog: async () => {
        const response = await axiosInstance.get('/planner/backlog');
        return response.data;
    },

    redistribute: async () => {
        const response = await axiosInstance.post('/planner/redistribute');
        return response.data;
    },
};

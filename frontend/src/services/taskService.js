import axiosInstance from './axiosInstance';

export const taskService = {
    getTasks: async (filter = 'all') => {
        const response = await axiosInstance.get(`/tasks?filter=${filter}`);
        return response.data;
    },

    completeTask: async (id) => {
        const response = await axiosInstance.put(`/tasks/${id}/complete`);
        return response.data;
    },

    skipTask: async (id) => {
        const response = await axiosInstance.put(`/tasks/${id}/skip`);
        return response.data;
    },

    getTaskSummary: async () => {
        const response = await axiosInstance.get('/tasks/summary');
        return response.data;
    },
};

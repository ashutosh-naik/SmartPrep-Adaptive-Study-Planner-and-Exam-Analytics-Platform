import axiosInstance from './axiosInstance';

export const testService = {
    getAllTests: async () => {
        const response = await axiosInstance.get('/tests');
        return response.data;
    },

    getTest: async (id) => {
        const response = await axiosInstance.get(`/tests/${id}`);
        return response.data;
    },

    submitTest: async (id, data) => {
        const response = await axiosInstance.post(`/tests/${id}/submit`, data);
        return response.data;
    },

    getTestResult: async (id) => {
        const response = await axiosInstance.get(`/tests/${id}/result`);
        return response.data;
    },

    getTestSummary: async () => {
        const response = await axiosInstance.get('/tests/summary');
        return response.data;
    },
};

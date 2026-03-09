import axiosInstance from "./axiosInstance";

export const authService = {
  register: async (data) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  login: async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },

  googleLogin: async (token) => {
    const response = await axiosInstance.post("/auth/google", { token });
    return response.data;
  },
};

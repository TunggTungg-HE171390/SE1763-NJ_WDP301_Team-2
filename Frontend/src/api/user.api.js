import apiClient from "./apiClient";

export const registerUser = async (userData) => {
    return apiClient.post("/auth/register", userData);
};

export const loginUser = async (credentials) => {
    return apiClient.post("/auth/login", credentials);
};

export const verifyOTP = async (credentials) => {
    return apiClient.post("/auth/verify-otp", credentials);
};

export const resendOTP = async (credentials) => {
    return apiClient.post("/auth/resend-otp", credentials);
};

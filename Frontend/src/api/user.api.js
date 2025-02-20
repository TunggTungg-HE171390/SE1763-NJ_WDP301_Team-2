import apiClient from "./apiClient";

export const registerUser = async (userData) => {
    return await apiClient.post("/auth/register", userData);
};

export const loginUser = async (credentials) => {
    return await apiClient.post("/auth/login", credentials);
};

export const verifyOTP = async (credentials) => {
    return await apiClient.post("/auth/verify-otp", credentials);
};

export const resendOTP = async (credentials) => {
    return await apiClient.post("/auth/resend-otp", credentials);
};

export const botResponse = async (credentials) => {
    return await apiClient.post("/auth/chat-bot", credentials);
};

export const sendEmail = async (credentials) => {
    return await apiClient.post("/auth/send-email", credentials);
};

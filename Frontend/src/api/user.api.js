import apiClient from "./apiClient";

export const registerUser = async (userData) => {
  return await apiClient.post("/auth/register", userData);
};

export const loginUser = async (credentials) => {
  return await apiClient.post("/auth/login", credentials);
};

export const forgotPassword = async ({ contact }) => {
  return await apiClient.post("/auth/forgot-password", { contact }); 
};

export const resetPassword = async ({ contact, otp, newPassword }) => {
  return await apiClient.post("/auth/reset-password", { contact, otp, newPassword }); 
};

export const changePassword = async ({ contact, newPassword }) => {
  return await apiClient.post("/auth/change-password", { contact, newPassword });
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

export const subscribeEmail = async (credentials) => {
    return await apiClient.post("/auth/subscribe-news", credentials);
};

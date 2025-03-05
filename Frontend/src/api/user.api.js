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

export const botResponse = async (credentials) => {
    return apiClient.post("/auth/chat-bot", credentials);
};

export const sendEmail = async (credentials) => {
    return apiClient.post("/auth/send-email", credentials);
};

export const psychologistList = async () => {
    try {
        const response = await apiClient.get("/auth/psychologists");
        return response.data;
    } catch (error) {
        console.error("Error submitting:", error);
        throw error;
    }
};



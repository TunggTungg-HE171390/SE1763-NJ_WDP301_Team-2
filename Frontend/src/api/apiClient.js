import axios from "axios";

const PORT = import.meta.env.VITE_PORT;

// Centralized Base URL
//const API_BASE_URL = `http://localhost:${PORT}/api`; // Change here to update for all APIs
const API_BASE_URL = `https://tamgiao-be.onrender.com/api`;

// Create Axios Instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("API Client Error:", error);
        return Promise.reject(error);
    }
);

// Export API Client
export default apiClient;

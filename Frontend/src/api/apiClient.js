import axios from "axios";

// Centralized Base URL
const API_BASE_URL = "http://localhost:3000/api"; // Change here to update for all APIs

// Create Axios Instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Export API Client
export default apiClient;

import axios from "axios";

const PORT = import.meta.env.VITE_PORT;

// Centralized Base URL
const API_BASE_URL = `http://localhost:${PORT}/api`; // Change here to update for all APIs
// const API_BASE_URL = `https://tamgiao-be.onrender.com/api`;

// Create an instance of axios with a custom config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        // Make sure we're not adding double /api prefixes
        if (config.url.startsWith('/api/')) {
            console.warn(`URL already contains /api/ prefix: ${config.url}`);
            // Fix by removing the prefix
            config.url = config.url.replace('/api/', '/');
        }

        console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);

        // For GET requests, add cache busting to prevent 304
        if (config.method === "get") {
            const cacheBuster = `_t=${new Date().getTime()}`;
            config.url += (config.url.includes("?") ? "&" : "?") + cacheBuster;
        }

        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
    (response) => {
        console.log(`API Response Status: ${response.status} for ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error("API Response Error:", error);
            console.error("Error Response Data:", error.response.data);
            console.error("Error Response Status:", error.response.status);

            // Special handling for specific status codes
            if (error.response.status === 304) {
                console.log("Server returned 304 Not Modified - Using cached data");
                // Return the original cached response as success
                return Promise.resolve(error.response);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error("No response received:", error.request);
        } else {
            // Something happened in setting up the request
            console.error("Request error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;

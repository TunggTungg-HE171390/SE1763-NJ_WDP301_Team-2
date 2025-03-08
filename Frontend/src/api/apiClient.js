import axios from "axios";

// Create an instance of axios with a custom config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
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
    console.error("API Response Error:", error);
    console.error("Error Response Data:", error.response?.data);
    console.error("Error Response Status:", error.response?.status);
    return Promise.reject(error);
  }
);

export default apiClient;

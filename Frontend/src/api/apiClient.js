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
    
    // For GET requests, add cache busting to prevent 304
    if (config.method === 'get') {
      const cacheBuster = `_t=${new Date().getTime()}`;
      config.url += (config.url.includes('?') ? '&' : '?') + cacheBuster;
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

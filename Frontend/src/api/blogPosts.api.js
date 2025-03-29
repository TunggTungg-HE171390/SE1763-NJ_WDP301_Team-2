import apiClient from "./apiClient";

const API_BASE_URL = "/blogposts"; // Base API path

// Tạo một bài viết mới
export const createBlogPost = async (postData) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/create`, postData);
        return response.data; // Trả về dữ liệu JSON từ server
    } catch (error) {
        console.error("Error creating post:", error);
        console.log("Request was sent to:", `${API_BASE_URL}/create`);
        throw error.response ? error.response.data : error;
    }
};

// Get all blog posts
export const getAllPosts = async () => {
    try {
        console.log("Getting all posts...");
        console.log("API URL being used:", `${apiClient.defaults.baseURL}${API_BASE_URL}`);

        // Add timeout to detect network issues
        const response = await apiClient.get(API_BASE_URL, { timeout: 10000 });

        console.log("API Response status:", response.status);
        console.log("API Response headers:", response.headers);
        console.log("API Response data:", response.data);

        if (!response.data) {
            throw new Error("Empty response received from server");
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching all posts:", error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Response error data:", error.response.data);
            console.error("Response error status:", error.response.status);
            console.error("Response error headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received. Request details:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", error.message);
        }

        // Try to provide some context for the error
        console.log("Request was sent to:", `${apiClient.defaults.baseURL}${API_BASE_URL}`);
        console.log("Current environment:", import.meta.env.MODE);

        throw error;
    }
};

// Lấy bài viết theo ID
export const getBlogPostById = async (postId) => {
    try {
        const response = await apiClient.get(`${API_BASE_URL}/${postId}`);
        return response.data; // Trả về dữ liệu bài viết
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        throw error.response ? error.response.data : error;
    }
};

// Cập nhật bài viết
export const updateBlogPost = async (postId, postData) => {
    try {
        const response = await apiClient.put(`${API_BASE_URL}/${postId}`, postData);
        return response.data; // Trả về dữ liệu bài viết đã cập nhật
    } catch (error) {
        console.error("Error updating post:", error);
        throw error.response ? error.response.data : error;
    }
};

export const getAllBlogPosts = async (credentials) => {
    return await apiClient.get("/blogposts/allblogs", credentials);
};

export const getBlogPostDetailById = async (id) => {
    return await apiClient.get(`/blogposts/blogdetail/${id}`);
};

export const addBlogComment = async (id, credentials) => {
    return await apiClient.post(`/blogposts/blog/${id}/comment`, credentials);
};

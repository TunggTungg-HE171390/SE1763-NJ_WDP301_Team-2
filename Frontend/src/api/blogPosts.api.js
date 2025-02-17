import apiClient from "./apiClient";

const API_BASE_URL = "/blogposts"; // Định nghĩa API gốc

// Tạo một bài viết mới
export const createBlogPost = async (postData) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/create`, postData);

        return response.data; // Trả về dữ liệu JSON từ server
    } catch (error) {
        console.error("Error creating post:", error);
        throw error.response ? error.response.data : error;
    }
};


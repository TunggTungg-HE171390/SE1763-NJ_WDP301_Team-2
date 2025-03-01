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

// Lấy tất cả bài viết
export const getAllPosts = async () => {
  try {
    const response = await apiClient.get(API_BASE_URL);
    return response.data; // Trả về danh sách bài viết
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error.response ? error.response.data : error;
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


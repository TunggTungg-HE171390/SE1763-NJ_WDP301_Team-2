import apiClient from "./apiClient";

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/category/getCategories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getTestByCateId = async (categoryId) => {
  try {
    const response = await apiClient.get(`/category/getTest/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

export const getCateNameByCateId = async (categoryId) => {
  try {
    const response = await apiClient.get(`/category/getName/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};


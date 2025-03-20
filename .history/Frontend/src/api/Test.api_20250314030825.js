import apiClient from "./apiClient";

export const creatTest = async (categoryId, title, description, testOutcomes) => {
  try {
    const response = await apiClient.post(`/test/create/${categoryId}`, { title, description, testOutcomes }); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};

export const deleteTestdeleteTest = async (categoryId, title, description, testOutcomes) => {
  try {
    const response = await apiClient.post(`/test/create/${categoryId}`, { title, description, testOutcomes }); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};


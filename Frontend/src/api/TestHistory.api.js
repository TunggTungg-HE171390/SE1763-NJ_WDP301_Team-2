import apiClient from "./apiClient";

export const submitTest = async (userId, testId, answers) => {
  try {
    const response = await apiClient.post(`/test-history/submit/${userId}/${testId}`, { answers }); // Changed to POST and added data
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};
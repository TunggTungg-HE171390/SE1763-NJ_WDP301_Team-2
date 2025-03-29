import apiClient from "./apiClient";

export const submitTest = async (userId, testId, answers, userInfo) => {
  try {
    const response = await apiClient.post(`/test-history/submit/${userId}/${testId}`, { answers, userInfo }); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};

export const getTestOutcomeDistribution = async (req, res) => {
  try {
    const response = await apiClient.get(`/test-history/outcome-distribution`); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};
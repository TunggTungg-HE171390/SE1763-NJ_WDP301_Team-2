import apiClient from "./apiClient";

export const submitTest = async (userId, testId, answers, userEmail) => {
  try {
    const response = await apiClient.post(`/test-history/submit/67a0374b7ad0db88c8b251c0/${testId}`, { answers, userEmail }); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};
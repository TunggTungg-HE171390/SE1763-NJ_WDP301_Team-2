import apiClient from "./apiClient";

export const submitTest = async (userId, testId, answers, userInfo) => {
  try {
    const response = await apiClient.post(`/test-history/submit/67a0374b7ad0db88c8b251c0/${testId}`, { answers, userInfo }); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};

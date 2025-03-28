import apiClient from "./apiClient";

export const submitTest = async (userId, testId, answers, userInfo) => {
  try {
    const response = await apiClient.post(`/test-history/submit/67c732358b25ae48db7559a4/${testId}`, {
        answers,
        userInfo,
    }); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};

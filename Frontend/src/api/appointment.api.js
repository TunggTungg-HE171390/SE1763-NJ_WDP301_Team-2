import apiClient from "./apiClient";

export const schedulePsychologistId = async (psychologistId) => {
  try {
    const response = await apiClient.get(`/appointment/${psychologistId}`); 
    return response.data; 
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error; 
  }
};

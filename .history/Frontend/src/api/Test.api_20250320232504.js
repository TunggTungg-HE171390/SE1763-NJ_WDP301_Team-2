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

export const deleteTest = async (testId) => {
  try {
    const response = await apiClient.delete(`/test/delete/${testId}`);
    return response.data;
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error;
  }
};

export const getTestById = async (testId) => {
  try {
    const response = await apiClient.get(`/test/${testId}`);
    return response.data;
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error;
  }
};

export const updateTest = async (testId, title) => {
  try {
    console.log("title API call typetype", typeof title);
    console.log("title API call", title);

    const response = await apiClient.put(`/test/edit/${testId}`, 
      {title,}
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error;
  }
};






import apiClient from "./apiClient";

export const getQuestionByTestId = async (testId) => {
    try {
        const response = await apiClient.get(`question/questions-on-test/${testId}`);
        return response;
    } catch (error) {
        console.error("Error fetching question:", error);
        throw error;
    }
};



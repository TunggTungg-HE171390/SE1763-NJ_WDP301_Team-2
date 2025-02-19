import apiClient from "./apiClient";

export const submitTest = async (userId, testId, answers, userEmail) => {
    try {
        const response = await apiClient.post(`/test-history/submit/67b5c578591386158323089f/${testId}`, {
            answers,
            userEmail,
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting test:", error);
        throw error;
    }
};

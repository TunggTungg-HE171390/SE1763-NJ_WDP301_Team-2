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

// export const checkIfTestHasQuestions = async (testId) => {
//     try {
//         const response = await apiClient.get(`question/check/${testId}`);
//         console.log("API Response:", response);  // Log kết quả trả về

//         return response.data.hasQuestions;;
//     } catch (error) {
//         console.error("Error fetching question:", error);
//         throw error;
//     }
// };

export const insertQuestionOnTest = async (testId, questions) => {
    try {
        const response = await apiClient.post(`question/insert-questions/${testId}`, { questions });
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error inserting questions:", error);
        throw error;
    }
};

export const getCountQuestionOnTheTest = async (testId) => {
    try {
        const response = await apiClient.post(`question/count/${testId}`);
        console.log("API Response:", questions);
        return response.data;
    } catch (error) {
        console.error("Error fetching question:", error);
        throw error;
    }
}; 

export const updateQuestion = async (questionId, { content, answers }) => {
    try {
        const response = await apiClient.put(`question/edit/${questionId}`, {
            questionContent: content,
            newAnswers: answers
        });
        return response.data;
    } catch (error) {
        console.error("Error updating question:", error);
        throw error;
    }
};

export const deleteQuestion = async (questionId) => {
    try {
        const response = await apiClient.delete(`question/delete/${questionId}`);
        console.log("API Response questionId:", questionId);
        return response.data;
    } catch (error) {
        console.error("Error deleting question:", error);
        throw error;
    }
};








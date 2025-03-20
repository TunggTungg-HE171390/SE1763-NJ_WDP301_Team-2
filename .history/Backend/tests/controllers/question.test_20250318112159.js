import request from "supertest";
import app from "../../src/app.js"; // Import app.js để chạy server

describe("Question API", () => {
    let userId;
    let testId;

    beforeAll(async () => {
        // Tạo userId giả định hoặc giả lập một người dùng nếu cần
        userId = "60f5e515b2fa4f89b6b283f0"; // Thay đổi theo ID hợp lệ trong database của bạn
        testId = "67a07b1ab3982b814ffff266"; // ID test mà bạn muốn thử nghiệm
    });

    test("should create a new question with contentQuestion and 1-6 answerQuestion", async () => {
        const questions = [
            {
                content: "What is the capital of France?",
                answers: [
                    { content: "Paris", point: 1 },
                    { content: "Berlin", point: 0 },
                    { content: "London", point: 0 }
                ]
            },
            {
                content: "Which of these is the largest planet in our solar system?",
                answers: [
                    { content: "Jupiter", point: 1 },
                    { content: "Saturn", point: 0 },
                    { content: "Earth", point: 0 }
                ]
            }
        ];
        
        const response = await request(app)
            .post(`/api/question/insert-questions/${testId}`)
            .send({ questions })
            .timeout(100000000)
            .expect(201); // Kiểm tra xem mã trạng thái là 201 (Created)

        // Kiểm tra phản hồi
        expect(response.body).toHaveProperty("message", "Questions created successfully");
        expect(response.body).toHaveProperty("questions");
        expect(response.body.questions).toHaveLength(2); // Kiểm tra có 2 câu hỏi được tạo

        // Kiểm tra các thuộc tính của câu hỏi
        const firstQuestion = response.body.questions[0];
        expect(firstQuestion).toHaveProperty("content", "What is the capital of France?");
        expect(firstQuestion.answers).toHaveLength(3); // Kiểm tra có 3 câu trả lời

        const firstAnswer = firstQuestion.answers[0];
        expect(firstAnswer).toHaveProperty("content", "Paris");
        expect(firstAnswer).toHaveProperty("point", 1);
    });
});

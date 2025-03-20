import request from "supertest";
import app from  "../../src/app.js"; // Import app.js để chạy server

describe("Question API", () => {
    let userId;

    beforeAll(async () => {
        // Tạo userId giả định hoặc giả lập một người dùng nếu cần
        // Ví dụ, bạn có thể tạo một người dùng trong MongoDB và lấy ID
        userId = "60f5e515b2fa4f89b6b283f0"; // Thay đổi theo ID hợp lệ trong database của bạn
        testId = "67a07b1ab3982b814ffff266";
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
            .send({
                questions: questions
            })
            .timeout(10000)
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

    test("should return 400 if title is missing", async () => {
        const response = await request(app)
            .post("/api/blogposts/create")
            .send({
                userId,
                content: "This is a test content for the blog post."
            })
            .expect(400); // Kiểm tra xem mã trạng thái là 400 (Bad Request)

        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Title is required",
                    param: "title"
                }),
                expect.objectContaining({
                    msg: "Title must be a string",  
                    param: "title"
                })
            ])
        );
    });

    test("should return 400 if userId is invalid", async () => {
        const response = await request(app)
            .post("/api/blogposts/create")
            .send({
                title: "Test Blog Post",
                userId: "invalid-user-id", // ID không hợp lệ
                content: "This is a test content for the blog post."
            })
            .expect(400);

        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "UserId must be a valid MongoDB ObjectId",
                    param: "userId"
                })
            ])
        );
    });

    test("should return 400 if content is missing", async () => {
        const response = await request(app)
            .post("/api/blogposts/create")
            .send({
                title: "Test Blog Post",
                userId,
                status: "Published"
            })
            .expect(400);

        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Content is required",
                    param: "content"
                })
            ])
        );
    });

    test("should return 400 if status is invalid", async () => {
        const response = await request(app)
            .post("/api/blogposts/create")
            .send({
                title: "Test Blog Post",
                userId,
                content: "This is a test content for the blog post.",
                status: "InvalidStatus" // Trạng thái không hợp lệ
            })
            .expect(400);

        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: "Status must be either 'Draft' or 'Published'",
                    param: "status"
                })
            ])
        );
    });
}
);

describe("BlogPost API", () => {
    let postId;

    beforeAll(async () => {
        // Tạo một bài viết mới để lấy ID cho việc test GET và PUT
        const response = await request(app)
            .post("/api/blogposts/create")
            .send({
                title: "Test Blog Post",
                userId: "60f5e515b2fa4f89b6b283f0",  // Thay đổi với ID hợp lệ
                content: "Test content",
                status: "Draft"
            });
        postId = response.body._id;  // Lưu ID để dùng cho các test sau
    });

    test("should return 200 and a list of blog posts for GET /api/blogposts", async () => {
        const response = await request(app).get("/api/blogposts");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);  // Kiểm tra trả về là một mảng
    });

    test("should return 200 and a single blog post for GET /api/blogposts/:id", async () => {
        const response = await request(app).get(`/api/blogposts/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("title", "Test Blog Post");
    });

    test("should return 200 and updated blog post for PUT /api/blogposts/:id", async () => {
        const response = await request(app)
            .put(`/api/blogposts/${postId}`)
            .send({ title: "Updated Title", content: "Updated content" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("title", "Updated Title");
    });
});

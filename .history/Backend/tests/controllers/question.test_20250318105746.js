import request from "supertest";
import app from  "../../src/app.js"; // Import app.js để chạy server

describe("BlogPost API", () => {
    let userId;

    beforeAll(async () => {
        // Tạo userId giả định hoặc giả lập một người dùng nếu cần
        // Ví dụ, bạn có thể tạo một người dùng trong MongoDB và lấy ID
        userId = "60f5e515b2fa4f89b6b283f0"; // Thay đổi theo ID hợp lệ trong database của bạn
    });

    test("should create a new blog post with valid data", async () => {
        const response = await request(app)
            .post("/api/blogposts/create")
            .send({
                title: "Test Blog Post",
                userId,
                image: "https://example.com/test-image.jpg",
                content: "This is a test content for the blog post.",
                status: "Published"
            })
            .timeout(10000)
            .expect(201); // Kiểm tra xem mã trạng thái là 201 (Created)

        expect(response.body).toHaveProperty("title", "Test Blog Post");
        expect(response.body).toHaveProperty("userId", userId);
        expect(response.body).toHaveProperty("content", "This is a test content for the blog post.");
        expect(response.body).toHaveProperty("status", "Published");
    });
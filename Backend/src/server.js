import dotenv from "dotenv";
import app from "./app.js";
import instanceMongoDb from "./api/database/connect.mongodb.js";
import AvailabilityController from "./api/controllers/availability.controller.js";
import UserController from "./api/controllers/user.controller.js";
// import cors from "cors"; // Thay require bằng import

// Tải biến môi trường từ .env file
dotenv.config();

const PORT = process.env.PORT || 3000; // Đặt giá trị mặc định nếu PORT không tồn tại
const HOSTNAME = "localhost"; 

// app.use(cors()); // Kích hoạt CORS

// Ensure MongoDB is connected before starting the server
const startServer = async () => {
    try {
        await instanceMongoDb; // Đợi kết nối MongoDB trước khi tiếp tục
        console.log(" Connected to MongoDB");

        app.listen(PORT, HOSTNAME, () => {
            console.log(`🚀 Server running at: http://${HOSTNAME}:${PORT}`);
        });

        // Gọi hàm tạo user hợp lệ (nếu có)
        try {
        } catch (error) {
            console.error(" Failed to create valid user:", error);
        }
    } catch (error) {
        console.error(" Error connecting to MongoDB:", error);
        process.exit(1); // Dừng chương trình nếu kết nối thất bại
    }
};

// Start the server
startServer();

import dotenv from "dotenv";
import app from "./app.js";
import os from "os";
import instanceMongoDb from "./api/database/connect.mongodb.js";
import AvailabilityController from "./api/controllers/availability.controller.js";
<<<<<<< HEAD
import {UserController} from "./api/controllers/index.js";
=======
import UserController from "./api/controllers/user.controller.js";
>>>>>>> main

// Tải biến môi trường từ .env file
dotenv.config();

const PORT = process.env.PORT;
const HOSTNAME = "localhost"; // Sử dụng "localhost"

// Ensure MongoDB is connected before starting the server
const startServer = async () => {
    await instanceMongoDb; // Wait for MongoDB connection

    app.listen(PORT, HOSTNAME, () => {
        console.log(`🚀 Server running at: http://${HOSTNAME}:${PORT}`);
    });

    try {
<<<<<<< HEAD
        await AvailabilityController.createPsychologistAvailability();
        // await UserController.findAllUsers();
=======
        // await UserController.createValidUser();
>>>>>>> main
    } catch (error) {
        console.error("Failed to create psychologist availability:", error);
    }
};

// Start the server
startServer();

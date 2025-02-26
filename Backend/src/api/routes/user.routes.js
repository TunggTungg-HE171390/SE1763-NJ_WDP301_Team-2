import express from "express";
import UserController from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", UserController.registerUser);
userRouter.post("/login", UserController.loginUser);
userRouter.post("/verify-otp", UserController.verifyOTP);
userRouter.post("/resend-otp", UserController.resendOTP);
userRouter.post("/chat-bot", UserController.chatWithAI);
userRouter.post("/send-email", UserController.sendEmail);

export default userRouter;

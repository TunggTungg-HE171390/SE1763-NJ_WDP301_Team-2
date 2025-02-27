import express from "express";
import blogPostController from "../controllers/blogPost.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
// import { BlogDetailController } from "../controllers/index.js";

const router = express.Router();

// Route POST để tạo bài viết mới
router.post("/create", authenticateUser, blogPostController.createBlogPost);

// Route PUT để cập nhật bài viết
router.put("/update/:id", authenticateUser, blogPostController.updateBlogPost);

// Route GET để lấy tất cả bài viết
router.get("/", blogPostController.getAllBlogPosts);

export default router;

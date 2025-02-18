import express from "express";
import blogPostController from "../controllers/blogPost.controller.js";

const router = express.Router();

// Route POST để tạo bài viết mới
router.post("/create", blogPostController.createBlogPost);

// Route PUT để cập nhật bài viết
router.put("/update/:id", blogPostController.updateBlogPost);

// Route GET để lấy tất cả bài viết
router.get("/", blogPostController.getAllBlogPosts);

export default router;

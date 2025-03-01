import express from "express";
import blogPostController from "../controllers/blogPost.controller.js";

const router = express.Router();

// Route POST để tạo bài viết mới
router.post("/create", blogPostController.createBlogPost);

// Route PUT để cập nhật bài viết
router.put("/:id", blogPostController.updateBlogPost);

// Route GET để lấy bài viết theo ID
router.get("/:id", blogPostController.getBlogPostById);

// Route GET để lấy tất cả bài viết
router.get("/", blogPostController.getAllBlogPosts);

export default router;

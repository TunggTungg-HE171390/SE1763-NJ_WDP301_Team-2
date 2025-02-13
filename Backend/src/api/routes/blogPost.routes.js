import express from "express";
import { createBlogPost, updateBlogPost } from "../controllers/blogPost.controller.js";

const router = express.Router();

// Route POST để tạo một blog post mới
router.post("/create", createBlogPost);

// Route PUT để cập nhật một blog post
router.put("/:id", updateBlogPost);

export default router;

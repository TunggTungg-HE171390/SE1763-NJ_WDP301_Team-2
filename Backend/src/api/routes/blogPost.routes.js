import express from "express";
import blogPostController from "../controllers/blogPost.controller.js";

const router = express.Router();

router.get("/allblogs", blogPostController.getAllBlog);

router.get("/blogdetail/:id", blogPostController.getBlogDetail);

router.get("/blog/:postId/comments", blogPostController.getComments);

// Thêm bình luận vào bài viết
router.post("/blog/:postId/comment", blogPostController.addComment);

// Cập nhật bình luận trong bài viết
router.put("/posts/:postId/comments/:userId", blogPostController.updateComment);

// Xóa bình luận trong bài viết
router.delete("/posts/:postId/comments/:userId", blogPostController.deleteComment)
// Route POST để tạo bài viết mới
router.post("/create", blogPostController.createBlogPost);

// Route PUT để cập nhật bài viết
router.put("/:id", blogPostController.updateBlogPost);

// Route GET để lấy bài viết theo ID
router.get("/:id", blogPostController.getBlogPostById);

// Route GET để lấy tất cả bài viết
router.get("/", blogPostController.getAllBlogPosts);
// Route GET để lấy tất cả bài viết của  màn user
export default router;

import BlogPost from "../models/blogPost.model.js"; // Import BlogPost model
import { body, validationResult } from "express-validator";
import mongoose from "mongoose"; // Import mongoose
import User from "../models/user.model.js"; // Import BlogPost model

const getAllBlog = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        res.status(200).json(blogPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getBlogDetail = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("📌 Received request for Blog ID:", id);

        // Kiểm tra ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid ObjectId format:", id);
            return res.status(400).json({ message: "Invalid blog ID format" });
        }

        // Truy vấn dữ liệu từ MongoDB
        const blogPost = await BlogPost.findById(new mongoose.Types.ObjectId(id));

        if (!blogPost) {
            console.log("⚠️ Blog post not found:", { message: "Blog post not found", id });
            return res.status(404).json({ message: "Blog post not found" });
        }

        console.log("✅ Blog post found:", blogPost);
        res.status(200).json(blogPost);
    } catch (error) {
        console.error("🔥 Server error:", error);
        res.status(500).json({ error: error.message });
    }
};


const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) return res.status(400).json({ error: "Thiếu postId." });

        const blogPost = await BlogPost.findById(postId).select("comments");
        if (!blogPost) return res.status(404).json({ error: "Bài viết không tồn tại." });

        const comments = blogPost.comments || [];
        if (!comments.length) return res.status(200).json({ message: "Không có bình luận nào." });

        const formattedComments = await Promise.all(comments.map(async (comment) => {
            const user = await User.findById(comment.userId).select("fullName profileImg").catch(() => null);

            let formattedDate = "Không có thông tin";  // Default value if createdAt is invalid
            if (comment.createAt) {
                const createdAtDate = new Date(comment.createAt);
                console.log("Ngày tạo (Date Object):", createdAtDate);  // Log giá trị ngày tháng
                if (!isNaN(createdAtDate.getTime())) {  // Kiểm tra nếu ngày hợp lệ
                    formattedDate = createdAtDate.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
                } else {
                    formattedDate = "Ngày không hợp lệ"; // If createdAt is invalid
                }
            }

            return {
                userId: comment.userId,
                fullName: user?.fullName || "Người dùng không tồn tại",
                profileImg: user?.profileImg || "",
                content: comment.content,
                createdAt: formattedDate,  // Trả về ngày tháng đã xử lý
            };
        }));

        res.status(200).json({ success: true, comments: formattedComments });
    } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
        res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
    }
};






const addComment = async (req, res) => {
    try {
        const { postId } = req.params; // Lấy ID bài viết từ URL
        const { userId, username, content } = req.body; // Lấy dữ liệu từ request body

        if (!userId || !username || !content) {
            return res.status(400).json({ error: "Thiếu thông tin bình luận." });
        }

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ error: "Bài viết không tồn tại." });
        }

        // Gán ngày tháng đã định dạng
        const createdAt = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

        console.log("Ngày tạo bình luận (createdAt):", createdAt); // Log để kiểm tra ngày tháng

        const newComment = {
            userId,
            username,
            content,
            createdAt, // Gán ngày tháng đã định dạng
        };

        blogPost.comments.push(newComment);
        await blogPost.save();

        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        console.error("Lỗi máy chủ:", error);
        res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
    }
};


const updateComment = async (req, res) => {
    try {
        const { postId, userId } = req.params; 
        const { content } = req.body;

        console.log("📌 Nhận request:", { postId, userId });
        console.log("📌 Nội dung mới:", content);

        if (!content.trim()) {
            return res.status(400).json({ error: "Nội dung bình luận không được để trống." });
        }

        // Tìm bài viết
        const blogPost = await BlogPost.findById(postId);
        console.log("📌 Bài viết tìm thấy:", blogPost);

        if (!blogPost) {
            console.log("❌ Không tìm thấy bài viết:", postId);
            return res.status(404).json({ error: "Bài viết không tồn tại." });
        }

        // Tìm bình luận theo userId thay vì commentId
        const comment = blogPost.comments.find(cmt => cmt.userId.toString() === userId);
        console.log("📌 Bình luận tìm thấy:", comment);

        if (!comment) {
            console.log("❌ Người dùng chưa có bình luận:", userId);
            return res.status(404).json({ error: "Không tìm thấy bình luận của bạn." });
        }

        // Cập nhật nội dung và thời gian chỉnh sửa bình luận
        comment.content = content;
        comment.createdAt = new Date().toISOString(); // Cập nhật thời gian mới
        await blogPost.save();

        console.log("✅ Bình luận đã cập nhật:", comment);
        res.status(200).json({ success: true, comment });
    } catch (error) {
        console.error("🔥 Lỗi máy chủ:", error);
        res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
    }
};






const deleteComment = async (req, res) => {
    try {
        const { postId, userId } = req.params;

        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ error: "Bài viết không tồn tại" });
        }

        const commentIndex = blogPost.comments.findIndex(c => c.userId.toString() === userId);
        if (commentIndex === -1) {
            return res.status(404).json({ error: "Bình luận không tồn tại hoặc không thuộc về người dùng này" });
        }

        // Xóa bình luận khỏi mảng
        blogPost.comments.splice(commentIndex, 1);
        await blogPost.save();

        res.status(200).json({ 
            success: true, 
            message: "Bình luận đã bị xóa", 
            comments: blogPost.comments  // Trả về danh sách bình luận sau khi xóa
        });
    } catch (error) {
        console.error("🔥 Lỗi khi xóa bình luận:", error);
        res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại sau." });
    }
};


// Controller to create a new blog post with validation
const createBlogPost = [
    // Validation rules
    body("title").isString().withMessage("Title must be a string").notEmpty().withMessage("Title is required"),
    body("userId")
        .isMongoId()
        .withMessage("UserId must be a valid MongoDB ObjectId")
        .notEmpty()
        .withMessage("UserId is required"),
    // body("userId").isMongoId().withMessage("UserId must be a valid MongoDB ObjectId").notEmpty().withMessage("UserId is required"),
    body("content").isString().withMessage("Content must be a string").notEmpty().withMessage("Content is required"),
    body("status").optional().isIn(["Draft", "Published"]).withMessage("Status must be either 'Draft' or 'Published'"),

    // Controller to create a new blog post
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, userId, image, content, status } = req.body;

            // Create a new blog post instance
            const newBlogPost = new BlogPost({
                title,
                userId,
                image,
                content,
                status,
            });

            // Save the new blog post to the database
            const savedBlogPost = await newBlogPost.save();

            // Send the saved blog post as the response
            res.status(201).json(savedBlogPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error while creating the blog post." });
        }
    },
];

// Validation rules for update
const updateBlogPostValidation = [
    body("title").optional().isString().withMessage("Title must be a string"),
    body("content").optional().isString().withMessage("Content must be a string"),
    body("status").optional().isIn(["Draft", "Published"]).withMessage("Status must be either 'Draft' or 'Published'"),
];

// Controller to update a blog post
const updateBlogPost = [
    // Validation middleware
    ...updateBlogPostValidation,

    // Controller to handle the update
    async (req, res) => {
        const { id } = req.params; // Lấy ID từ tham số route
        const { title, content, status, image } = req.body; // Lấy các trường cần cập nhật từ body

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Tìm và cập nhật bài viết
            const updatedBlogPost = await BlogPost.findByIdAndUpdate(
                id,
                {
                    title,
                    content,
                    status,
                    image,
                },
                { new: true }
            ); // Trả về bài viết đã cập nhật

            if (!updatedBlogPost) {
                return res.status(404).json({ message: "Blog post not found." });
            }

            res.status(200).json(updatedBlogPost); // Trả về bài viết đã được cập nhật
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error while updating the blog post." });
        }
    },
];

// Controller to get a blog post by ID
const getBlogPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await BlogPost.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Blog post not found." });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching blog post by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Lấy tất cả bài viết
const getAllBlogPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default { createBlogPost, updateBlogPost, getAllBlogPosts, getBlogPostById, getAllBlog, getBlogDetail,updateComment,addComment,deleteComment,getComments};

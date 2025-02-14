
import BlogPost from "../models/blogPost.model.js";

const getAllBlog = async (req, res) => {
        try {
            const blogPosts = await BlogPost.find();
            console.log(blogPosts);
            res.status(200).json(blogPosts);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
export default {
    getAllBlog
  };


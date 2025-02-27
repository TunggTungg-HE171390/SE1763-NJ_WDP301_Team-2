import BlogPost from "../models/blogPost.model.js";

 const getBlogDetail = [
    async (req, res) => {
        try {
            const { id } = req.params;
            const blogPost = await BlogPost.findById(id);
            
            if (!blogPost) {
                return res.status(404).json({ message: "Blog post not found" });
            }
            
            res.status(200).json(blogPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];


export default {
    getBlogDetail
}
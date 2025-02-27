import express from "express";

import a from "../controllers/index.js";
const blogRouter = express.Router();

blogRouter.get("/allblog", a.BlogPostController.getAllBlog);
blogRouter.get("/blogdetail/:id", a.BlogDetailController.getBlogDetail);

export default blogRouter;

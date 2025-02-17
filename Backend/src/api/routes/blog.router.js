import express from "express";

import { BlogPostController } from "../controllers/index.js";
import { BlogDetailController } from "../controllers/index.js";
const blogRouter = express.Router();

blogRouter.get("/allblog", BlogPostController.getAllBlog);
blogRouter.get("/blogdetail/:id", BlogDetailController.getBlogDetail);

export default blogRouter;

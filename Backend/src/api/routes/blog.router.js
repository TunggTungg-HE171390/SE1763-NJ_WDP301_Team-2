import express from "express";

import { BlogPostController } from "../controllers/index.js";
const blogRouter = express.Router();

blogRouter.get("/allblog", BlogPostController.getAllBlog);

export default blogRouter;

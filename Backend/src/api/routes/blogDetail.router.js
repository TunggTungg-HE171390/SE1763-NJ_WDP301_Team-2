import express from "express";

import { BlogDetailController } from "../controllers/index.js";
const blogRouter = express.Router();

blogRouter.get("/blogdetail/:id", BlogDetailController.getBlogDetail);

export default blogRouter;

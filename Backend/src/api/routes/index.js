import express from "express";
import blogPostRoutes from "./blogPost.routes.js";

const router = express.Router();
router.use("/blogposts", blogPostRoutes); 

export default router;

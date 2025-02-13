import express from "express";
import blogRouter from "./blog.router.js";

import blogPostRoutes from "./blogPost.routes.js";


const router = express.Router();
router.use("/blogposts", blogPostRoutes); 

router.use("/blog", blogRouter);


export default router;
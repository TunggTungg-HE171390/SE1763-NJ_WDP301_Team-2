import express from "express";
import blogRouter from "./blog.router.js";
import blogPostRoutes from "./blogPost.routes.js";

import blogDetailRoutes from "./blogDetail.router.js";

const router = express.Router();
router.use("/blogposts", blogPostRoutes); 

router.use("/blog", blogRouter);
router.use("/blog", blogDetailRoutes);


export default router;
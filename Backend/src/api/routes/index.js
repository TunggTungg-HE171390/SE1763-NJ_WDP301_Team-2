import express from "express";
<<<<<<< HEAD
import blogRouter from "./blog.router.js";
=======
import blogPostRoutes from "./blogPost.routes.js";
>>>>>>> 23584c1e17b284fe8ea189bb94f60beb0f92a13d

const router = express.Router();
router.use("/blogposts", blogPostRoutes); 

router.use("/blog", blogRouter);


export default router;
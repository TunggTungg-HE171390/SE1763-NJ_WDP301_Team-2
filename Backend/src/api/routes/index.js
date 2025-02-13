import express from "express";
import blogPostRoutes from "./blogPost.routes.js";

const router = express.Router();
router.use("/blogposts", blogPostRoutes); 

router.use("/auth", userRouter);
// router.use("/category", categoryRouter);
// router.use("/question", questionRouter);
// router.use("/test", testRouter);
// router.use("/test-history", testHistoryRouter);

export default router;

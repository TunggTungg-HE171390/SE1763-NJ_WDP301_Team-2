import express from "express";
import blogPostRoutes from "./blogPost.routes.js";
import userRouter from "./user.routes.js";
import categoryRouter from "./category.router.js";
import questionRouter from "./question.router.js";
import testRouter from "./test.router.js";
import testHistoryRouter from "./testHistory.router.js";


const router = express.Router();
router.use("/blogposts", blogPostRoutes);

router.use("/auth", userRouter);
router.use("/category", categoryRouter);
router.use("/question", questionRouter);
router.use("/test", testRouter);
router.use("/test-history", testHistoryRouter);

export default router;

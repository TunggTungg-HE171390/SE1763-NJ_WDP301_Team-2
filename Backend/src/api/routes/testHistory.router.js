import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import a from "../controllers/index.js";
const testHistoryRouter = express.Router();

testHistoryRouter.get("/:userId/:testId", authenticateUser, a.TestHistoryController.getUserAnswerForQuestion); 
testHistoryRouter.post("/submit/:userId/:testId", authenticateUser, a.TestHistoryController.submitTest);

export default testHistoryRouter;
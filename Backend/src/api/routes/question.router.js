import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import a from "../controllers/index.js";
const questionRouter = express.Router();

questionRouter.get("/:id", authenticateUser, a.QuestionController.findQuestionsById);
questionRouter.get("/questions-on-test/:testId", authenticateUser, a.QuestionController.getQuestionsOnTest);
questionRouter.post("/insert-questions/:testId", authenticateUser, a.QuestionController.insertQuestionOnTest);
questionRouter.get("/check/:testId", authenticateUser, a.QuestionController.checkIfTestHasQuestions);

export default questionRouter;
import express from "express";

import { QuestionController } from "../controllers/index.js";
const questionRouter = express.Router();

questionRouter.get("/:id", QuestionController.findQuestionsById);
questionRouter.get("/questions-on-test/:testId", QuestionController.getQuestionsOnTest);
questionRouter.post("/insert-questions/:testId", QuestionController.insertQuestionOnTest);
questionRouter.get("/check/:testId", QuestionController.checkIfTestHasQuestions);
questionRouter.put("/edit/:questionId", QuestionController.updateAllAnswers);
questionRouter.delete("/delete/:questionId", QuestionController.deleteQuestion);
questionRouter.get("/count/:testId", QuestionController.getCountQuestionOnTheTest);

export default questionRouter;
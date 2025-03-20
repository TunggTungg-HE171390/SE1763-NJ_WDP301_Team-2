import express from "express";

import { TestController } from "../controllers/index.js";
const testRouter = express.Router();

testRouter.get("/:testId", TestController.findTestsById); 
testRouter.post("/create/:categoryId", TestController.createTest);
testRouter.delete("/delete/:testId", TestController.deleteTest);
testRouter.put

export default testRouter;
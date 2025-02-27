import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import a from "../controllers/index.js";
const testRouter = express.Router();

testRouter.get("/:id", authenticateUser, a.TestController.findTestsById); 
testRouter.post("/create/:categoryId", authenticateUser, a.TestController.createTest);

export default testRouter;
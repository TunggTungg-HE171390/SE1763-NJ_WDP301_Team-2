import express from "express";

import { UserController } from "../controllers/index.js";
const userRouter = express.Router();

userRouter.get("/findAll", UserController.findAllUsers); 

export default userRouter;
import express from "express";

import { CategoryController } from "../controllers/index.js";
const categoryRouter = express.Router();

categoryRouter.get("/getCategories", CategoryController.findAllCategories); 

export default categoryRouter;
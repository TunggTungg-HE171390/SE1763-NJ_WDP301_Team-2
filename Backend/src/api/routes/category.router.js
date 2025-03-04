import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import a from "../controllers/index.js";
const categoryRouter = express.Router();


//categoryRouter.get("/getCategories", CategoryController.findAllCategories); 
//categoryRouter.get("/getTest/:categoryId", CategoryController.findTestsByCategoyId);
//categoryRouter.get("/getName/:categoryId", CategoryController.getCateNameByCateId);

categoryRouter.get("/getCategories", authenticateUser, a.CategoryController.findAllCategories); 
categoryRouter.get("/getTest/:categoryId", authenticateUser, a.CategoryController.findTestsByCategoyId);
categoryRouter.get("/getName/:categoryId", authenticateUser, a.CategoryController.getCateNameByCateId);


export default categoryRouter;
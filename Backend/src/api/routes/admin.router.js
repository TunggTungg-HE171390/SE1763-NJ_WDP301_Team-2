import express from "express";

import { AdminController } from "../controllers/index.js";

const accountRouter = express.Router();

accountRouter.get("/allaccount", AdminController.getAllAccount);
accountRouter.post("/addaccount", AdminController.addAccount);
accountRouter.put("/updateaccount/:id", AdminController.updateAccount);
accountRouter.delete("/deleteaccount/:id", AdminController.deleteAccount);

export default accountRouter;

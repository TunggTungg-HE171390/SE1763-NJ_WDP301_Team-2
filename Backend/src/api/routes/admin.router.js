import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import a from "../controllers/index.js";

const accountRouter = express.Router();

accountRouter.get("/allaccount", authenticateUser, a.AdminController.getAllAccount);
accountRouter.post("/addaccount", authenticateUser, a.AdminController.addAccount);
accountRouter.put("/updateaccount/:id", authenticateUser, a.AdminController.updateAccount);
accountRouter.delete("/deleteaccount/:id", authenticateUser, a.AdminController.deleteAccount);

export default accountRouter;

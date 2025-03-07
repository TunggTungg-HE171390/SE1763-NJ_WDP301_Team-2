import express from "express";

import { AvailabilityController } from "../controllers/index.js";
const availabilityRouter = express.Router();

availabilityRouter.get("/:psychologistId", AvailabilityController.findScheduleByPsychologistId); 

export default availabilityRouter;
import express from "express";

import { AppointmentController } from "../controllers/index.js";
const appointmentRouter = express.Router();

appointmentRouter.get("/:psychologistId", AppointmentController.findScheduleByPsychologistId); 

export default appointmentRouter;
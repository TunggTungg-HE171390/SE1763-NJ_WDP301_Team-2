import express from "express";

import { AppointmentController } from "../controllers/index.js";
const appointmentRouter = express.Router();

appointmentRouter.get("/get-psychologist/:psychologistId", AppointmentController.findScheduleByPsychologistId);
appointmentRouter.get("/rescheduleList", AppointmentController.getStatusRescheduleByUser);
appointmentRouter.get("/getAllAppoint", AppointmentController.getAllAppointment);
appointmentRouter.get("/getAppointment/:appointmentId", AppointmentController.getDetailAppointmentId);
appointmentRouter.get("/countRequestReschedule", AppointmentController.getCountRequestReschedule);
appointmentRouter.put("/reschedule-appointment", AppointmentController.changeBooleanIsReschedule);
appointmentRouter.put("/cancel-schedule/:", AppointmentController.cancelScheduleByPatient);

export default appointmentRouter;
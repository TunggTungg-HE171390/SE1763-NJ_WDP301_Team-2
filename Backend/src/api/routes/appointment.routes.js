import express from "express";
// import AppointmentController from "../controllers/appointment.controller.js";
import { AppointmentController } from "../controllers/index.js";
const appointmentRouter = express.Router();

appointmentRouter.get("/get-psychologist/:psychologistId", AppointmentController.findScheduleByPsychologistId);
appointmentRouter.get("/rescheduleList", AppointmentController.getStatusRescheduleByUser);
appointmentRouter.get("/getAllAppoint", AppointmentController.getAllAppointment);
appointmentRouter.get("/getAppointment/:appointmentId", AppointmentController.getDetailAppointmentId);
appointmentRouter.get("/countRequestReschedule", AppointmentController.getCountRequestReschedule);
appointmentRouter.put("/reschedule-appointment/:appointmentId", AppointmentController.changeBooleanIsReschedule);
appointmentRouter.put("/cancel-schedule/:appointmentId", AppointmentController.cancelScheduleByPatient);
appointmentRouter.post("/create_payment_link", AppointmentController.createPaymentLink);
appointmentRouter.post("/check_payment_status", AppointmentController.checkPaymentStatusAPI);
appointmentRouter.post("/update_appointment/:appointmentId", AppointmentController.updateAppointment);
appointmentRouter.post("/wait_for_payment", AppointmentController.waitForPayment);
appointmentRouter.post("/approve_appointment", AppointmentController.confirmPayment);
appointmentRouter.post("/cancel_appointment", AppointmentController.cancelPayment);
appointmentRouter.get("/appointment-list/:userId", AppointmentController.getAppointmentListByUserId);
appointmentRouter.post("/count-pending-appointment", AppointmentController.checkPendingAppointmentByUserId);
appointmentRouter.post("/create-meet-url", AppointmentController.createMeetUrlAPI);
appointmentRouter.post("/appointment-details", AppointmentController.getUserAppointmentById);
appointmentRouter.post("/create-zoom-meeting", AppointmentController.createZoomMeetingAPI);
appointmentRouter.post("/reschedule/:appointmentId", AppointmentController.rescheduleAppointment);

export default appointmentRouter;

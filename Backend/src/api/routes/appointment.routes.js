import express from "express";
import appointmentController from "../controllers/appointment.controller.js";
import { authenticateUser, authorizeRole } from "../middlewares/auth.middleware.js";

const appointmentRouter = express.Router();

// Get appointment by ID
appointmentRouter.get("/:appointmentId", appointmentController.getAppointmentById);

// Update appointment status
appointmentRouter.patch("/:appointmentId/status", appointmentController.updateAppointmentStatus);

// Get all appointments (with filtering)
appointmentRouter.get("/", appointmentController.getAllAppointments);

export default appointmentRouter;

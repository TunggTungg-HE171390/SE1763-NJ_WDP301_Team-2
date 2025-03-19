import express from "express";
import psychologistController from "../controllers/psychologist.controller.js";
import availabilityController from "../controllers/availability.controller.js";
import UserController from "../controllers/user.controller.js";
import { authenticateUser, authorizeRole } from "../middlewares/auth.middleware.js";

const psychologistRouter = express.Router();

// Add route to get all psychologists
psychologistRouter.get("/all", UserController.getAllPsychologists);

// Routes for staff to update psychologist profiles
psychologistRouter.put(
  "/:id/experience",
  // authenticateUser,  // Uncomment when ready for authentication
  // authorizeRole(['admin', 'staff']),  // Uncomment when ready for authorization
  UserController.updatePsychologistExperience
);

psychologistRouter.put(
  "/:id/work-history",
  // authenticateUser,  // Uncomment when ready for authentication
  // authorizeRole(['admin', 'staff']),  // Uncomment when ready for authorization
  UserController.updatePsychologistWorkHistory
);

psychologistRouter.put(
  "/:id/profile",
  // authenticateUser,  // Uncomment when ready for authentication
  // authorizeRole(['admin', 'staff']),  // Uncomment when ready for authorization
  UserController.updatePsychologistProfile
);

// Existing routes
psychologistRouter.get("/get-psychologist-list", psychologistController.getPsychologistList);
psychologistRouter.get("/get-specialization-list", psychologistController.getUniqueSpecializations);
psychologistRouter.get("/:doctorId", psychologistController.getPsychologistById);
psychologistRouter.get("/scheduleList/:doctorId", availabilityController.getAvailabilitiesById);
psychologistRouter.get("/schedule/:scheduleId", availabilityController.getAvailabilityById);
psychologistRouter.post("/save-appointment", psychologistController.saveAppointment);
psychologistRouter.get("/appointment/:appointmentId", psychologistController.getAppointmentById);

export default psychologistRouter;

import express from "express";
import psychologistController from "../controllers/psychologist.controller.js";
import availabilityController from "../controllers/availability.controller.js";
import { authenticateUser, authorizeRole } from "../middlewares/auth.middleware.js";

const psychologistRouter = express.Router();

// First, all specific routes with clear prefixes
psychologistRouter.get("/all", psychologistController.getAllPsychologists);
psychologistRouter.get("/get-psychologist-list", psychologistController.getPsychologistList);
psychologistRouter.get("/get-specialization-list", psychologistController.getUniqueSpecializations);
psychologistRouter.post("/save-appointment", psychologistController.saveAppointment);

// Availability routes
psychologistRouter.post("/availability/create", availabilityController.createPsychologistAvailability);
psychologistRouter.post("/availability/create-slot", availabilityController.createIndividualSlot);
psychologistRouter.patch("/availability/:slotId/status", availabilityController.updateAvailabilityStatus);

// Make sure scheduleList route is BEFORE the generic /:doctorId route
psychologistRouter.get("/scheduleList/:doctorId", availabilityController.getAvailabilitiesById);
psychologistRouter.get("/schedule/:scheduleId", availabilityController.getAvailabilityById);
psychologistRouter.get("/appointment/:appointmentId", psychologistController.getAppointmentById);

// Then the update routes
psychologistRouter.put(
  "/:id/experience",
  // authenticateUser,  // Uncomment when ready for authentication
  // authorizeRole(['admin', 'staff']),  // Uncomment when ready for authorization
  psychologistController.updatePsychologistExperience
);

psychologistRouter.put(
  "/:id/work-history",
  // authenticateUser,  // Uncomment when ready for authentication
  // authorizeRole(['admin', 'staff']),  // Uncomment when ready for authorization
  psychologistController.updatePsychologistWorkHistory
);

psychologistRouter.put(
  "/:id/profile",
  // authenticateUser,  // Uncomment when ready for authentication
  // authorizeRole(['admin', 'staff']),  // Uncomment when ready for authorization
  psychologistController.updatePsychologistProfile
);

// Always put generic parameter routes LAST
psychologistRouter.get("/:doctorId", psychologistController.getPsychologistById);

export default psychologistRouter;

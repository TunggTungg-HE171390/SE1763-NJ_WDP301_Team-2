import express from "express";
import psychologistController from "../controllers/psychologist.controller.js";
import availabilityController from "../controllers/availability.controller.js";
import { authenticateUser, authorizeRole } from "../middlewares/auth.middleware.js";

const psychologistRouter = express.Router();

// First, all specific routes with clear prefixes
psychologistRouter.get("/all", psychologistController.getAllPsychologists);
psychologistRouter.get("/get-psychologist-list", psychologistController.getPsychologistList);
psychologistRouter.get("/get-specialization-list", psychologistController.getUniqueSpecializations);
psychologistRouter.get("/get-psychologist/:doctorId", psychologistController.getPsychologistById);
psychologistRouter.post("/save-appointment", psychologistController.saveAppointment);

// Ensure the availability/create route is properly defined
psychologistRouter.post("/availability/create", availabilityController.createPsychologistAvailability);

// Add a new route for creating multiple slots at once
psychologistRouter.post("/availability/create-multiple", availabilityController.createMultipleAvailabilitySlots);

// Availability routes
psychologistRouter.post("/availability/create-slot", availabilityController.createIndividualSlot);
psychologistRouter.patch("/availability/:slotId/status", availabilityController.updateAvailabilityStatus);

// Make sure scheduleList route is BEFORE the generic /:doctorId route
psychologistRouter.get("/scheduleList/:doctorId", availabilityController.getAvailabilitiesById);
psychologistRouter.get("/schedule/:scheduleId", availabilityController.getAvailabilityById);
psychologistRouter.get("/appointment/:appointmentId", psychologistController.getAppointmentById);
psychologistRouter.get("/appointment-list/", psychologistController.getAppointmentList);

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

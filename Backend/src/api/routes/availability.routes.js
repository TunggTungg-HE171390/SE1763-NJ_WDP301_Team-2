import express from "express";
import availabilityController from "../controllers/availability.controller.js";
import { AvailabilityController } from "../controllers/index.js";
import { authenticateUser, authorizeRole } from "../middlewares/auth.middleware.js";

const availabilityRouter = express.Router();

// Get slots by date range
availabilityRouter.get("/slots", availabilityController.getAvailabilitySlotsByDateRange);

// Get specific slot by ID
availabilityRouter.get("/:slotId", availabilityController.getAvailabilityById);

// Update slot booking status
availabilityRouter.patch("/:slotId/booking", availabilityController.updateAvailabilityStatus);

// Create a new availability slot
availabilityRouter.post("/create", availabilityController.createIndividualSlot);

availabilityRouter.get("/:psychologistId", AvailabilityController.findScheduleByPsychologistId);

export default availabilityRouter;

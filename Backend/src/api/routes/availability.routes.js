import express from 'express';
// Fix the import statement to correctly import availabilityController
import availabilityController from '../controllers/availability.controller.js';
import { authenticateUser, authorizeRole } from '../middlewares/auth.middleware.js';

const availabilityRouter = express.Router();

// Get availability slots for a psychologist
availabilityRouter.get('/:psychologistId', availabilityController.getAvailabilitiesById);

// Create availability slots by date range
availabilityRouter.post('/create', 
  // authenticateUser, authorizeRole(['staff', 'admin']), // Middleware disabled for debugging
  availabilityController.createPsychologistAvailability
);

// Create multiple custom availability slots
availabilityRouter.post('/create-multiple', 
  // authenticateUser, authorizeRole(['staff', 'admin']), // Middleware disabled for debugging
  availabilityController.createMultipleAvailabilitySlots
);

// Create a single availability slot
availabilityRouter.post('/create-slot', 
  // authenticateUser, authorizeRole(['staff', 'admin']), // Middleware disabled for debugging
  availabilityController.createIndividualSlot
);

// Update slot status (booked/available)
availabilityRouter.patch('/:slotId/status', availabilityController.updateAvailabilityStatus);

// Get availability slots by date range
availabilityRouter.get('/range', availabilityController.getAvailabilitySlotsByDateRange);

// Get a single availability slot by ID
availabilityRouter.get('/slot/:scheduleId', availabilityController.getAvailabilityById);

export default availabilityRouter;

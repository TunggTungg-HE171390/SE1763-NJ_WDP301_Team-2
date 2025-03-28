import Availability from "../models/availability.model.js";
import Appointment from "../models/appointment.model.js";
import mongoose from "mongoose";
import { generateDailySlots, generateSlotsForDateRange, filterPastSlots } from "../utils/scheduleGenerator.js";

/**
 * Create availability slots for a psychologist based on fixed schedule
 * This function is intended to be used by staff members only
 */
const createPsychologistAvailability = async (req, res) => {
    try {
        console.log("Received request to create availability slots:", req.body);
        const { psychologistId, startDate, endDate } = req.body;

        if (!psychologistId || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        console.log(`Creating availability for psychologist ${psychologistId} from ${startDate} to ${endDate}`);

        // Generate slots for the date range
        const slots = generateSlotsForDateRange(psychologistId, new Date(startDate), new Date(endDate));

        // Filter out slots in the past
        const validSlots = filterPastSlots(slots);

        if (validSlots.length === 0) {
            return res.status(400).json({
                message: "No valid slots could be generated. Please check that your dates are in the future.",
            });
        }

        // Check for existing slots in this date range to avoid duplicates
        const startDateObj = new Date(startDate);
        startDateObj.setHours(0, 0, 0, 0);

        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);

        const existingSlots = await Availability.find({
            psychologistId,
            date: { $gte: startDateObj, $lte: endDateObj },
        });

        console.log(`Found ${existingSlots.length} existing slots in date range`);

        // If existing slots, filter them out
        let newSlots = validSlots;
        if (existingSlots.length > 0) {
            // Create a map of existing slot times for efficient lookup
            const existingSlotMap = new Map();
            existingSlots.forEach((slot) => {
                const key = `${slot.date.toISOString().split("T")[0]}_${slot.startTime.toISOString()}`;
                existingSlotMap.set(key, true);
            });

            // Filter out slots that already exist
            newSlots = validSlots.filter((slot) => {
                const key = `${slot.date.toISOString().split("T")[0]}_${slot.startTime.toISOString()}`;
                return !existingSlotMap.has(key);
            });
        }

        console.log(`After filtering, creating ${newSlots.length} new slots`);

        // Save new slots
        if (newSlots.length > 0) {
            // Ensure all slots have isBooked = false
            newSlots = newSlots.map((slot) => ({
                ...slot,
                isBooked: false, // Set isBooked explicitly
                appointmentId: null // Initialize appointmentId as null
            }));

            const result = await Availability.insertMany(newSlots);

            return res.status(201).json({
                message: `Created ${result.length} new availability slots`,
                slotsCreated: result.length,
                firstDate: new Date(result[0].date),
                lastDate: new Date(result[result.length - 1].date),
            });
        } else {
            return res.status(200).json({
                message: "No new slots created. All requested slots already exist.",
                slotsCreated: 0,
            });
        }
    } catch (err) {
        console.log("Error creating availability:", err);
        res.status(500).json({ message: "Failed to create availability", error: err.message });
    }
};

const getAvailabilitiesById = async (req, res) => {
    try {
        console.log("Getting availabilities for psychologist ID:", req.params.psychologistId);
        const { psychologistId } = req.params;

        if (!psychologistId) {
            return res.status(400).json({ message: "Psychologist ID is required" });
        }

        // Find all availability slots for this psychologist
        const availabilitySlots = await Availability.find({ psychologistId })
            .sort({ date: 1, startTime: 1 })
            .lean();

        console.log(`Found ${availabilitySlots.length} availability slots`);
        return res.status(200).json(availabilitySlots);
    } catch (error) {
        console.error("Error fetching availabilities:", error);
        return res.status(500).json({
            message: "Server error when fetching availabilities",
            error: error.message
        });
    }
};

const getAvailabilityById = async (req, res) => {
    try {
        const { scheduleId } = req.params; // Extract the availability ID from request parameters

        // Find the availability by ID
        const availability = await Availability.findById(scheduleId);

        if (!availability) {
            return res.status(404).json({ message: "Availability not found" });
        }

        res.status(200).json(availability);
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update availability slot status
 * This function is used by the system when appointments are created/updated
 */
const updateAvailabilityStatus = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { isBooked, appointmentId } = req.body;

        if (!slotId || isBooked === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find and update the slot
        const slot = await Availability.findById(slotId);

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        // Don't allow changing already booked slots back to available without proper authorization
        if (slot.isBooked && !isBooked) {
            return res.status(400).json({
                message: "Cannot change booked slot back to available",
            });
        }

        // Update isBooked field
        slot.isBooked = isBooked;

        // If moving to booked status, ensure we have an appointmentId
        if (isBooked) {
            if (!appointmentId) {
                return res.status(400).json({
                    message: "appointmentId is required when setting isBooked to true",
                });
            }
            slot.appointmentId = appointmentId;
        } else {
            // If marking as not booked, clear the appointmentId
            slot.appointmentId = null;
        }

        await slot.save();

        return res.status(200).json({
            message: "Availability status updated successfully",
            availability: slot,
        });
    } catch (error) {
        console.error("Error updating availability status:", error);
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};

/**
 * Create individual availability slot
 */
const createIndividualSlot = async (req, res) => {
    try {
        // Check if the user has staff role (middleware should handle this)
        if (req.user && req.user.role !== "staff") {
            return res.status(403).json({ message: "Only staff members can manage psychologist schedules" });
        }

        const { psychologistId, date, startTime, endTime } = req.body;

        if (!psychologistId || !date || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if slot is in the past
        const slotStartTime = new Date(startTime);
        const now = new Date();

        if (slotStartTime < now) {
            return res.status(400).json({ message: "Cannot create slots in the past" });
        }

        // Check if slot already exists
        const existingSlot = await Availability.findOne({
            psychologistId,
            startTime: slotStartTime,
        });

        if (existingSlot) {
            return res.status(409).json({ message: "Slot already exists for this time" });
        }

        // Create new slot
        const newSlot = new Availability({
            psychologistId,
            date: new Date(date),
            startTime: slotStartTime,
            endTime: new Date(endTime),
            isBooked: false,
            appointmentId: null,
            createdBy: req.user ? req.user._id : "system"
        });

        await newSlot.save();

        return res.status(201).json({
            message: "Slot created successfully",
            slot: newSlot,
        });
    } catch (error) {
        console.error("Error creating slot:", error);
        res.status(500).json({ message: "Failed to create slot", error: error.message });
    }
};

/**
 * Create multiple availability slots at once (only for selected slots)
 * This function is intended to be used by staff members only
 */
const createMultipleAvailabilitySlots = async (req, res) => {
    try {
        const { psychologistId, slots } = req.body;

        if (!psychologistId || !slots || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ message: "Missing required fields or empty slots array" });
        }

        console.log(`Creating ${slots.length} availability slots for psychologist ${psychologistId}`);

        // Check for existing slots to avoid duplicates
        const existingSlots = await Availability.find({
            psychologistId,
            isBooked: false,
        });

        console.log(`Found ${existingSlots.length} existing available slots`);

        // Filter out any slots that already exist
        const existingSlotMap = new Map();
        existingSlots.forEach((slot) => {
            const key = `${slot.date.toISOString().split("T")[0]}_${slot.startTime.toISOString()}`;
            existingSlotMap.set(key, true);
        });

        // Filter slots to create - only include ones that don't exist yet
        const slotsToCreate = slots.filter((slot) => {
            const key = `${new Date(slot.date).toISOString().split("T")[0]}_${new Date(slot.startTime).toISOString()}`;
            return !existingSlotMap.has(key);
        });

        console.log(`After filtering, creating ${slotsToCreate.length} new slots`);

        // If no new slots to create, return early
        if (slotsToCreate.length === 0) {
            return res.status(200).json({
                message: "No new slots created. All requested slots already exist.",
                slotsCreated: 0,
            });
        }

        // Prepare slots for insertion
        const newSlots = slotsToCreate.map((slot) => ({
            psychologistId,
            date: new Date(slot.date),
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            isBooked: false, // Only using isBooked field
        }));

        // Insert all new slots
        const result = await Availability.insertMany(newSlots);

        return res.status(201).json({
            message: `Created ${result.length} new availability slots`,
            slotsCreated: result.length,
        });
    } catch (err) {
        console.log("Error creating availability slots:", err);
        res.status(500).json({ message: "Failed to create availability slots", error: err.message });
    }
};

/**
 * Get availability slots by date range
 * Can be filtered by psychologist ID
 */
const getAvailabilitySlotsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, psychologistId } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        // Parse dates
        const startDateObj = new Date(startDate);
        startDateObj.setHours(0, 0, 0, 0);

        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);

        // Build query
        const query = {
            date: { $gte: startDateObj, $lte: endDateObj },
        };

        // Add psychologist filter if provided
        if (psychologistId) {
            query.psychologistId = psychologistId;
        }

        console.log(`Fetching availability slots with query:`, query);

        // Get slots
        const slots = await Availability.find(query);

        console.log(`Found ${slots.length} slots`);

        // Process slots to include appointment info if booked
        let processedSlots = slots;

        // Look up appointments for booked slots
        const bookedSlots = slots.filter((slot) => slot.isBooked && slot.appointmentId);

        if (bookedSlots.length > 0) {
            // Get appointment IDs
            const appointmentIds = bookedSlots.map((slot) => slot.appointmentId).filter((id) => id); // Filter out null/undefined

            // Fetch appointments
            const appointments = await Appointment.find({
                _id: { $in: appointmentIds },
            });

            // Create a map for quick lookup
            const appointmentMap = new Map();
            appointments.forEach((app) => {
                appointmentMap.set(app._id.toString(), app);
            });

            // Add appointment data to slots
            processedSlots = slots.map((slot) => {
                const slotObj = slot.toObject();

                if (slot.isBooked && slot.appointmentId) {
                    const appointment = appointmentMap.get(slot.appointmentId.toString());
                    if (appointment) {
                        slotObj.appointment = {
                            _id: appointment._id,
                            status: appointment.status,
                            patientId: appointment.patientId,
                        };
                    }
                }

                return slotObj;
            });
        }

        res.status(200).json(processedSlots);
    } catch (error) {
        console.error("Error fetching availability slots by date range:", error);
        res.status(500).json({ message: "Failed to fetch availability slots", error: error.message });
    }
};

const findScheduleByPsychologistId = async (req, res, next) => {
    try {
        const scheduleByPsychologistId = await Availability.find({ psychologistId: req.params.psychologistId })
            .populate("psychologistId", "fullName -_id")
            .exec();

        const psychologistData = scheduleByPsychologistId.map((psychologist) => ({
            psychologistName: psychologist.psychologistId.fullName,
            scheduleTime: {
                startTime: psychologist.startTime,
                endTime: psychologist.endTime,
                date: psychologist.date,
            },
            isBooked: psychologist.isBooked ? "Rảnh" : "Bận",
        }));

        res.json(psychologistData);
    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

export default {
    createPsychologistAvailability,
    getAvailabilitiesById,
    getAvailabilityById,
    updateAvailabilityStatus,
    createIndividualSlot,
    createMultipleAvailabilitySlots,
    getAvailabilitySlotsByDateRange,
    findScheduleByPsychologistId,
};

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
        // Remove auth check for now to simplify debugging
        // if (req.user && req.user.role !== 'staff') {
        //    return res.status(403).json({ message: "Only staff members can manage psychologist schedules" });
        // }

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
                message: "No valid slots could be generated. Please check that your dates are in the future."
            });
        }
        
        // Check for existing slots in this date range to avoid duplicates
        const startDateObj = new Date(startDate);
        startDateObj.setHours(0, 0, 0, 0);
        
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        
        const existingSlots = await Availability.find({
            psychologistId,
            date: { $gte: startDateObj, $lte: endDateObj }
        });
        
        console.log(`Found ${existingSlots.length} existing slots in date range`);
        
        // If existing slots, filter them out
        let newSlots = validSlots;
        if (existingSlots.length > 0) {
            // Create a map of existing slot times for efficient lookup
            const existingSlotMap = new Map();
            existingSlots.forEach(slot => {
                const key = `${slot.date.toISOString().split('T')[0]}_${slot.startTime.toISOString()}`;
                existingSlotMap.set(key, true);
            });
            
            // Filter out slots that already exist
            newSlots = validSlots.filter(slot => {
                const key = `${slot.date.toISOString().split('T')[0]}_${slot.startTime.toISOString()}`;
                return !existingSlotMap.has(key);
            });
        }
        
        console.log(`After filtering, creating ${newSlots.length} new slots`);
        
        // Save new slots
        if (newSlots.length > 0) {
            // Explicitly ensure all slots have "Available" status
            newSlots = newSlots.map(slot => ({
                ...slot,
                status: "Available"
            }));
            
            const result = await Availability.insertMany(newSlots);
            
            return res.status(201).json({ 
                message: `Created ${result.length} new availability slots`,
                slotsCreated: result.length,
                firstDate: new Date(result[0].date),
                lastDate: new Date(result[result.length - 1].date)
            });
        } else {
            return res.status(200).json({ 
                message: "No new slots created. All requested slots already exist.",
                slotsCreated: 0
            });
        }
    } catch (err) {
        console.log("Error creating availability:", err);
        res.status(500).json({ message: "Failed to create availability", error: err.message });
    }
};

const getAvailabilitiesById = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        if (!doctorId) {
            console.log("Missing doctorId parameter");
            return res.status(400).json({ message: "Doctor ID is required" });
        }
        
        console.log(`Fetching availabilities for doctor ID: ${doctorId}`);
        
        // First check if there are any availabilities in the DB
        console.log("Checking database for availabilities with doctorId:", doctorId);
        
        // Direct string comparison query
        let availabilities = await Availability.find({ 
            psychologistId: doctorId 
        });
        console.log(`Found ${availabilities.length} availabilities with direct string match`);
        
        // If no results, retrieve all availabilities and try other matching techniques
        if (availabilities.length === 0) {
            // Get a sample to check what's in the database
            const allAvailabilities = await Availability.find({}).limit(10);
            
            if (allAvailabilities.length > 0) {
                console.log("Sample availabilities in DB:");
                allAvailabilities.forEach(a => {
                    console.log({
                        id: a._id.toString(),
                        psychologistId: typeof a.psychologistId === 'object' ? 
                            a.psychologistId.toString() : a.psychologistId,
                        date: a.date
                    });
                });
                
                // Try retrieving by directly accessing the items we found
                const matchingIds = allAvailabilities
                    .filter(a => {
                        if (!a.psychologistId) return false;
                        
                        // Convert ObjectId to string if needed
                        const psyId = typeof a.psychologistId === 'object' ? 
                            a.psychologistId.toString() : a.psychologistId;
                            
                        return psyId === doctorId;
                    })
                    .map(a => a._id);
                
                if (matchingIds.length > 0) {
                    console.log(`Found ${matchingIds.length} matching IDs by direct comparison`);
                    availabilities = await Availability.find({ 
                        _id: { $in: matchingIds } 
                    });
                    console.log(`Retrieved ${availabilities.length} availabilities by ID lookup`);
                    
                    // Return these found availabilities
                    return res.status(200).json(availabilities);
                }
            } else {
                console.log("No availabilities found in the database");
            }
        }
        
        // For booked slots, fetch the corresponding appointment IDs
        if (availabilities.length > 0) {
            // Convert availabilities to plain objects for manipulation
            availabilities = availabilities.map(avail => avail.toObject());
            
            // Get all booked slots
            const bookedSlots = availabilities.filter(avail => avail.isBooked);
            
            if (bookedSlots.length > 0) {
                // For each booked slot, try to find the appointment
                for (const slot of bookedSlots) {
                    try {
                        // Find appointment based on psychologistId and date/time
                        const appointment = await Appointment.findOne({
                            psychologistId: doctorId,
                            'scheduledTime.date': {
                                $gte: new Date(new Date(slot.date).setHours(0, 0, 0, 0)),
                                $lt: new Date(new Date(slot.date).setHours(23, 59, 59, 999))
                            },
                            'scheduledTime.startTime': new Date(slot.startTime)
                        });
                        
                        if (appointment) {
                            // Add appointmentId to the availability object
                            const slotIndex = availabilities.findIndex(a => 
                                a._id.toString() === slot._id.toString());
                            
                            if (slotIndex !== -1) {
                                availabilities[slotIndex].appointmentId = appointment._id;
                            }
                        }
                    } catch (err) {
                        console.error('Error finding appointment:', err);
                    }
                }
            }
        }
        
        return res.status(200).json(availabilities);
    } catch (error) {
        console.error("Error fetching availabilities:", error);
        res.status(500).json({ message: "Failed to fetch availabilities", error: error.message });
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
        const { status, appointmentId } = req.body;
        
        if (!slotId || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Validate status
        if (!["Available", "Pending", "Booked"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        // Find and update the slot
        const slot = await Availability.findById(slotId);
        
        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }
        
        // Don't allow changing already booked slots back to available without proper authorization
        if (slot.isBooked && status === "Available") {
            return res.status(400).json({ 
                message: "Cannot change booked slot back to available" 
            });
        }
        
        // Update both the status and isBooked fields
        slot.status = status;
        slot.isBooked = status === "Booked"; // Set isBooked based on status
        
        // If moving to booked status, ensure we have an appointmentId
        if (status === "Booked") {
            if (!appointmentId) {
                return res.status(400).json({ 
                    message: "appointmentId is required when setting status to Booked" 
                });
            }
            slot.appointmentId = appointmentId;
        }
        
        await slot.save();
        
        return res.status(200).json({
            message: "Availability status updated successfully",
            availability: slot
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
    if (req.user && req.user.role !== 'staff') {
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
      startTime: slotStartTime
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
      status: "Available"
    });
    
    await newSlot.save();
    
    return res.status(201).json({
      message: "Slot created successfully",
      slot: newSlot
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
            status: "Available"
        });
        
        console.log(`Found ${existingSlots.length} existing available slots`);
        
        // Filter out any slots that already exist
        const existingSlotMap = new Map();
        existingSlots.forEach(slot => {
            const key = `${slot.date.toISOString().split('T')[0]}_${slot.startTime.toISOString()}`;
            existingSlotMap.set(key, true);
        });
        
        // Filter slots to create - only include ones that don't exist yet
        const slotsToCreate = slots.filter(slot => {
            const key = `${new Date(slot.date).toISOString().split('T')[0]}_${new Date(slot.startTime).toISOString()}`;
            return !existingSlotMap.has(key);
        });
        
        console.log(`After filtering, creating ${slotsToCreate.length} new slots`);
        
        // If no new slots to create, return early
        if (slotsToCreate.length === 0) {
            return res.status(200).json({ 
                message: "No new slots created. All requested slots already exist.",
                slotsCreated: 0
            });
        }
        
        // Prepare slots for insertion
        const newSlots = slotsToCreate.map(slot => ({
            psychologistId,
            date: new Date(slot.date),
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            status: "Available", // For backward compatibility
            isBooked: false // New field - default is available
        }));
        
        // Insert all new slots
        const result = await Availability.insertMany(newSlots);
        
        return res.status(201).json({ 
            message: `Created ${result.length} new availability slots`,
            slotsCreated: result.length
        });
    } catch (err) {
        console.log("Error creating availability slots:", err);
        res.status(500).json({ message: "Failed to create availability slots", error: err.message });
    }
};

export default { 
    createPsychologistAvailability, 
    getAvailabilitiesById, 
    getAvailabilityById,
    updateAvailabilityStatus,
    createIndividualSlot,
    createMultipleAvailabilitySlots // Add the new function to exports
};

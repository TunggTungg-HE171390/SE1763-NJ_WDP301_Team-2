import Availability from "../models/availability.model.js";
import Appointment from "../models/appointment.model.js";
import mongoose from "mongoose";

const createPsychologistAvailability = async (req, res) => {
    try {
        const { psychologistId, date, startTime, endTime } = req.body;
        
        if (!psychologistId || !date || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const newAvailability = new Availability({
            psychologistId,
            date: new Date(date),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            isBooked: false,
        });

        await newAvailability.save();
        res.status(201).json({ message: "Psychologist availability created successfully!", availability: newAvailability });
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

export default { createPsychologistAvailability, getAvailabilitiesById, getAvailabilityById };

import Availability from "../models/availability.model.js"; // Assuming the schema is saved in models/PsychologistAvailability.js

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
        const { doctorId } = req.params; // Extract doctorId from URL params
        const availabilities = await Availability.find({ psychologistId: doctorId });

        if (!availabilities.length) {
            return res.status(404).json({ message: "No availabilities found" });
        }

        res.status(200).json(availabilities);
    } catch (error) {
        console.error("Error fetching availabilities:", error);
        res.status(500).json({ message: "Failed to fetch availabilities" });
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

import Availability from "../models/availability.model.js"; // Assuming the schema is saved in models/PsychologistAvailability.js

const createPsychologistAvailability = async () => {
    const newAvailability = new Availability({
        psychologistId: "60d5f84f206b4f33a5e7bd9b", // Replace with actual psychologist ObjectId
        date: new Date("2025-02-15"), // Replace with actual date
        startTime: new Date("2025-02-15T09:00:00.000+07:00"), // Replace with actual start time
        endTime: new Date("2025-02-15T16:00:00.000+07:00"), // Replace with actual end time
        isBooked: false, // This slot is available
    });

    try {
        await newAvailability.save();
        console.log("Psychologist availability created successfully!");
    } catch (err) {
        console.log("Error creating availability:", err);
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

export default { createPsychologistAvailability, getAvailabilitiesById, getAvailabilityById, findScheduleByPsychologistId };

import Availability from "../models/availability.model.js"; // Assuming the schema is saved in models/PsychologistAvailability.js

const createPsychologistAvailability = async () => {
    const newAvailability = new Availability({
        psychologistId: "60d5f84f206b4f33a5e7bd9b", // Replace with actual psychologist ObjectId
        date: new Date("2025-02-15"), // Replace with actual date
        startTime: new Date("2025-02-15T09:00:00Z"), // Replace with actual start time
        endTime: new Date("2025-02-15T10:00:00Z"), // Replace with actual end time
        isBooked: false, // This slot is available
    });

    try {
        await newAvailability.save();
        console.log("Psychologist availability created successfully!");
    } catch (err) {
        console.log("Error creating availability:", err);
    }
};

export default { createPsychologistAvailability };

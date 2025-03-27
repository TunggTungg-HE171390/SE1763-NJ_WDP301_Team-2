import mongoose, { Schema } from "mongoose";

// Simplified availability slot schema for fixed schedule approach
const AvailabilitySlotSchema = new Schema(
    {
        psychologistId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: Date,
            required: true, // Store the exact start time for the availability
        },
        endTime: {
            type: Date,
            required: true, // Store the exact end time for the availability
        },
        // Add isBooked field (boolean) to replace status
        isBooked: {
            type: Boolean,
            default: false,
        },
        // Keep status field for backward compatibility but deprecate its usage
        status: {
            type: String,
            enum: ["Available", "Pending", "Booked"],
            default: "Available",
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
        },
        createdBy: {
            type: String,
            default: "system",
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the Availability model
const AvailabilitySlot = mongoose.model("availabilities", AvailabilitySlotSchema);

export default AvailabilitySlot;

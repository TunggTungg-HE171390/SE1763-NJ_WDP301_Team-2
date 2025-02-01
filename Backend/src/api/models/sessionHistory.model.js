import mongoose, { Schema } from "mongoose";

// AppointmentOutcome schema
const SessionHistorySchema = new Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User", // Assuming "User" is the model for patients
        },
        psychologistId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User", // Assuming "User" is the model for psychologists
        },
        appointmentId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Appointment", // Assuming "Appointment" is the model for appointments
        },
        note: {
            type: String,
            required: true, // A note is required for the outcome
        },
        outcome: {
            type: String,
            required: true, // Outcome must be specified
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the AppointmentOutcome model
const SessionHistory = mongoose.model("SessionHistory", SessionHistorySchema);

export default SessionHistory;

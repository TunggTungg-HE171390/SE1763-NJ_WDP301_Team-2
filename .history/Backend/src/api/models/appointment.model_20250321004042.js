import mongoose, { Schema } from "mongoose";
if (mongoose.models["appointments"]) {
    delete mongoose.models["appointments"];
}
// Appointment schema: quản lý các cuộc hẹn cụ thể giữa bệnh nhân và bác sĩ
const AppointmentSchema = new Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users", // Assuming "User" model for patients
        },
        psychologistId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users", // Assuming "User" model for psychologists
        },
        availabilityId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "availabilities", // Reference to the availability slot
        },
        scheduledTime: {
            date: {
                type: Date,
                required: true,
            },
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending", // Default status is "Pending"
        },
        isRescheduled: {
            type: Boolean,
            default: false, 
        },
        note: {
            type: String,
            required: false, // The note field is optional
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the Appointment model
const Appointment = mongoose.model("appointments", AppointmentSchema);

export default Appointment;
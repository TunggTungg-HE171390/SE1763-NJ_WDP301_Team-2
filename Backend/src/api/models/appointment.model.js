import mongoose, { Schema } from "mongoose";

// Appointment schema
const AppointmentSchema = new Schema({
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
    originalSchedule: {
        // For tracking reschedules
        date: Date,
        startTime: Date,
        endTime: Date,
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled", "No-show"],
        default: "Pending",
    },
    rescheduleRequest: {
        requestedBy: {
            type: String,
            enum: ["patient", "psychologist", "staff"],
        },
        requestedTime: Date,
        reason: String,
        newSchedule: {
            date: Date,
            startTime: Date,
            endTime: Date,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    paymentInformation: {
        orderCode: {
            type: String,
        },
        description: {
            type: String,
        },
        expiredAt: {
            type: Number, // Unix timestamp
        },
        amount: {
            type: Number,
            default: 350000,
        },
        status: {
            type: String,
            enum: ["PENDING", "PAID", "CANCELLED", "EXPIRED"],
            default: "PENDING",
        },
        checkoutUrl: {
            type: String,
        },
    },
    scheduledTime: {
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: Date, //ban đầu đang là String, đổi lại thành Date
            required: true,
        },
        endTime: {
            type: Date, //ban đầu đang là String, đổi lại thành Date
            required: true,
        },
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending", // Default status is "Pending"
    },
    note: {
        type: String,
        required: false, // The note field is optional
    },
    lastModifiedBy: {
        userId: String,
        role: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    meetingURL: {
        type: String,
        required: false, // The note field is optional
    },
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;

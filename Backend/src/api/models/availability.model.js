import mongoose, { Schema } from "mongoose";

// Individual availability slot schema (existing)
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
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the Availability model for individual slots
const AvailabilitySlot = mongoose.model("availabilities", AvailabilitySlotSchema);

// New schema for availability configuration (weekly pattern or specific dates)
const AvailabilityConfigSchema = new Schema(
    {
        psychologistId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        type: {
            type: String,
            required: true,
            enum: ["weekly", "specific"],
        },
        // For weekly type
        daysOfWeek: {
            type: [Number], // Array of day numbers (0 = Sunday, 1 = Monday, etc.)
            required: function() { return this.type === "weekly"; }
        },
        hours: {
            start: {
                type: String, // Format: "HH:MM" (24-hour format)
                required: function() { return this.type === "weekly"; }
            },
            end: {
                type: String, // Format: "HH:MM" (24-hour format)
                required: function() { return this.type === "weekly"; }
            },
        },
        breakTime: {
            start: String, // Format: "HH:MM" (24-hour format)
            end: String,   // Format: "HH:MM" (24-hour format)
        },
        
        // For specific type
        dates: [{
            date: {
                type: Date,
                required: function() { return this.type === "specific"; }
            },
            startTime: {
                type: String, // Format: "HH:MM" (24-hour format)
                required: function() { return this.type === "specific"; }
            },
            endTime: {
                type: String, // Format: "HH:MM" (24-hour format)
                required: function() { return this.type === "specific"; }
            },
            active: {
                type: Boolean,
                default: true,
            }
        }],
        
        // Common for both types
        appointmentDuration: {
            type: Number, // Duration in minutes (e.g., 60 for 1 hour)
            required: true,
            default: 60,
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the Availability Configuration model
const AvailabilityConfig = mongoose.model("availabilityConfigs", AvailabilityConfigSchema);

export { AvailabilitySlot, AvailabilityConfig };

// For backward compatibility
export default AvailabilitySlot;

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    psychologistId: {
      type: String,
      required: true,
    },
    scheduledTime: {
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
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
    payment: {
      amount: Number,
      status: {
        type: String,
        enum: ["Pending", "Paid", "Refunded", "Failed"],
        default: "Pending",
      },
      method: String,
      transactionId: String,
      paidAt: Date,
      refundedAt: Date,
    },
    notes: {
      patient: String, // Notes from patient
      psychologist: String, // Notes from psychologist
      staff: String, // Notes from staff
    },
    lastModifiedBy: {
      userId: String,
      role: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

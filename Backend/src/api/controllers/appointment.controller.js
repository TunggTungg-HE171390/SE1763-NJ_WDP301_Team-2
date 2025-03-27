import Appointment from '../models/appointment.model.js';
import Availability from '../models/availability.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * Get appointment by ID with populated patient and psychologist data
 */
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    
    console.log(`Fetching appointment with ID: ${appointmentId}`);
    
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID format" });
    }
    
    // Find the appointment with populated patient and psychologist data
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    // Populate patient data
    let patient = null;
    if (appointment.patientId) {
      try {
        patient = await User.findById(appointment.patientId).select('fullName email phone avatar');
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    }
    
    // Populate psychologist data
    let psychologist = null;
    if (appointment.psychologistId) {
      try {
        psychologist = await User.findById(appointment.psychologistId)
          .populate('psychologist.psychologistProfile')
          .select('fullName email phone avatar psychologist');
      } catch (err) {
        console.error("Error fetching psychologist data:", err);
      }
    }
    
    // Create a full response object
    const fullAppointment = {
      ...appointment.toObject(),
      patient,
      psychologist
    };
    
    res.status(200).json(fullAppointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Failed to fetch appointment", error: error.message });
  }
};

/**
 * Update appointment status
 */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, note, staffId } = req.body;
    
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    
    // Validate status if provided
    if (status && !["Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled", "No-show"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    // Update status if provided
    if (status) {
      appointment.status = status;
    }
    
    // Update notes if provided
    if (note) {
      if (!appointment.notes) {
        appointment.notes = {};
      }
      
      // Determine which note field to update based on user role
      if (req.user && req.user.role === 'psychologist') {
        appointment.notes.psychologist = note;
      } else if (req.user && req.user.role === 'patient') {
        appointment.notes.patient = note;
      } else {
        // Default to staff
        appointment.notes.staff = note;
      }
    }
    
    // Update last modified info
    appointment.lastModifiedBy = {
      userId: staffId || req.user?._id || 'system',
      role: req.user?.role || 'staff',
      timestamp: new Date()
    };
    
    // If cancelled, update the availability slot as well
    if (status === 'Cancelled') {
      try {
        // Find the associated availability slot
        const slot = await Availability.findOne({
          appointmentId: appointmentId
        });
        
        if (slot) {
          // Free up the slot
          slot.isBooked = false;
          slot.appointmentId = null;
          await slot.save();
          console.log(`Freed up availability slot ${slot._id}`);
        }
      } catch (err) {
        console.error("Error updating availability slot:", err);
      }
    }
    
    await appointment.save();
    
    // Fetch the updated appointment with full data
    const updatedAppointment = await Appointment.findById(appointmentId);
    
    // Populate patient data
    let patient = null;
    if (updatedAppointment.patientId) {
      try {
        patient = await User.findById(updatedAppointment.patientId).select('fullName email phone avatar');
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    }
    
    // Populate psychologist data
    let psychologist = null;
    if (updatedAppointment.psychologistId) {
      try {
        psychologist = await User.findById(updatedAppointment.psychologistId)
          .populate('psychologist.psychologistProfile')
          .select('fullName email phone avatar psychologist');
      } catch (err) {
        console.error("Error fetching psychologist data:", err);
      }
    }
    
    // Create a full response object
    const fullAppointment = {
      ...updatedAppointment.toObject(),
      patient,
      psychologist
    };
    
    res.status(200).json(fullAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Failed to update appointment", error: error.message });
  }
};

/**
 * Get all appointments with pagination and filtering
 */
const getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, patientId, psychologistId, startDate, endDate } = req.query;
    
    // Build query based on filters
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (patientId) {
      query.patientId = patientId;
    }
    
    if (psychologistId) {
      query.psychologistId = psychologistId;
    }
    
    if (startDate || endDate) {
      query['scheduledTime.date'] = {};
      
      if (startDate) {
        query['scheduledTime.date'].$gte = new Date(startDate);
      }
      
      if (endDate) {
        query['scheduledTime.date'].$lte = new Date(endDate);
      }
    }
    
    // Count documents for pagination
    const total = await Appointment.countDocuments(query);
    
    // Fetch appointments with pagination
    const appointments = await Appointment.find(query)
      .sort({ 'scheduledTime.date': -1, 'scheduledTime.startTime': -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    // Populate with minimal data
    const populatedAppointments = await Promise.all(appointments.map(async (appointment) => {
      const patient = await User.findById(appointment.patientId).select('fullName email phone avatar').lean();
      const psychologist = await User.findById(appointment.psychologistId).select('fullName email phone avatar').lean();
      
      return {
        ...appointment.toObject(),
        patient,
        psychologist
      };
    }));
    
    res.status(200).json({
      appointments: populatedAppointments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};

export default {
  getAppointmentById,
  updateAppointmentStatus,
  getAllAppointments
};
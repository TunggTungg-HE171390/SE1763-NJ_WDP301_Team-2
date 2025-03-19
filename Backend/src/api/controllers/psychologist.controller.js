import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Availability from "../models/availability.model.js";
import mongoose from "mongoose";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getPsychologistList = async (req, res) => {
    try {
        // Find all users with role "psychologist"
        const psychologists = await User.find({ role: "psychologist" }).select("-password"); // Exclude password field for security

        res.status(200).json({
            success: true,
            count: psychologists.length,
            data: psychologists,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Controller to fetch unique specializations of psychologists
export const getUniqueSpecializations = async (req, res) => {
    try {
        // Fetch all specializations of psychologists
        const psychologists = await User.find(
            { role: "psychologist" },
            { "psychologist.psychologistProfile.specialization": 1, _id: 0 }
        );

        // Extract specializations and get unique ones
        const specializations = new Set();
        psychologists.forEach((psychologist) => {
            const specialization = psychologist.psychologist?.psychologistProfile?.specialization;
            if (specialization) {
                specializations.add(specialization);
            }
        });

        res.status(200).json({ success: true, data: Array.from(specializations) });
    } catch (error) {
        console.error("Error fetching unique specializations:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export const getPsychologistById = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Find the psychologist by ID and ensure the role is "psychologist"
        const psychologist = await User.findOne({ _id: doctorId, role: "psychologist" }).select("-password");

        if (!psychologist) {
            return res.status(404).json({
                success: false,
                message: "Psychologist not found",
            });
        }

        res.status(200).json({
            success: true,
            data: psychologist,
        });
    } catch (error) {
        console.error("Error fetching psychologist by ID:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const saveAppointment = async (req, res) => {
    // Use multer to handle multipart form data
    upload.fields([
        { name: "symptoms", maxCount: 1 },
        { name: "images", maxCount: 3 },
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error handling file upload", error: err });
        }
        try {
            const { userId, psychologistId, scheduleId, symptoms } = req.body;

            if (!userId || !psychologistId || !scheduleId || !symptoms) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Validate ObjectIds
            if (
                !mongoose.Types.ObjectId.isValid(userId) ||
                !mongoose.Types.ObjectId.isValid(psychologistId) ||
                !mongoose.Types.ObjectId.isValid(scheduleId)
            ) {
                return res.status(400).json({ message: "Invalid ID format" });
            }

            // Fetch schedule details
            const availability = await Availability.findById(scheduleId);
            if (!availability) {
                return res.status(404).json({ message: "Schedule not found" });
            }

            // Create new appointment
            const newAppointment = new Appointment({
                patientId: userId,
                psychologistId,
                scheduledTime: {
                    date: availability.date,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                },
                status: "Pending",
                note: symptoms,
            });

            // Save to database
            const savedAppointment = await newAppointment.save();

            res.status(201).json({
                message: "Appointment booked successfully!",
                appointmentId: savedAppointment._id,
            });
        } catch (error) {
            console.error("Error saving appointment:", error);
            res.status(500).json({ message: "Server error. Please try again later." });
        }
    });
};

export const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params; // Get the appointment ID from request params

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId).populate("patientId psychologistId");

        // If appointment not found, return an error
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Return the found appointment
        res.status(200).json(appointment);
    } catch (error) {
        // Handle any errors that occur during the query
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the appointment" });
    }
};

// Enhanced version for staff usage
export const getAllPsychologists = async (req, res) => {
  try {
    // Find all users with role "psychologist"
    const psychologists = await User.find({ role: "psychologist" }).lean();
    
    if (!psychologists || psychologists.length === 0) {
      return res.status(404).json({ message: "No psychologists found" });
    }

    // Format the response data with more details for staff
    const formattedPsychologists = psychologists.map(user => ({
      _id: user._id,
      email: user.email || null,
      fullName: user.fullName || null,
      gender: user.gender || null,
      address: user.address || null,
      phone: user.phone || null,
      dob: user.dob || null,
      profileImg: user.profileImg || null,
      status: user.status || "Active",
      createdAt: user.createdAt,
      psychologistProfile: user.psychologist?.psychologistProfile || null,
      isEmailVerified: user.isEmailVerified || false,
      isPhoneVerified: user.isPhoneVerified || false
    }));

    res.status(200).json({ 
      message: "Psychologists retrieved successfully", 
      count: formattedPsychologists.length,
      psychologists: formattedPsychologists 
    });
  } catch (error) {
    console.error("Error fetching psychologists: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add or update psychologist medical experience
export const updatePsychologistExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicalExperience } = req.body;

    if (!medicalExperience || !Array.isArray(medicalExperience)) {
      return res.status(400).json({ 
        message: "Medical experience must be provided as an array" 
      });
    }

    // Find user and verify role
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "Psychologist not found" });
    }
    
    if (user.role !== "psychologist") {
      return res.status(400).json({ message: "User is not a psychologist" });
    }
    
    // Make sure psychologist profile exists
    if (!user.psychologist || !user.psychologist.psychologistProfile) {
      user.psychologist = {
        psychologistProfile: {
          professionalLevel: "Not specified",
          educationalLevel: "Not specified",
          specialization: "Not specified",
          rating: 0,
          numberOfRatings: 0,
          appointmentsAttended: 0,
          consultationsCount: 0,
          medicalExperience: [],
          workHistory: []
        }
      };
    }
    
    // Update medical experience
    user.psychologist.psychologistProfile.medicalExperience = medicalExperience;
    
    await user.save();
    
    res.status(200).json({
      message: "Medical experience updated successfully",
      medicalExperience: user.psychologist.psychologistProfile.medicalExperience
    });
    
  } catch (error) {
    console.error("Error updating psychologist experience:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add or update psychologist work history
export const updatePsychologistWorkHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { workHistory } = req.body;

    if (!workHistory || !Array.isArray(workHistory)) {
      return res.status(400).json({ 
        message: "Work history must be provided as an array" 
      });
    }

    // Find user and verify role
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "Psychologist not found" });
    }
    
    if (user.role !== "psychologist") {
      return res.status(400).json({ message: "User is not a psychologist" });
    }
    
    // Make sure psychologist profile exists
    if (!user.psychologist || !user.psychologist.psychologistProfile) {
      user.psychologist = {
        psychologistProfile: {
          professionalLevel: "Not specified",
          educationalLevel: "Not specified",
          specialization: "Not specified",
          rating: 0,
          numberOfRatings: 0,
          appointmentsAttended: 0,
          consultationsCount: 0,
          medicalExperience: [],
          workHistory: []
        }
      };
    }
    
    // Update work history
    user.psychologist.psychologistProfile.workHistory = workHistory;
    
    await user.save();
    
    res.status(200).json({
      message: "Work history updated successfully",
      workHistory: user.psychologist.psychologistProfile.workHistory
    });
    
  } catch (error) {
    console.error("Error updating psychologist work history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update entire psychologist profile
export const updatePsychologistProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      professionalLevel,
      educationalLevel,
      specialization,
      medicalExperience,
      workHistory
    } = req.body;

    // Find user and verify role
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "Psychologist not found" });
    }
    
    if (user.role !== "psychologist") {
      return res.status(400).json({ message: "User is not a psychologist" });
    }

    // Make sure psychologist profile exists
    if (!user.psychologist || !user.psychologist.psychologistProfile) {
      user.psychologist = {
        psychologistProfile: {
          professionalLevel: "Not specified",
          educationalLevel: "Not specified",
          specialization: "Not specified",
          rating: 0,
          numberOfRatings: 0,
          appointmentsAttended: 0,
          consultationsCount: 0,
          medicalExperience: [],
          workHistory: []
        }
      };
    }
    
    // Update profile fields if provided
    if (professionalLevel) user.psychologist.psychologistProfile.professionalLevel = professionalLevel;
    if (educationalLevel) user.psychologist.psychologistProfile.educationalLevel = educationalLevel;
    if (specialization) user.psychologist.psychologistProfile.specialization = specialization;
    
    if (medicalExperience && Array.isArray(medicalExperience)) {
      user.psychologist.psychologistProfile.medicalExperience = medicalExperience;
    }
    
    if (workHistory && Array.isArray(workHistory)) {
      user.psychologist.psychologistProfile.workHistory = workHistory;
    }
    
    await user.save();
    
    res.status(200).json({
      message: "Psychologist profile updated successfully",
      psychologistProfile: user.psychologist.psychologistProfile
    });
    
  } catch (error) {
    console.error("Error updating psychologist profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
    getPsychologistList,
    getUniqueSpecializations,
    getPsychologistById,
    saveAppointment,
    getAppointmentById,
    getAllPsychologists,
    updatePsychologistExperience,
    updatePsychologistWorkHistory,
    updatePsychologistProfile
};

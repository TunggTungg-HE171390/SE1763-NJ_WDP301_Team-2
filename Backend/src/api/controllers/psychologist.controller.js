import User from "../models/user.model.js";

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

export default {
    getPsychologistList,
    getUniqueSpecializations,
    getPsychologistById,
};

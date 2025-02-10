<<<<<<< HEAD
import Users from "../models/user.model.js";

const findAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    next(error); 
  }
};

export default { 
  findAllUsers 
};
=======
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const createInvalidUser = async () => {
    const invalidUser = new User({
        fullName: "Invalid User",
        email: "invalid@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "admin", // Invalid role for 'patient' field
        patient: {
            medicalProfile: {
                issue: "Headache",
                diagnose: "Migraine",
                therapeuticGoal: "Reduce pain",
                psychosocialHistory: "No major concerns",
                note: "Patient reports stress",
            },
        },
    });

    try {
        await invalidUser.save();
    } catch (error) {
        console.log("Error creating user:", error.message); // Will show: Medical profile is only allowed for 'patient' role.
    }
};

const createValidUser = async () => {
    const validUser = new User({
        fullName: "Valid Psychologist",
        email: "validpsychologist@example.com",
        password: await bcrypt.hash("securepassword123", 10),
        gender: "Male",
        address: "123 Main St, Cityville",
        dob: new Date("1985-06-15"),
        role: "psychologist",
        psychologist: {
            psychologistProfile: {
                professionalLevel: "Senior",
                educationalLevel: "PhD in Clinical Psychology",
                specialization: "Cognitive Behavioral Therapy",
                rating: 4.8,
            },
        },
    });

    try {
        await validUser.save();
        console.log("Valid user created successfully!");
    } catch (error) {
        console.log("Error creating user:", error.message);
    }
};

export default { createInvalidUser, createValidUser };
>>>>>>> main

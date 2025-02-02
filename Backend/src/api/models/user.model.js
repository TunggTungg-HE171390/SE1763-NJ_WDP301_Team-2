import mongoose, { Schema } from "mongoose";

// Medical profile schema for patients
const MedicalProfileSchema = new Schema(
    {
        issue: { type: String, required: true },
        diagnose: { type: String, required: true },
        therapeuticGoal: { type: String, required: true },
        psychosocialHistory: { type: String, required: true },
        note: { type: String, required: true },
    },
    { _id: false } // Prevent creating an ID for this subdocument
);

// Psychologist schema for psychologists
const PsychologistProfileSchema = new Schema(
    {
        professionalLevel: { type: String, required: true },
        educationalLevel: { type: String, required: true },
        specialization: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    { _id: false } // Prevent creating an ID for this subdocument
);

// Main User schema
const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        profileImg: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        role: {
            type: String,
            enum: ["admin", "manager", "patient", "psychologist"],
            required: true,
        },
        patient: {
            medicalProfile: MedicalProfileSchema,
            validate: {
                validator: function (value) {
                    // Only allow 'patient' role to have medicalProfile
                    return this.role === "patient" ? !!value : true;
                },
                message: "Medical profile is only allowed for 'patient' role.",
            },
        },
        psychologist: {
            psychologistProfile: PsychologistProfileSchema,
            validate: {
                validator: function (value) {
                    // Only allow 'psychologist' role to have psychologistProfile
                    return this.role === "psychologist" ? !!value : true;
                },
                message: "Psychologist profile is only allowed for 'psychologist' role.",
            },
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the User model
const User = mongoose.model("User", UserSchema);

export default User;

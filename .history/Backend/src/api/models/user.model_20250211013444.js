import mongoose, { Schema } from "mongoose";
import { type } from "os";

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
        phone: {
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
<<<<<<< HEAD
            type: Object,
            medicalProfile: MedicalProfileSchema,
            validate: {
                validator: function (value) {
                    // Only allow 'patient' role to have medicalProfile
                    return this.role === "patient" ? !!value : true;
=======
            type: new Schema(
                {
                    medicalProfile: { type: MedicalProfileSchema, required: true },
>>>>>>> main
                },
                { _id: false }
            ),
            required: function () {
                return this.role === "patient";
            },
        },
        psychologist: {
<<<<<<< HEAD
            type: Object,
            psychologistProfile: PsychologistProfileSchema,
            validate: {
                validator: function (value) {
                    // Only allow 'psychologist' role to have psychologistProfile
                    return this.role === "psychologist" ? !!value : true;
=======
            type: new Schema(
                {
                    psychologistProfile: { type: PsychologistProfileSchema, required: true },
>>>>>>> main
                },
                { _id: false }
            ),
            required: function () {
                return this.role === "psychologist";
            },
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// 🔥 Add validation hook to enforce structure 🔥
UserSchema.pre("save", function (next) {
    if (this.role === "patient" && !this.patient) {
        return next(new Error("A patient must have a medical profile."));
    }

    if (this.role === "psychologist" && !this.psychologist) {
        return next(new Error("A psychologist must have a psychologist profile."));
    }

    if ((this.role === "admin" || this.role === "manager") && (this.patient || this.psychologist)) {
        return next(new Error(`Users with role '${this.role}' cannot have patient or psychologist profiles.`));
    }

    next();
});

// Create the User model
const User = mongoose.model("User", UserSchema);

export default User;

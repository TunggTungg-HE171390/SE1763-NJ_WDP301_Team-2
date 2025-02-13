import User from "../models/user.model.js";
import { generateVerificationCode } from "../utils/auth.js";
import sendVerificationEmail from "../utils/email.js";
import { sendVerificationSMS } from "../utils/phone.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

const findAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { contact, name, password } = req.body;

        // Check if the contact is an email or phone number
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        const isPhone = /^\+?[1-9]\d{1,14}$/.test(contact); // Supports international phone format

        if (!isEmail && !isPhone) {
            return res.status(400).json({ message: "Invalid email or phone number format" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne(isEmail ? { email: contact } : { phone: contact });
        if (existingUser) {
            return res.status(400).json({ message: "This contact is already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();

        // Create new user object
        const newUser = new User({
            email: isEmail ? contact : undefined, // Ensure email is set
            phone: isPhone ? contact : undefined, // Ensure phone is set
            fullName: name,
            password: hashedPassword,
            isEmailVerified: false,
            emailVerificationCode: isEmail ? verificationCode : null,
            phoneVerificationCode: isPhone ? verificationCode : null,
        });

        // Assign email or phone field dynamically
        if (isEmail) newUser.email = contact;
        if (isPhone) newUser.phone = contact;

        // Save user
        await newUser.save();

        // Send OTP via email or SMS
        if (isEmail) {
            sendVerificationEmail(contact, verificationCode)
                .then(() => console.log("Email sent successfully"))
                .catch((error) => console.error("Failed to send email:", error));
        } else if (isPhone) {
            sendVerificationSMS(contact, verificationCode) // Implement this function with an SMS service
                .then(() => console.log("SMS sent successfully"))
                .catch((error) => console.error("Failed to send SMS:", error));
        }

        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// User login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Verify User (Persistent Login)
export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default {
    registerUser,
    loginUser,
    verifyToken,
    findAllUsers,
};

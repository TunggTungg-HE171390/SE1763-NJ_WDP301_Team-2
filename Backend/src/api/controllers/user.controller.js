import User from "../models/user.model.js";
import { generateVerificationCode } from "../utils/auth.js";
import Email from "../utils/email.js";
import { sendVerificationSMS } from "../utils/phone.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const API_KEY = process.env.GPT_API_KEY;
const MODEL = process.env.MODEL;

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
        const existingUser = await User.findOne({
            $or: [{ email: contact }, { phone: contact }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "This email or phone number is already in use" });
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
            Email.sendVerificationEmail(contact, verificationCode)
                .then(() => console.log("Email sent successfully"))
                .catch((error) => console.error("Failed to send email:", error));
        } else if (isPhone) {
            sendVerificationSMS(contact, verificationCode) // Implement this function with an SMS service
                .then(() => console.log("SMS sent successfully"))
                .catch((error) => console.error("Failed to send SMS:", error));
        }

        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// User login
export const loginUser = async (req, res) => {
    try {
        const { contact, password } = req.body;

        // Determine if contact is an email or phone number
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        const isPhone = /^\+?[1-9]\d{1,14}$/.test(contact);

        if (!isEmail && !isPhone) {
            return res.status(400).json({ message: "Invalid email or phone number format" });
        }

        // Find user by email or phone
        const user = await User.findOne(isEmail ? { email: contact } : { phone: contact });

        if (!user) {
            return res.status(400).json({ message: "Invalid email/phone or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email/phone or password" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Verify User (Persistent Login)
export const verifyOTP = async (req, res) => {
    try {
        const { contact, otp } = req.body;

        const user = await User.findOne({
            $or: [{ email: contact }, { phone: contact }],
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the OTP matches
        const isEmail = user.email === contact;
        const storedOTP = isEmail ? user.emailVerificationCode : user.phoneVerificationCode;

        if (!storedOTP || storedOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Update verification status and clear OTP
        if (isEmail) {
            user.isEmailVerified = true;
            user.emailVerificationCode = null;
        } else {
            user.isPhoneVerified = true;
            user.phoneVerificationCode = null;
        }

        await user.save();
        res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { contact } = req.body;

        if (!contact) {
            return res.status(400).json({ message: "Contact (email or phone) is required" });
        }

        // Find the user by email or phone
        const user = await User.findOne({ $or: [{ email: contact }, { phone: contact }] });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a new OTP
        const newOTP = generateVerificationCode();

        if (user.email === contact) {
            user.emailVerificationCode = newOTP;
        } else if (user.phone === contact) {
            user.phoneVerificationCode = newOTP;
        }

        await user.save();

        // Send OTP via email or SMS
        if (user.email === contact) {
            await Email.sendVerificationEmail(contact, newOTP);
        } else if (user.phone === contact) {
            await sendVerificationSMS(contact, newOTP);
        }

        return res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error("Error resending OTP: ", error);
        res.status(500).json({ message: "Server error" });
    }
};

// AI Chat Function
export const chatWithAI = async (req, res) => {
    try {
        let conversationHistory = [{ role: "system", content: "You are a helpful assistant." }];
        const { userMessage } = req.body;

        if (!userMessage) {
            return res.status(400).json({ message: "User message is required" });
        }

        // Add user message to history
        conversationHistory.push({ role: "user", content: userMessage });

        // Call AI API
        const response = await fetch("https://api.yescale.io/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: conversationHistory,
                max_tokens: 1000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) throw new Error("Error fetching response from OpenAI API");

        const data = await response.json();
        const aiMessage = data.choices[0].message.content.trim();

        // Add AI response to history
        conversationHistory.push({ role: "assistant", content: aiMessage });

        res.json({ aiMessage });
    } catch (error) {
        console.error("Chat error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendEmail = async (req, res) => {
    try {
        const { email, subject, content } = req.body;

        if (!email || !content) {
            return res.status(400).json({ message: "Email and content are required" });
        }

        // Send the email
        await Email.sendCustomEmail(email, subject, content);

        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    findAllUsers,
    chatWithAI,
    sendEmail,
};

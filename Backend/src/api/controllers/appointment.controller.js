import Appointment from "../models/appointment.model.js";
import Availability from "../models/availability.model.js";
import { cancelPaymentLink, checkPaymentStatus } from "../services/payOS.service.js";
import { createMeetURL } from "../services/googleCalendar.service.js";
import { createZoomMeeting } from "../services/zoom.service.js";
import Email from "../utils/email.js";
import PayOS from "@payos/node";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { MailService } from "../services/index.js";
import actions from "../actions/requestController.action.js";

dotenv.config();

const clientId = process.env.PAYOS_CLIENT_ID;
const apiKey = process.env.PAYOS_API_KEY;
const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

const payOS = new PayOS(clientId, apiKey, checksumKey);

const paymentTimers = new Map(); // Global Map to store timers
const paymentCheckIntervals = new Map();

export const createPaymentLink = async (req, res) => {
    try {
        const { amount, description, items } = req.body;
        const orderCode = Number(String(Date.now()).slice(-6));

        // Validate required fields
        if (!amount || !description || !items || items.length === 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Thời gian hết hạn (15 phút từ thời điểm hiện tại)
        const expiredAt = Math.floor(Date.now() / 1000) + 4880 * 60; // Unix Timestamp

        const body = {
            orderCode,
            amount,
            description,
            items,
            expiredAt,
            returnUrl: "https://tamgiao.github.io/tamgiao/",
            cancelUrl: "https://tamgiao.github.io/tamgiao/#/CategoryTestSelected",
        };

        // Create payment link
        const paymentResponse = await payOS.createPaymentLink(body);

        if (!paymentResponse || !paymentResponse.checkoutUrl) {
            return res.status(500).json({ message: "Failed to generate payment link" });
        }

        res.status(201).send(paymentResponse);
    } catch (error) {
        console.error("Error creating payment link:", error);
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};

export const checkPaymentStatusAPI = async (req, res) => {
    try {
        const { orderCode } = req.body;

        if (!orderCode) {
            return res.status(400).json({ message: "Missing orderCode" });
        }

        const paymentStatus = await payOS.getPaymentLinkInformation(orderCode);

        if (!paymentStatus) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ status: paymentStatus.status });
    } catch (error) {
        console.error("Error checking payment status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const updateData = req.body;

        // Find and update the appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { $set: updateData },
            { new: true, runValidators: true } // Return the updated document and apply schema validation
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const waitForPayment = async (req, res) => {
    try {
        const { appointmentId, scheduleId, expiredAt } = req.body;

        if (!appointmentId || !scheduleId || !expiredAt) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = expiredAt - currentTime;

        if (timeRemaining <= 0) {
            return res.status(400).json({ message: "Expiration time must be in the future" });
        }

        console.log(`Starting payment check... Appointment ID: ${appointmentId}, Expires in: ${timeRemaining} seconds`);

        // Run the check every x seconds
        const interval = setInterval(() => checkPayment(appointmentId, scheduleId, expiredAt), 10 * 1000);

        // Store the interval reference
        paymentCheckIntervals.set(appointmentId, interval);

        res.status(200).json({ message: "Payment check started", expiresIn: timeRemaining });
    } catch (error) {
        console.error("Error in waitForPayment function:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status === "Confirmed") {
            return res.status(400).json({ message: "Appointment is already confirmed" });
        }

        // Mark as confirmed
        appointment.status = "Confirmed";
        await appointment.save();

        // Cancel expiration timer
        if (paymentTimers.has(appointmentId)) {
            clearTimeout(paymentTimers.get(appointmentId)); // Cancel the timer
            paymentTimers.delete(appointmentId); // Remove from active timers
            console.log(`Payment received. Timer cleared for Appointment ${appointmentId}`);
        }

        res.status(200).json({ message: "Payment confirmed, appointment booked" });
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const cancelPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ message: "Missing appointmentId" });
        }

        // Find the appointment to get the associated availabilityId
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const scheduleId = appointment.availabilityId; // Get availabilityId from the appointment
        const orderCode = appointment.paymentInformation.orderCode;

        cancelPaymentLink(orderCode);

        // Update the appointment status to "Cancelled"
        appointment.status = "Cancelled";
        appointment.paymentInformation.status = "CANCELLED";
        await appointment.save();

        // Update the availability slot's `isBooked` to false
        const availability = await Availability.findByIdAndUpdate(scheduleId, { isBooked: false }, { new: true });

        if (!availability) {
            return res.status(404).json({ message: "Availability slot not found" });
        }

        if (paymentTimers.has(appointmentId)) {
            clearTimeout(paymentTimers.get(appointmentId)); // Cancel the timer
            paymentTimers.delete(appointmentId); // Remove from active timers
            console.log(`Payment cancelled. Timer cleared for Appointment ${appointmentId}`);
        }

        return res.status(200).json({ message: "Payment canceled successfully", appointment, availability });
    } catch (error) {
        console.error("Error canceling payment:", error);
        return res.status(500).json({ message: "An error occurred while canceling payment" });
    }
};

export const checkPendingAppointmentByUserId = async (req, res) => {
    try {
        const { userId, maxPendingLimit } = req.body; // Get userId and maxPendingLimit from request body

        if (!userId || !maxPendingLimit) {
            return res.status(400).json({ message: "Missing userId or maxPendingLimit" });
        }

        // Count pending appointments for the user
        const pendingCount = await Appointment.countDocuments({
            patientId: userId,
            status: "Pending",
        });

        // Check if they can book more
        const canBookMore = pendingCount < parseInt(maxPendingLimit, 10);

        res.json({
            pendingCount,
            canBookMore,
            message: canBookMore
                ? "User can book more appointments."
                : "User has reached the pending appointment limit.",
        });
    } catch (error) {
        console.error("Error checking pending appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAppointmentListByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from request params

        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        // Fetch all appointments for the given patientId
        const appointments = await Appointment.find({ patientId: userId })
            .populate("psychologistId", "fullName email gender phone") // Populate psychologist details
            .populate("availabilityId") // Populate availability details
            .sort({ createdAt: -1 }); // Sort by latest appointments

        return res.status(200).json({ message: "Appointments retrieved successfully", appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({ message: "An error occurred while fetching appointments" });
    }
};

const checkPayment = async (appointmentId, scheduleId, expiredAt) => {
    try {
        const appointment = await Appointment.findById(appointmentId).populate("patientId psychologistId");

        if (!appointment) {
            console.log(`Appointment ${appointmentId} not found`);
            clearInterval(paymentCheckIntervals.get(appointmentId));
            paymentCheckIntervals.delete(appointmentId);
            return;
        }

        if (!appointment.paymentInformation || !appointment.paymentInformation.orderCode) {
            console.log(`No orderCode found for appointment ${appointmentId}`);
            return;
        }

        const { orderCode } = appointment.paymentInformation;
        const paymentStatus = await checkPaymentStatus(orderCode);

        if (paymentStatus.status === "PAID") {
            if (appointment.status !== "Confirmed") {
                appointment.status = "Confirmed";
                appointment.paymentInformation.status = "PAID";

                const meeting = await createZoomMeeting("Tu van tam ly", appointment.scheduledTime.startTime, 60);

                const browserUrl = meeting.join_url.replace(/\/j\/(\d+)/, "/wc/join/$1");
                console.log("", browserUrl);
                appointment.meetingURL = browserUrl;

                await appointment.save();

                const subject = "Thông báo lịch hẹn khám của bạn"; // Email subject
                const content = `
                <h3>Thông báo về lịch hẹn khám</h3>
                <p>Chào ${appointment.patientId.fullName},</p>
                <p>Chúng tôi xin thông báo về lịch hẹn khám của bạn với chuyên gia ${
                    appointment.psychologistId.fullName
                }.</p>
                <p><strong>Thông tin lịch hẹn:</strong></p>
                <p><strong>Ngày:</strong> ${new Date(appointment.scheduledTime.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                })}</p> 
                <p><strong>Giờ:</strong> ${new Date(appointment.scheduledTime.startTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })} đến ${new Date(appointment.scheduledTime.endTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })}</p>
                <p><strong>Chuyên gia tư vấn:</strong> ${appointment.psychologistId.fullName}</p>
                <p><strong>Hình thức:</strong> Tư vấn trực tuyến</p>
                <p><strong>Giá tiền:</strong> 350.000 đ</p>
                <p>Vui lòng chuẩn bị trước 10 phút và đảm bảo kết nối internet ổn định cho buổi tư vấn trực tuyến.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ hỗ trợ</p>
            `;

                await Email.sendCustomEmail(appointment.patientId.email, subject, content);

                console.log(`Appointment ${appointmentId} confirmed as paid.`);
            }

            clearInterval(paymentCheckIntervals.get(appointmentId));
            paymentCheckIntervals.delete(appointmentId);
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        if (now >= expiredAt) {
            appointment.status = "Cancelled";
            appointment.paymentInformation.status = "EXPIRED";
            await appointment.save();

            const availability = await Availability.findById(scheduleId);
            if (availability) {
                availability.isBooked = false;
                await availability.save();
            }

            console.log(`Appointment ${appointmentId} expired. Schedule ${scheduleId} is now available.`);
            clearInterval(paymentCheckIntervals.get(appointmentId));
            paymentCheckIntervals.delete(appointmentId);
        }
    } catch (error) {
        console.error(`Error checking payment for appointment ${appointmentId}:`, error);
    }
};

export const createMeetUrlAPI = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ message: "Missing required appointmentId" });
        }

        const appointment = await Appointment.findById(appointmentId).populate("patientId psychologistId");

        if (!appointment) {
            console.log(`Appointment ${appointmentId} not found`);
            clearInterval(paymentCheckIntervals.get(appointmentId));
            paymentCheckIntervals.delete(appointmentId);
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (!appointment.patientId || !appointment.psychologistId) {
            return res.status(500).json({ message: "Appointment data is incomplete" });
        }

        const meetDetails = {
            clientName: appointment.patientId.fullName,
            clientEmail: appointment.patientId.email,
            description: `Consultation with ${appointment.psychologistId.fullName}`,
            startDate: appointment.scheduledTime.date.toISOString().split("T")[0], // YYYY-MM-DD
            startTime: appointment.scheduledTime.startTime, // HH:mm format
            endTime: appointment.scheduledTime.endTime, // HH:mm format
        };

        // Generate Meet URL
        const meetURL = await createMeetURL(meetDetails);

        if (!meetURL || meetURL === "No Meet URL generated") {
            return res.status(500).json({ message: "Failed to generate Meet URL" });
        }

        return res.status(200).json({ meetURL });
    } catch (error) {
        console.error(`Error creating Meet URL:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserAppointmentById = async (req, res) => {
    const { userId, appointmentId } = req.body;

    try {
        // Find the appointment and ensure it belongs to the given userId
        const appointment = await Appointment.findOne({ _id: appointmentId, patientId: userId }).populate(
            "psychologistId",
            "email fullName phone gender profileImg psychologist"
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or does not belong to the user" });
        }

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const createZoomMeetingAPI = async (req, res) => {
    try {
        // Extract parameters from request body
        const { topic, startTime, duration } = req.body;

        // Basic validation
        if (!topic || !duration || !startTime) {
            return res.status(400).json({ error: "Invalid info" });
        }

        // Create Zoom meeting
        const meeting = await createZoomMeeting(topic, startTime, duration);

        // Return success response
        return res.status(201).json({
            message: "Zoom meeting created successfully",
            meetingDetails: {
                meetingId: meeting.id,
                topic: meeting.topic,
                startTime: meeting.start_time,
                duration: meeting.duration,
                joinUrl: meeting.join_url,
                hostUrl: meeting.start_url,
            },
        });
    } catch (error) {
        console.error("Error creating Zoom meeting:", error);
        return res.status(500).json({
            error: "Failed to create Zoom meeting",
            details: error.message,
        });
    }
};

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
                patient = await User.findById(appointment.patientId).select("fullName email phone avatar");
            } catch (err) {
                console.error("Error fetching patient data:", err);
            }
        }

        // Populate psychologist data
        let psychologist = null;
        if (appointment.psychologistId) {
            try {
                psychologist = await User.findById(appointment.psychologistId)
                    .populate("psychologist.psychologistProfile")
                    .select("fullName email phone avatar psychologist");
            } catch (err) {
                console.error("Error fetching psychologist data:", err);
            }
        }

        // Create a full response object
        const fullAppointment = {
            ...appointment.toObject(),
            patient,
            psychologist,
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
            if (req.user && req.user.role === "psychologist") {
                appointment.notes.psychologist = note;
            } else if (req.user && req.user.role === "patient") {
                appointment.notes.patient = note;
            } else {
                // Default to staff
                appointment.notes.staff = note;
            }
        }

        // Update last modified info
        appointment.lastModifiedBy = {
            userId: staffId || req.user?._id || "system",
            role: req.user?.role || "staff",
            timestamp: new Date(),
        };

        // If cancelled, update the availability slot as well
        if (status === "Cancelled") {
            try {
                // Find the associated availability slot
                const slot = await Availability.findOne({
                    appointmentId: appointmentId,
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
                patient = await User.findById(updatedAppointment.patientId).select("fullName email phone avatar");
            } catch (err) {
                console.error("Error fetching patient data:", err);
            }
        }

        // Populate psychologist data
        let psychologist = null;
        if (updatedAppointment.psychologistId) {
            try {
                psychologist = await User.findById(updatedAppointment.psychologistId)
                    .populate("psychologist.psychologistProfile")
                    .select("fullName email phone avatar psychologist");
            } catch (err) {
                console.error("Error fetching psychologist data:", err);
            }
        }

        // Create a full response object
        const fullAppointment = {
            ...updatedAppointment.toObject(),
            patient,
            psychologist,
        };

        res.status(200).json(fullAppointment);
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Failed to update appointment", error: error.message });
    }
};

export const saveAppointment = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error parsing form data", error: err });
        }

        try {
            const { patientId, psychologistId, scheduleId, symptoms } = req.body;

            if (!patientId || !psychologistId || !scheduleId || !symptoms) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Validate ObjectIds
            if (
                !mongoose.Types.ObjectId.isValid(patientId) ||
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

            // Check if the schedule is already booked
            if (availability.isBooked) {
                return res.status(400).json({ message: "Schedule already booked" });
            }

            // 🛑 Check for appointment conflicts
            const confirmedAppointments = await Appointment.find({
                patientId,
                status: "Confirmed",
                "scheduledTime.date": availability.date, // Only check on the same date
            });

            const hasConflict = confirmedAppointments.some((appointment) => {
                return (
                    (availability.startTime >= appointment.scheduledTime.startTime &&
                        availability.startTime < appointment.scheduledTime.endTime) ||
                    (availability.endTime > appointment.scheduledTime.startTime &&
                        availability.endTime <= appointment.scheduledTime.endTime) ||
                    (availability.startTime <= appointment.scheduledTime.startTime &&
                        availability.endTime >= appointment.scheduledTime.endTime)
                );
            });

            if (hasConflict) {
                return res.status(400).json({ message: "You already have a confirmed appointment at this time." });
            }

            // ✅ No conflicts, proceed with booking
            availability.isBooked = true;
            await availability.save();

            const psychologist = await User.findById(psychologistId);
            if (!psychologist) {
                return res.status(404).json({ message: "Psychologist not found" });
            }

            const patient = await User.findById(patientId);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }

            // Create new appointment
            const newAppointment = new Appointment({
                patientId: patientId,
                psychologistId,
                availabilityId: availability.id,
                scheduledTime: {
                    date: availability.date,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                },
                status: "Pending",
                isRescheduled: false,
                note: symptoms,
                notes: {
                    patient: symptoms, // Store patient symptoms as notes
                    psychologist: null, // Initialize psychologist notes as null
                },
                lastModifiedBy: {
                    userId: patientId,
                    role: "patient",
                    timestamp: new Date(),
                }
            });

            // Save to database
            const savedAppointment = await newAppointment.save();

            // Update availability with the appointment ID
            availability.appointmentId = savedAppointment._id;
            await availability.save();

            // Set expiration time (5 minutes from now)
            const expiredAt = Math.floor(Date.now() / 1000) + 1 * 60; // Unix Timestamp

            const paymentBody = {
                amount: 5000,
                description: "Tu van truc tuyen",
                items: [
                    {
                        name: `Buổi tư vấn với tư vấn viên ${psychologist.fullName}`,
                        quantity: 1,
                        price: 5000,
                    },
                ],
                expiredAt,
            };

            const paymentInfo = await createPaymentLink(paymentBody);
            savedAppointment.paymentInformation = paymentInfo;
            await savedAppointment.save();

            res.status(201).json({
                message: "Appointment booked successfully!",
                appointmentId: savedAppointment._id,
                expiredAt,
            });
        } catch (error) {
            console.error("Error saving appointment:", error);
            res.status(500).json({ message: "Server error. Please try again later." });
        }
    });
};

export const updateNotes = async (appointmentId, notes) => {
    try {
        console.log(`Updating notes for appointment ID: ${appointmentId}`);
        
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        
        // Make sure notes object exists
        if (!appointment.notes) {
            appointment.notes = {};
        }
        
        // Update psychologist notes
        appointment.notes.psychologist = notes;
        
        // Update last modified info
        appointment.lastModifiedBy = {
            userId: "system", // This should ideally be the psychologist's ID
            role: "psychologist",
            timestamp: new Date(),
        };
        
        await appointment.save();
        
        return appointment;
    } catch (error) {
        console.error(`Error updating notes for appointment ${appointmentId}:`, error);
        throw error;
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
            query["scheduledTime.date"] = {};

            if (startDate) {
                query["scheduledTime.date"].$gte = new Date(startDate);
            }

            if (endDate) {
                query["scheduledTime.date"].$lte = new Date(endDate);
            }
        }

        // Count documents for pagination
        const total = await Appointment.countDocuments(query);

        // Fetch appointments with pagination
        const appointments = await Appointment.find(query)
            .sort({ "scheduledTime.date": -1, "scheduledTime.startTime": -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Populate with minimal data
        const populatedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                const patient = await User.findById(appointment.patientId).select("fullName email phone avatar").lean();
                const psychologist = await User.findById(appointment.psychologistId)
                    .select("fullName email phone avatar")
                    .lean();

                return {
                    ...appointment.toObject(),
                    patient,
                    psychologist,
                };
            })
        );

        res.status(200).json({
            appointments: populatedAppointments,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
    }
};

const findScheduleByPsychologistId = async (req, res, next) => {
    try {
        const scheduleByPsychologistId = await Appointment.find({ psychologistId: req.params.psychologistId })
            .populate("patientId", "fullName email phone")
            .populate("psychologistId", "fullName -_id")
            .exec();

        const psychologistData = scheduleByPsychologistId.map((psychologist) => ({
            psychologistId: req.params.psychologistId,
            psychologistName: psychologist.fullName,
            patientProfile: {
                patientId: psychologist.patientId._id,
                patientName: psychologist.patientId.fullName,
                email: psychologist.patientId.email,
                phone: psychologist.patientId.phone,
            },
            scheduleTime: {
                startTime: psychologist.scheduledTime.startTime,
                endTime: psychologist.scheduledTime.endTime,
                date: psychologist.scheduledTime.date,
            },
            status: psychologist.status,
            note: psychologist.note,
        }));

        res.json(psychologistData);
    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

const getStatusRescheduleByUser = async (req, res, next) => {
    try {
        const getStatusRescheduleByUser = await Appointment.find({ isRescheduled: true })
            .populate("patientId", "fullName email phone")
            .populate("psychologistId", "fullName email")
            .exec();

        const getAppointmentRescheduleList = getStatusRescheduleByUser.map((appointment) => ({
            patientProfile: {
                patientId: appointment.patientId?._id || null,
                patientName: appointment.patientId?.fullName || "Unknown",
                email: appointment.patientId?.email || "Unknown",
            },
            scheduleTime: {
                startTime: appointment.scheduledTime?.startTime || "N/A",
                endTime: appointment.scheduledTime?.endTime || "N/A",
                date: appointment.scheduledTime?.date || "N/A",
            },
            status: appointment.status || "Unknown",
            note: appointment.note || "No notes",
            isRescheduled: appointment.isRescheduled,
        }));

        res.json(getAppointmentRescheduleList);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc hẹn: ", error);
        next(error);
    }
};

const getAllAppointment = async (req, res, next) => {
    try {
        const allAppointment = await Appointment.find({});

        res.json(allAppointment);
    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

const getDetailAppointmentId = async (req, res, next) => {
    try {
        const detailAppointment = await Appointment.findById(req.params.appointmentId)
            .populate("patientId", "fullName email phone")
            .populate("psychologistId", "fullName email phone")
            .exec();

        res.json(detailAppointment);
    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

const getCountRequestReschedule = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ isRescheduled: true })
            .populate("patientId", "fullName")
            .populate("psychologistId", "fullName");

        const patientNames = appointments.map((appointment) => appointment.patientId.fullName);
        const psychologistNames = appointments.map((appointment) => appointment.psychologistId.fullName);

        const scheduledTimes = appointments.map((appointment) => appointment.scheduledTime.date);
        const statuses = appointments.map((appointment) => appointment.status);
        const notes = appointments.map((appointment) => appointment.note);
        const appointmentIds = appointments.map((appointment) => appointment._id);

        res.json({
            count: appointments.length,
            appointmentIds: appointmentIds,
            patientNames: patientNames,
            psychologistNames: psychologistNames,
            notes: notes,
            scheduledTimes: scheduledTimes,
            statuses: statuses,
        });
    } catch (error) {
        console.error("Error fetching count:", error);
        next(error);
    }
};

const changeBooleanIsReschedule = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate("patientId", "fullName email")
            .populate("psychologistId", "fullName email");
        const { status } = req.body;

        // if (appointment.isRescheduled) {
        //     return res.status(400).json({ error: "This appointment has already been rescheduled once." });
        // }

        console.log(status);
        console.log(req.params.appointmentId);

        // Kiểm tra thời gian reschedule có <= 7 ngày không
        const currentDate = new Date();
        const appointmentDate = new Date(appointment.scheduledTime.date);
        const diffInDays = (appointmentDate - currentDate) / (1000 * 60 * 60 * 24);

        if (diffInDays > 7) {
            return res
                .status(400)
                .json({ error: "Rescheduling is only allowed within 7 days from the current appointment." });
        }

        const mailService = MailService();
        let statusMessage = "";

        // const reScheduleTime = `
        // 🔹 Ngày: ${new Date(appointment.scheduledTime.date).toLocaleDateString("vi-VN", { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        // 🔹 Giờ: ${appointment.scheduledTime.startTime} đến ${appointment.scheduledTime.endTime}
        // `;

        const reScheduleTime = `
        🔹 Ngày: ${new Date(appointment.scheduledTime.date).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })}
        🔹 Giờ: ${new Date(appointment.scheduledTime.startTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })} 
        (${new Date(appointment.scheduledTime.startTime).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })}) 
        - 
        ${new Date(appointment.scheduledTime.endTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })} 
        (${new Date(appointment.scheduledTime.endTime).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })})  
    `;
        if (status === "Approved") {
            appointment.status = "Confirmed";
            appointment.isRescheduled = false;
            statusMessage = `✅ Yêu cầu đổi lịch hẹn của bạn với ${appointment.psychologistId.fullName} đã được chấp nhận.  
            Vui lòng kiểm tra lại lịch hẹn của bạn dưới đây:\n\n${reScheduleTime}`;
            await mailService.sendEmail(
                appointment.patientId.email,
                appointment.patientId.fullName,
                statusMessage,
                actions.RESCHEDULE_APPOINTMENT_SUCCESS
            );
            console.log("Gui mail thanh cong tới Patient");
            statusMessage = `✅ Bệnh nhân ${appointment.patientId.fullName} đã yêu cầu đổi lịch hẹn với bạn.  
            Vui lòng kiểm tra lại lịch hẹn của bạn dưới đây:\n\n${reScheduleTime}`;
            await mailService.sendEmail(
                appointment.psychologistId.email,
                appointment.psychologistId.fullName,
                statusMessage,
                actions.RESCHEDULE_APPOINTMENT_SUCCESS
            );
            console.log("Gui mail thanh cong tới Psychologist");
        } else if (status === "Cancelled") {
            appointment.status = "Confirmed";
            appointment.isRescheduled = false;
            statusMessage = `Yêu cầu đổi lịch hẹn của bạn và ${appointment.psychologistId.fullName} không được chấp nhận. Vui lòng chọn thời gian khác.`;
            await mailService.sendEmail(
                appointment.patientId.email,
                appointment.patientId.fullName,
                statusMessage,
                actions.RESCHEDULE_APPOINTMENT_FAILURE
            );
            console.log("Gui mail thanh cong tới Patient");
        }

        await appointment.save();
        res.json(appointment);
    } catch (error) {
        console.error("Lỗi khi cập nhật lịch hẹn:", error);
        next(error);
    }
};

const rescheduleAppointment = async (req, res, next) => {
    try {
        const { newAvailabilityId, rescheduleReason } = req.body;
        console.log(newAvailabilityId);
        console.log(rescheduleReason);
        const appointment = await Appointment.findById(req.params.appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        console.log("Vào insert");

        const newAppointment = new Appointment({
            patientId: appointment.patientId,
            psychologistId: appointment.psychologistId,
            availabilityId: new mongoose.Types.ObjectId(newAvailabilityId._id),
            scheduledTime: {
                date: newAvailabilityId.date,
                startTime: newAvailabilityId.startTime,
                endTime: newAvailabilityId.endTime,
            },
            status: "Pending",
            isRescheduled: true,
            paymentInformation: appointment.paymentInformation,
            note: rescheduleReason,
        });

        // 3. Save the new appointment
        await newAppointment.save();
        console.log(newAppointment);

        // 4. Optionally, update the status of the old appointment to "Cancelled"
        appointment.status = "Cancelled";
        await appointment.save();

        const oldAvailability = await Availability.findById(appointment.availabilityId);
        console.log("oldAvailability", oldAvailability);
        oldAvailability.isBooked = false;
        await oldAvailability.save();

        const newAvailability = await Availability.findById(newAppointment.availabilityId);
        console.log("newAvailability", newAvailability);
        newAvailability.isBooked = true;
        await newAvailability.save();

        res.json("Ok ");
    } catch (error) {
        console.error("Error while rescheduling appointment:", error);
        throw error;
    }
};

const cancelScheduleByPatient = async (req, res, next) => {
    try {
        const { cancelReason } = req.body;

        console.log(req.body.cancelReason);
        console.log(req.params.appointmentId);

        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate("patientId", "fullName email")
            .populate("psychologistId", "fullName email");
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status === "Confirmed" || appointment.status === "Pending") {
            appointment.status = "Cancelled";
            appointment.note = "<p>" + cancelReason + "</p>";
            await appointment.save();

            console.log(appointment.availabilityId);

            const availability = await Availability.findById(appointment.availabilityId);
            console.log(availability.isBooked);

            availability.isBooked = false;
            await availability.save();

            let statusMessage = "";
            const reScheduleTime = `
            🔹 Ngày: ${new Date(appointment.scheduledTime.date).toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })}
            🔹 Giờ: ${new Date(appointment.scheduledTime.startTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })} 
            (${new Date(appointment.scheduledTime.startTime).toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })}) 
            - 
            ${new Date(appointment.scheduledTime.endTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })} 
            (${new Date(appointment.scheduledTime.endTime).toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })}) ĐÃ BỊ HỦY. 
        `;

            const mailService = MailService();

            statusMessage = `🔴 Cuộc hẹn của bạn với bác sĩ ${appointment.psychologistId.fullName} vào lúc ${reScheduleTime}`;
            await mailService.sendEmail(
                appointment.patientId.email,
                appointment.patientId.fullName,
                statusMessage,
                actions.CANCEL_APPOINTMENT
            );

            statusMessage = `🔴 Cuộc hẹn của bạn với bệnh nhân ${appointment.patientId.fullName} vào lúc ${reScheduleTime}`;
            await mailService.sendEmail(
                appointment.psychologistId.email,
                appointment.psychologistId.fullName,
                statusMessage,
                actions.CANCEL_APPOINTMENT
            );
        } else {
            return res.status(400).json({ message: "Appointment is not confirmed" });
        }

        //thiếu phần hoàn tiền 3 -5d
        res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

/**
 * Get appointments for the logged-in psychologist
 */
const getPsychologistAppointments = async (req, res) => {
    try {
        // Get the logged-in user's ID from the auth token
        const psychologistId = req.user ? req.user._id : req.query.psychologistId;
        
        if (!psychologistId) {
            return res.status(400).json({ message: "Psychologist ID is required" });
        }
        
        // Find all appointments for this psychologist
        const appointments = await Appointment.find({ psychologistId })
            .populate("patientId", "fullName email phone")
            .sort({ "scheduledTime.date": -1 });
            
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching psychologist appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
    }
};

export default {
    createPaymentLink,
    checkPaymentStatusAPI,
    updateAppointment,
    waitForPayment,
    confirmPayment,
    cancelPayment,
    checkPendingAppointmentByUserId,
    getAppointmentListByUserId,
    createMeetUrlAPI,
    getUserAppointmentById,
    createZoomMeetingAPI,
    getAppointmentById,
    updateAppointmentStatus,
    getAllAppointments,
    updateNotes,
    findScheduleByPsychologistId,
    getStatusRescheduleByUser,
    getAllAppointment,
    getDetailAppointmentId,
    getCountRequestReschedule,
    changeBooleanIsReschedule,
    cancelScheduleByPatient,
    rescheduleAppointment,
    saveAppointment,
    getPsychologistAppointments,
};

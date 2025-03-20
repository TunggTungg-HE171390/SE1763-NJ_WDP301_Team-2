import Appointment from "../models/Appointment.model.js";
import Availability from "../models/Availability.model.js";
import { MailService } from "../services/index.js";
import actions from '../actions/requestController.action.js';

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
            isRescheduled: appointment.isRescheduled
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
}

const getCountRequestReschedule = async (req, res, next) => {
    try {
        const countRequestReschedule = await Appointment.find({ isRescheduled: true }).countDocuments();
        res.json({
            count: countRequestReschedule,
        });
    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

const changeBooleanIsReschedule = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate("patientId", "fullName email")
            .populate("psychologistId", "fullName email");
        const { status } = req.body;

        if (appointment.isRescheduled) {
            return res.status(400).json({ error: "This appointment has already been rescheduled once." });
        }

        // Kiểm tra thời gian reschedule có <= 7 ngày không
        const currentDate = new Date();
        const appointmentDate = new Date(appointment.scheduledTime.date);
        const diffInDays = (appointmentDate - currentDate) / (1000 * 60 * 60 * 24);

        if (diffInDays > 7) {
            return res.status(400).json({ error: "Rescheduling is only allowed within 7 days from the current appointment." });
        }

        const mailService = MailService();
        let statusMessage = "";

        const reScheduleTime = `
        🔹 Ngày: ${new Date(appointment.scheduledTime.date).toLocaleDateString("vi-VN", { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}  
        🔹 Giờ: ${appointment.scheduledTime.startTime} đến ${appointment.scheduledTime.endTime}  
        `;

        if (status === "Approved") {
            appointment.status = "Confirmed";
            appointment.isRescheduled = false;
            statusMessage = `✅ Yêu cầu đổi lịch hẹn của bạn với ${appointment.psychologistId.fullName} đã được chấp nhận.  
            Vui lòng kiểm tra lại lịch hẹn của bạn dưới đây:\n\n${reScheduleTime}`;
            await mailService.sendEmail(appointment.patientId.email, appointment.patientId.fullName, statusMessage, actions.RESCHEDULE_APPOINTMENT_SUCCESS);
            console.log("Gui mail thanh cong tới Patient");
            statusMessage = `✅ Bệnh nhân ${appointment.patientId.fullName} đã yêu cầu đổi lịch hẹn với bạn.  
            Vui lòng kiểm tra lại lịch hẹn của bạn dưới đây:\n\n${reScheduleTime}`;
            await mailService.sendEmail(appointment.psychologistId.email, appointment.psychologistId.fullName, status, actions.RESCHEDULE_APPOINTMENT_SUCCESS);
            console.log("Gui mail thanh cong tới Psychologist");
        } else if (status === "Cancelled") {
            appointment.status = "Confirmed";
            appointment.isRescheduled = false;
            statusMessage = `Yêu cầu đổi lịch hẹn của bạn và ${appointment.psychologistId.fullName} không chấp nhận. Vui lòng chọn thời gian khác.`;
            await mailService.sendEmail(appointment.patientId.email, appointment.patientId.fullName, statusMessage, actions.RESCHEDULE_APPOINTMENT_FAILURE);
            console.log("Gui mail thanh cong tới Patient");
        }

        await appointment.save();
        res.json(appointment);
    } catch (error) {
        console.error("Lỗi khi cập nhật lịch hẹn:", error);
        next(error);
    }
};

const cancelScheduleByPatient = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if(!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appointment.status = "Cancelled";
        await appointment.save();

        const availability = await Availability.findById(appointment.availabilityId);
        availability.isBooked = false;
        await availability.save();

        let statusMessage = "";
        const mailService = MailService();

        statusMessage = `🔴 Cuộc hẹn của bạn với ${appointment.psychologistId.fullName} đã bị hủy.`
        await mailService.sendEmail(appointment.psychologistId.email, appointment.psychologistId.fullName, status, actions.RESCHEDULE_APPOINTMENT_SUCCESS);


    } catch (error) {
        console.error("Error fetching users: ", error);
        next(error);
    }
};

export default {
    findScheduleByPsychologistId,
    getStatusRescheduleByUser,
    getAllAppointment,
    getDetailAppointmentId,
    getCountRequestReschedule,
    changeBooleanIsReschedule,
};
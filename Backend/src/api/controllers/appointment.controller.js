import Appointment from "../models/Appointment.model.js";

const findScheduleByPsychologistId = async (req, res, next) => {
    try {
        const scheduleByPsychologistId = await Appointment.find({ psychologistId: req.params.psychologistId })
            .populate("patientId", "fullName email phone")
            .populate("psychologistId", "fullName -_id")
            .exec();

        const psychologistData = scheduleByPsychologistId.map((psychologist) => ({
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

export default {
    findScheduleByPsychologistId,
};
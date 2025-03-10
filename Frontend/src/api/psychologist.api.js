import apiClient from "./apiClient";

export const getPsychologistList = async () => {
    return await apiClient.get("psychologist/get-psychologist-list");
};

export const getSpecializationList = async () => {
    return await apiClient.get("psychologist/get-specialization-list");
};

export const getPsychologist = async (id) => {
    return await apiClient.get(`psychologist/get-psychologist/${id}`);
};

export const getScheduleListByDoctorId = async (id) => {
    return await apiClient.get(`psychologist/scheduleList/${id}`);
};

export const getScheduleById = async (id) => {
    return await apiClient.get(`psychologist/schedule/${id}`);
};

export const saveAppointment = async (formData) => {
    return apiClient.post("/psychologist/save-appointment", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type
        },
    });
};

export const getAppointmentById = async (id) => {
    return await apiClient.get(`/psychologist/appointment/${id}`);
};

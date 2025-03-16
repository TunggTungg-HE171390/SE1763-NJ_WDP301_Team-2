import apiClient from "./apiClient";
import mockApi from "./mockApi/appointment.mock";

// Kiểm tra xem có đang ở chế độ phát triển và dùng mock API không
const USE_MOCK_API = true; // Để true để sử dụng mock API, false để sử dụng API thật

const appointmentApi = {
    // Get all appointments for the logged-in psychologist
    getAppointments: async () => {
        try {
            if (USE_MOCK_API) {
                return await mockApi.getAllAppointments();
            }
            const response = await apiClient.get("/appointments/psychologist");
            return response.data;
        } catch (error) {
            console.error("Error fetching appointments:", error);
            throw error;
        }
    },

    // Get appointments for a specific date
    getAppointmentsByDate: async (date) => {
        try {
            if (USE_MOCK_API) {
                return await mockApi.getAppointmentsByDate(date);
            }
            const response = await apiClient.get(`/appointments/date/${date}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointments for date ${date}:`, error);
            throw error;
        }
    },

    // Get details of a specific appointment
    getAppointmentById: async (appointmentId) => {
        try {
            if (USE_MOCK_API) {
                return await mockApi.getAppointmentById(appointmentId);
            }
            const response = await apiClient.get(`/appointments/${appointmentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointment ${appointmentId}:`, error);
            throw error;
        }
    },

    // Update notes for an appointment
    updateNotes: async (appointmentId, notes) => {
        try {
            if (USE_MOCK_API) {
                return await mockApi.updateAppointmentNotes(appointmentId, notes);
            }
            const response = await apiClient.patch(`/appointments/${appointmentId}/notes`, { notes });
            return response.data;
        } catch (error) {
            console.error(`Error updating notes for appointment ${appointmentId}:`, error);
            throw error;
        }
    },

    // Cancel an appointment
    cancelAppointment: async (appointmentId, cancelReason) => {
        try {
            if (USE_MOCK_API) {
                return await mockApi.cancelAppointment(appointmentId, cancelReason);
            }
            const response = await apiClient.patch(`/appointments/${appointmentId}/cancel`, { cancelReason });
            return response.data;
        } catch (error) {
            console.error(`Error cancelling appointment ${appointmentId}:`, error);
            throw error;
        }
    },

    // Reschedule an appointment
    rescheduleAppointment: async (appointmentId, date, time, rescheduleReason) => {
        try {
            if (USE_MOCK_API) {
                return await mockApi.rescheduleAppointment(appointmentId, date, time, rescheduleReason);
            }
            const response = await apiClient.patch(`/appointments/${appointmentId}/reschedule`, {
                date,
                time,
                rescheduleReason,
            });
            return response.data;
        } catch (error) {
            console.error(`Error rescheduling appointment ${appointmentId}:`, error);
            throw error;
        }
    },

    // Confirm an appointment
    confirmAppointment: async (appointmentId) => {
        try {
            if (USE_MOCK_API) {
                return await mockApi.confirmAppointment(appointmentId);
            }
            const response = await apiClient.patch(`/appointments/${appointmentId}/confirm`);
            return response.data;
        } catch (error) {
            console.error(`Error confirming appointment ${appointmentId}:`, error);
            throw error;
        }
    },
};

export const createPaymentLink = async (credentials) => {
    return await apiClient.post("/appointment/create_payment_link", credentials);
};

export const checkPaymentStatus = async (credentials) => {
    return await apiClient.post("/appointment/check_payment_status", credentials);
};

export const updateAppointment = async (id) => {
    return await apiClient.post(`/appointment/update_appointment/${id}`);
};

export const waitForPayment = async (credentials) => {
    return await apiClient.post("/appointment/wait_for_payment", credentials);
};

export const confirmPayment = async (credentials) => {
    return await apiClient.post("/appointment/approve_appointment", credentials);
};

export const cancelPayment = async (credentials) => {
    return await apiClient.post("/appointment/cancel_appointment", credentials);
};

export const getAppointmentListByUserId = async (id) => {
    return await apiClient.get(`/appointment/appointments/${id}`);
};

export const countPendingAppointment = async (credentials) => {
    return await apiClient.post("/appointment/count-pending-appointment", credentials);
};

export default appointmentApi;

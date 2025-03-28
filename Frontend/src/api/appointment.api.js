import apiClient from "./apiClient";
import mockApi from "./mockApi/appointment.mock";

// Toggle this to true if you want to use mock data instead of calling the real API
const USE_MOCK_API = false;
const appointmentAPI = true;

// const appointmentAPI = {
// Get all appointments for the logged-in psychologist
export const getAppointments = async () => {
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
};

// Get appointments for a specific date
export const getAppointmentsByDate = async (date) => {
    try {
        console.log(`Fetching appointments for date: ${date}`);
        if (USE_MOCK_API) {
            return await mockApi.getAppointmentsByDate(date);
        }
        return await apiClient.get(`/appointments?startDate=${date}&endDate=${date}`);
    } catch (error) {
        console.error(`Error fetching appointments by date: ${error.message}`);
        return { data: [] }; // To prevent UI breakage
    }
};

// Get details of a specific appointment
export const getAppointmentById = async (appointmentId) => {
    try {
        console.log(`Fetching appointment data for ID: ${appointmentId}`);
        if (USE_MOCK_API) {
            return await mockApi.getAppointmentById(appointmentId);
        }
        const response = await apiClient.get(`/appointments/${appointmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching appointment ${appointmentId}:`, error);
        throw error;
    }
};

// Update notes for an appointment
export const updateNotes = async (appointmentId, notes) => {
    try {
        console.log(`Updating notes for appointment ID: ${appointmentId}`);
        if (USE_MOCK_API) {
            return await mockApi.updateAppointmentNotes(appointmentId, notes);
        }
        return await apiClient.patch(`/appointments/${appointmentId}/status`, { note: notes });
    } catch (error) {
        console.error(`Error updating notes for appointment ${appointmentId}:`, error);
        throw error;
    }
};

// Cancel an appointment
export const cancelAppointment = async (appointmentId, cancelReason) => {
    try {
        console.log(`Cancelling appointment ID: ${appointmentId}`);
        if (USE_MOCK_API) {
            return await mockApi.cancelAppointment(appointmentId, cancelReason);
        }
        return await apiClient.patch(`/appointments/${appointmentId}/status`, {
            status: "Cancelled",
            note: cancelReason,
        });
    } catch (error) {
        console.error(`Error cancelling appointment: ${error.message}`);
        throw error;
    }
};

// Reschedule an appointment
export const rescheduleAppointment = async (appointmentId, date, time, rescheduleReason) => {
    try {
        console.log(`Rescheduling appointment ID: ${appointmentId}`, { date, time, rescheduleReason });
        if (USE_MOCK_API) {
            return await mockApi.rescheduleAppointment(appointmentId, date, time, rescheduleReason);
        }
        return await apiClient.patch(`/appointments/${appointmentId}/reschedule`, {
            newDate: date,
            newTime: time,
            reason: rescheduleReason,
        });
    } catch (error) {
        console.error(`Error rescheduling appointment ${appointmentId}:`, error);
        throw error;
    }
};

// Confirm an appointment
export const confirmAppointment = async (appointmentId) => {
    try {
        console.log(`Confirming appointment ID: ${appointmentId}`);
        if (USE_MOCK_API) {
            return await mockApi.confirmAppointment(appointmentId);
        }
        return await apiClient.patch(`/appointments/${appointmentId}/status`, {
            status: "Confirmed",
        });
    } catch (error) {
        console.error(`Error confirming appointment: ${error.message}`);
        throw error;
    }
};

// Update appointment status (generic)
export const updateAppointmentStatus = async (appointmentId, data) => {
    try {
        console.log(`Updating status for appointment ID: ${appointmentId}`, data);
        if (USE_MOCK_API) {
            return await mockApi.updateAppointmentStatus(appointmentId, data);
        }
        return await apiClient.patch(`/appointments/${appointmentId}/status`, data);
    } catch (error) {
        console.error(`Error updating appointment status: ${error.message}`);
        throw error;
    }
};

// Get all appointments (staff view)
export const getAllAppointments = async (filters = {}) => {
    try {
        console.log("Fetching all appointments with filters:", filters);
        if (USE_MOCK_API) {
            return await mockApi.getAllAppointments(filters);
        }
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value);
            }
        });
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
        return await apiClient.get(`/appointments${queryString}`);
    } catch (error) {
        console.error(`Error fetching all appointments: ${error.message}`);
        throw error;
    }
};

// Additional exports (non-grouped)
export const createPaymentLink = async (credentials) =>
    await apiClient.post("/appointment/create_payment_link", credentials);

export const checkPaymentStatus = async (credentials) =>
    await apiClient.post("/appointment/check_payment_status", credentials);

export const updateAppointment = async (id) => await apiClient.post(`/appointment/update_appointment/${id}`);

export const waitForPayment = async (credentials) => await apiClient.post("/appointment/wait_for_payment", credentials);

export const confirmPayment = async (credentials) =>
    await apiClient.post("/appointment/approve_appointment", credentials);

export const cancelPayment = async (credentials) =>
    await apiClient.post("/appointment/cancel_appointment", credentials);

export const getAppointmentListByUserId = async (id) => await apiClient.get(`/appointment/appointment-list/${id}`);

export const countPendingAppointment = async (credentials) =>
    await apiClient.post("/appointment/count-pending-appointment", credentials);

export const getUserAppointmentById = async (credentials) =>
    await apiClient.post("/appointment/appointment-details", credentials);

export const getZoomMeetURL = async (credentials) => await apiClient.post("/appointment/get-zoom-url", credentials);

// Default export
export default appointmentAPI;

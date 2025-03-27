import apiClient from './apiClient';
import mockApi from './mockApi/appointment.mock';

// Kiểm tra xem có đang ở chế độ phát triển và dùng mock API không
const USE_MOCK_API = false; // Set to false to use the real API

// Get appointment by ID
export const getAppointmentById = async (appointmentId) => {
  try {
    console.log(`Fetching appointment data for ID: ${appointmentId}`);
    if (USE_MOCK_API) {
      return await mockApi.getAppointmentById(appointmentId);
    }
    // Use the correct endpoint
    return await apiClient.get(`/appointments/${appointmentId}`);
  } catch (error) {
    console.error(`Error fetching appointment data: ${error.message}`);
    throw error;
  }
};

// Update appointment status
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

// Get all appointments (for staff management)
export const getAllAppointments = async (filters = {}) => {
  try {
    console.log("Fetching all appointments with filters:", filters);
    if (USE_MOCK_API) {
      return await mockApi.getAllAppointments(filters);
    }
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return await apiClient.get(`/appointments${queryString}`);
  } catch (error) {
    console.error(`Error fetching all appointments: ${error.message}`);
    throw error;
  }
};

// Cancel appointment
export const cancelAppointment = async (appointmentId, reason) => {
  try {
    console.log(`Cancelling appointment ID: ${appointmentId}`);
    if (USE_MOCK_API) {
      return await mockApi.cancelAppointment(appointmentId, reason);
    }
    return await apiClient.patch(`/appointments/${appointmentId}/status`, { 
      status: 'Cancelled',
      note: reason
    });
  } catch (error) {
    console.error(`Error cancelling appointment: ${error.message}`);
    throw error;
  }
};

// Confirm appointment
export const confirmAppointment = async (appointmentId) => {
  try {
    console.log(`Confirming appointment ID: ${appointmentId}`);
    if (USE_MOCK_API) {
      return await mockApi.confirmAppointment(appointmentId);
    }
    return await apiClient.patch(`/appointments/${appointmentId}/status`, { 
      status: 'Confirmed'
    });
  } catch (error) {
    console.error(`Error confirming appointment: ${error.message}`);
    throw error;
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (appointmentId, newDate, newTime, reason) => {
  try {
    console.log(`Rescheduling appointment ID: ${appointmentId}`, { newDate, newTime, reason });
    if (USE_MOCK_API) {
      return await mockApi.rescheduleAppointment(appointmentId, newDate, newTime, reason);
    }
    return await apiClient.patch(`/appointments/${appointmentId}/reschedule`, {
      newDate,
      newTime,
      reason
    });
  } catch (error) {
    console.error(`Error rescheduling appointment: ${error.message}`);
    throw error;
  }
};

// Update appointment notes
export const updateNotes = async (appointmentId, notes) => {
  try {
    console.log(`Updating notes for appointment ID: ${appointmentId}`);
    if (USE_MOCK_API) {
      return await mockApi.updateAppointmentNotes(appointmentId, notes);
    }
    return await apiClient.patch(`/appointments/${appointmentId}/status`, { 
      note: notes 
    });
  } catch (error) {
    console.error(`Error updating appointment notes: ${error.message}`);
    throw error;
  }
};

// Get appointments by date
export const getAppointmentsByDate = async (date) => {
  try {
    console.log(`Fetching appointments for date: ${date}`);
    if (USE_MOCK_API) {
      return await mockApi.getAppointmentsByDate(date);
    }
    return await apiClient.get(`/appointments?startDate=${date}&endDate=${date}`);
  } catch (error) {
    console.error(`Error fetching appointments by date: ${error.message}`);
    return { data: [] }; // Return empty array on error to avoid UI breakage
  }
};

// Create a constant containing all functions for export
const appointmentAPI = {
  getAppointmentById,
  updateAppointmentStatus,
  getAllAppointments,
  cancelAppointment,
  confirmAppointment,
  rescheduleAppointment,
  updateNotes,
  getAppointmentsByDate
};

// Export default and named exports
export default appointmentAPI;

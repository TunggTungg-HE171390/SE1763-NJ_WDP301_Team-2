import apiClient from './apiClient';
import { isSameDay, parseISO } from 'date-fns';
import mockApi from './mockApi/schedule.mock';

// Flag to use mock API for development (set to false to use real API)
const USE_MOCK_API = false;

/**
 * Get all schedule slots for a psychologist
 * @param {string} psychologistId - The ID of the psychologist
 * @returns {Promise<Array>} - Array of schedule slots
 */
export const getSchedulesByPsychologistId = async (psychologistId) => {
  try {
    console.log(`Fetching schedules for psychologist: ${psychologistId}`);
    
    if (USE_MOCK_API) {
      return await mockApi.getSchedulesByPsychologistId(psychologistId);
    }
    
    // Use the correct endpoint from the backend (scheduleList route)
    const response = await apiClient.get(`/psychologist/scheduleList/${psychologistId}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
};

/**
 * Get schedule slots within a specific date range
 * @param {string} psychologistId - The ID of the psychologist (optional)
 * @param {Date|string} startDate - Start date of the range
 * @param {Date|string} endDate - End date of the range
 * @returns {Promise<Array>} - Array of schedule slots
 */
export const getSchedulesByTimePeriod = async (startDate, endDate, psychologistId = null) => {
  try {
    console.log(`Fetching schedules from ${startDate} to ${endDate}`);
    
    if (USE_MOCK_API) {
      return await mockApi.getSchedulesByTimePeriod(startDate, endDate, psychologistId);
    }
    
    // Format dates if they're Date objects
    const formattedStartDate = typeof startDate === 'object' ? 
      startDate.toISOString().split('T')[0] : startDate;
    
    const formattedEndDate = typeof endDate === 'object' ? 
      endDate.toISOString().split('T')[0] : endDate;
    
    // Build the URL with query parameters
    let url = `/availability/slots?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    
    // Add psychologistId if provided
    if (psychologistId) {
      url += `&psychologistId=${psychologistId}`;
    }
    
    const response = await apiClient.get(url);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching schedules by time period:', error);
    
    // If the API doesn't exist yet, fall back to getting all schedules and filtering
    if (psychologistId) {
      try {
        const allSchedules = await getSchedulesByPsychologistId(psychologistId);
        
        // Parse dates if they're strings
        const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
        const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
        
        // Filter by date range
        return allSchedules.filter(slot => {
          const slotDate = new Date(slot.date || slot.startTime);
          return slotDate >= start && slotDate <= end;
        });
      } catch (fallbackError) {
        console.error('Fallback filtering failed:', fallbackError);
        return [];
      }
    }
    
    return [];
  }
};

/**
 * Get all confirmed appointments for a psychologist or patient
 * @param {string} userId - The user ID (psychologist or patient)
 * @param {string} role - The role ('psychologist' or 'patient')
 * @returns {Promise<Array>} - Array of appointments
 */
export const getAppointmentsByUser = async (userId, role) => {
  try {
    if (USE_MOCK_API) {
      return await mockApi.getAppointmentsByUser(userId, role);
    }
    
    const response = await apiClient.get(`/appointments/user/${userId}?role=${role}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Export all functions
export default {
  getSchedulesByPsychologistId,
  getSchedulesByTimePeriod,
  getAppointmentsByUser
};

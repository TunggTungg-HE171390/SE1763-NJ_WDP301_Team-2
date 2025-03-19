import apiClient from './apiClient';

/**
 * Get all availability slots
 */
export const getAllAvailabilitySlots = async () => {
  try {
    const response = await apiClient.get('/availability/slots');
    return response;
  } catch (error) {
    console.error('Error fetching all availability slots:', error);
    throw error;
  }
};

/**
 * Get availability configuration by psychologist ID
 */
export const getAvailabilityByPsychologistId = async (psychologistId) => {
  try {
    const response = await apiClient.get(`/availability/config/psychologist/${psychologistId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching availability config for psychologist ${psychologistId}:`, error);
    throw error;
  }
};

/**
 * Get all availability slots for a specific psychologist
 */
export const getAvailabilitySlotsByPsychologistId = async (psychologistId, startDate, endDate) => {
  try {
    const response = await apiClient.get(`/availability/slots/psychologist/${psychologistId}`, {
      params: { startDate, endDate }
    });
    return response;
  } catch (error) {
    console.error(`Error fetching availability slots for psychologist ${psychologistId}:`, error);
    throw error;
  }
};

/**
 * Get available time slots by date for a specific psychologist
 */
export const getAvailableTimeSlots = async (psychologistId, date) => {
  try {
    const response = await apiClient.get('/availability/slots/available', {
      params: { psychologistId, date }
    });
    return response;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
};

/**
 * Save availability configuration for a psychologist
 */
export const saveAvailability = async (availabilityData) => {
  try {
    const response = await apiClient.post('/availability/config', availabilityData);
    return response;
  } catch (error) {
    console.error('Error saving availability configuration:', error);
    throw error;
  }
};

/**
 * Update a specific availability slot
 */
export const updateAvailabilitySlot = async (slotId, updateData) => {
  try {
    const response = await apiClient.put(`/availability/slot/${slotId}`, updateData);
    return response;
  } catch (error) {
    console.error(`Error updating availability slot ${slotId}:`, error);
    throw error;
  }
};

/**
 * Book a specific availability slot
 */
export const bookAvailabilitySlot = async (slotId, bookingData) => {
  try {
    const response = await apiClient.put(`/availability/slot/${slotId}/book`, bookingData);
    return response;
  } catch (error) {
    console.error(`Error booking availability slot ${slotId}:`, error);
    throw error;
  }
};

/**
 * Delete a specific availability slot
 */
export const deleteAvailabilitySlot = async (slotId) => {
  try {
    const response = await apiClient.delete(`/availability/slot/${slotId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting availability slot ${slotId}:`, error);
    throw error;
  }
};

/**
 * Generate available time slots based on availability configuration
 */
export const generateAvailabilitySlots = async (psychologistId, startDate, endDate) => {
  try {
    const response = await apiClient.post('/availability/generate-slots', {
      psychologistId,
      startDate,
      endDate
    });
    return response;
  } catch (error) {
    console.error('Error generating availability slots:', error);
    throw error;
  }
};

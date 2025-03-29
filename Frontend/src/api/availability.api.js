import apiClient from './apiClient';

/**
 * Get all availability slots
 */
export const getAllAvailabilitySlots = async () => {
    try {
        const response = await apiClient.get("/availability/slots");
        return response;
    } catch (error) {
        console.error("Error fetching all availability slots:", error);
        throw error;
    }
};

/**
 * Get availability configuration by psychologist ID
 */
export const getAvailabilityByPsychologistId = async (psychologistId) => {
    try {
        console.log(`Fetching availability for psychologist ID: ${psychologistId}`);
        
        try {
            // Attempt to directly use the availability endpoint
            const response = await apiClient.get(`/availability/${psychologistId}`);
            console.log('Availability endpoint response:', response.data);
            return response.data;
        } catch (err) {
            console.log('Availability endpoint failed, trying alternative endpoints', err);
            
            // Try multiple fallback endpoints
            try {
                // Fallback 1: Try psychologist schedule endpoint
                const scheduleResponse = await apiClient.get(`/psychologist/scheduleList/${psychologistId}`);
                console.log('Schedule endpoint response:', scheduleResponse.data);
                return scheduleResponse.data;
            } catch (scheduleErr) {
                console.log('Schedule endpoint failed, trying final endpoint', scheduleErr);
                
                // Fallback 2: Try get-availabilities endpoint
                const availabilitiesResponse = await apiClient.get(`/psychologist/get-availabilities/${psychologistId}`);
                console.log('Get-availabilities endpoint response:', availabilitiesResponse.data);
                return availabilitiesResponse.data;
            }
        }
    } catch (error) {
        console.error(`Error fetching availability for psychologist ${psychologistId}:`, error);
        throw error;
    }
};

/**
 * Get all availability slots for a specific psychologist
 */
export const getAvailabilitySlotsByPsychologistId = async (psychologistId, startDate, endDate) => {
    try {
        const response = await apiClient.get(`/availability/slots/psychologist/${psychologistId}`, {
            params: { startDate, endDate },
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
        const response = await apiClient.get("/availability/slots/available", {
            params: { psychologistId, date },
        });
        return response;
    } catch (error) {
        console.error("Error fetching available time slots:", error);
        throw error;
    }
};

/**
 * Save availability configuration for a psychologist
 */
export const saveAvailability = async (availabilityData) => {
    try {
        const response = await apiClient.post("/availability/config", availabilityData);
        return response;
    } catch (error) {
        console.error("Error saving availability configuration:", error);
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
        const response = await apiClient.post("/availability/generate-slots", {
            psychologistId,
            startDate,
            endDate,
        });
        return response;
    } catch (error) {
        console.error("Error generating availability slots:", error);
        throw error;
    }
};

/**
 * Create availability slots for a psychologist
 * 
 * @param {string} psychologistId - ID of the psychologist
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Promise<Object>} - Response with created slots
 */
export const createAvailabilitySlots = async (psychologistId, startDate, endDate) => {
    try {
        console.log(`Creating availability slots from ${startDate} to ${endDate} for psychologist ${psychologistId}`);
        
        const response = await apiClient.post('/availability/create', {
            psychologistId,
            startDate,
            endDate
        });
        
        console.log('Created availability slots:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating availability slots:', error);
        throw error;
    }
};

/**
 * Create multiple custom availability slots for a psychologist
 * 
 * @param {string} psychologistId - ID of the psychologist
 * @param {Array} slots - Array of slot objects with date, startTime and endTime
 * @returns {Promise<Object>} - Response with created slots
 */
export const createCustomAvailabilitySlots = async (psychologistId, slots) => {
    try {
        console.log(`Creating ${slots.length} custom slots for psychologist ${psychologistId}`);
        
        const response = await apiClient.post('/availability/create-multiple', {
            psychologistId,
            slots
        });
        
        console.log('Created custom slots:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating custom availability slots:', error);
        throw error;
    }
};

/**
 * Update availability slot status
 * 
 * @param {string} slotId - ID of the availability slot
 * @param {boolean} isBooked - Whether the slot is booked
 * @param {string|null} appointmentId - ID of the appointment (if booked)
 * @returns {Promise<Object>} - Response with updated slot
 */
export const updateSlotStatus = async (slotId, isBooked, appointmentId = null) => {
    try {
        console.log(`Updating slot ${slotId} status to isBooked=${isBooked}`);
        
        const response = await apiClient.patch(`/availability/${slotId}/status`, {
            isBooked,
            appointmentId
        });
        
        console.log('Updated slot status:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating slot status:', error);
        throw error;
    }
};

/**
 * Get availability slots by date range
 * 
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {string} psychologistId - ID of the psychologist (optional)
 * @returns {Promise<Object>} - Response with matching slots
 */
export const getSlotsByDateRange = async (startDate, endDate, psychologistId = null) => {
    try {
        let url = `/availability/range?startDate=${startDate}&endDate=${endDate}`;
        
        if (psychologistId) {
            url += `&psychologistId=${psychologistId}`;
        }
        
        console.log(`Fetching slots from ${startDate} to ${endDate}`);
        
        const response = await apiClient.get(url);
        console.log('Slots by date range:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching slots by date range:', error);
        throw error;
    }
};

/**
 * Get schedule slots for a specific psychologist
 * 
 * @param {string} psychologistId - ID of the psychologist
 * @returns {Promise<Object>} - Response with the psychologist's schedule
 */
export const schedulePsychologistId = async (psychologistId) => {
    try {
        console.log(`Fetching schedule for psychologist: ${psychologistId}`);
        
        const response = await apiClient.get(`/psychologist/scheduleList/${psychologistId}`);
        console.log('Schedule response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching schedule for psychologist ${psychologistId}:`, error);
        throw error;
    }
};

export default {
    getAvailabilityByPsychologistId,
    createAvailabilitySlots,
    createCustomAvailabilitySlots,
    updateSlotStatus,
    getSlotsByDateRange,
    schedulePsychologistId
};

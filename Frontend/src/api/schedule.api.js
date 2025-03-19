import apiClient from './apiClient';

const scheduleApi = {
  getSchedules: async () => {
    try {
      const response = await apiClient.get('/availability/slots');
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },
  
  getScheduleById: async (id) => {
    try {
      const response = await apiClient.get(`/availability/slot/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error);
      throw error;
    }
  },
  
  createSchedule: async (scheduleData) => {
    try {
      const response = await apiClient.post('/availability/slot', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },
  
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await apiClient.put(`/availability/slot/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      throw error;
    }
  },
  
  deleteSchedule: async (id) => {
    try {
      const response = await apiClient.delete(`/availability/slot/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      throw error;
    }
  },

  getSchedulesByTimePeriod: async (startDate, endDate) => {
    try {
      const response = await apiClient.get(`/availability/slots`, {
        params: {
          startDate,
          endDate
        }
      });
      
      if (!response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules by time period:', error);
      throw error;
    }
  },

  getSchedulesByTimePeriodAndDoctor: async (startDate, endDate, doctorId) => {
    try {
      if (!doctorId) {
        throw new Error('Doctor ID is required');
      }
      
      const response = await apiClient.get(`/availability/slots/psychologist/${doctorId}`, {
        params: {
          startDate,
          endDate
        }
      });
      
      if (!response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedules for doctor ${doctorId}:`, error);
      throw error;
    }
  }
};

export default scheduleApi;

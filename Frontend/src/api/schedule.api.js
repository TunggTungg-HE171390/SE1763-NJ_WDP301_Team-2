import axios from 'axios';

// You might need to adjust the base URL based on your API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const scheduleApi = {
  getSchedules: async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },
  
  getScheduleById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error);
      throw error;
    }
  },
  
  createSchedule: async (scheduleData) => {
    try {
      const response = await axios.post(`${API_URL}/schedules`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },
  
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await axios.put(`${API_URL}/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      throw error;
    }
  },
  
  deleteSchedule: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      throw error;
    }
  }
};

export default scheduleApi;

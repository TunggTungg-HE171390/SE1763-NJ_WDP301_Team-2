// Import mock API for development environment
import mockScheduleApi from './mockApi/schedule.mock';

// Check if we're in development mode to use mock API
const isDevEnvironment = process.env.NODE_ENV === 'development';

const scheduleApi = {
  getSchedules: async () => {
    if (isDevEnvironment) {
      return mockScheduleApi.getSchedules();
    }
    
    try {
      // Real API call would go here for production
      const response = await fetch('/api/schedules');
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },
  
  getScheduleById: async (id) => {
    if (isDevEnvironment) {
      return mockScheduleApi.getScheduleById(id);
    }
    
    try {
      const response = await fetch(`/api/schedules/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch schedule ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error);
      throw error;
    }
  },
  
  createSchedule: async (scheduleData) => {
    if (isDevEnvironment) {
      return mockScheduleApi.createSchedule(scheduleData);
    }
    
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });
      if (!response.ok) {
        throw new Error('Failed to create schedule');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },
  
  updateSchedule: async (id, scheduleData) => {
    if (isDevEnvironment) {
      return mockScheduleApi.updateSchedule(id, scheduleData);
    }
    
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });
      if (!response.ok) {
        throw new Error(`Failed to update schedule ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      throw error;
    }
  },
  
  deleteSchedule: async (id) => {
    if (isDevEnvironment) {
      return mockScheduleApi.deleteSchedule(id);
    }
    
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Failed to delete schedule ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      throw error;
    }
  },

  getSchedulesByTimePeriod: async (startDate, endDate) => {
    if (isDevEnvironment) {
      // If using mock API, filter the mock data by date range
      const allSchedules = await mockScheduleApi.getSchedules();
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Reset time part for accurate date comparison
        scheduleDate.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        return scheduleDate >= start && scheduleDate <= end;
      });
    }
    
    try {
      // Real API call would go here for production
      const response = await fetch(`/api/schedules?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch schedules for the specified time period');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching schedules by time period:', error);
      throw error;
    }
  }
};

export default scheduleApi;

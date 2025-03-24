/**
 * Utility for generating availability slots with fixed schedule
 */

/**
 * Generate time slots for a specific date based on fixed schedule
 * @param {string} psychologistId - The psychologist ID
 * @param {Date} date - The date for which to generate slots
 * @returns {Array} Array of slot objects
 */
export const generateDailySlots = (psychologistId, date) => {
  // Fixed schedule: 8:30 AM to 5:30 PM with 1-hour slots
  const startHour = 8;
  const startMinute = 30;
  const endHour = 17;
  const endMinute = 30;
  const slotDuration = 60; // minutes
  
  const slots = [];
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0); // Normalize date to midnight
  
  // Set start time to 8:30 AM
  const startTime = new Date(dateObj);
  startTime.setHours(startHour, startMinute, 0, 0);
  
  // Set end time to 5:30 PM
  const scheduleEndTime = new Date(dateObj);
  scheduleEndTime.setHours(endHour, endMinute, 0, 0);
  
  // Create slots
  let currentSlotStart = new Date(startTime);
  
  while (currentSlotStart < scheduleEndTime) {
    // Calculate slot end time
    const currentSlotEnd = new Date(currentSlotStart);
    currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + slotDuration);
    
    // Ensure we don't exceed end time
    if (currentSlotEnd > scheduleEndTime) break;
    
    // Create the slot - explicitly set status to "Available"
    slots.push({
      psychologistId,
      date: new Date(dateObj),
      startTime: new Date(currentSlotStart),
      endTime: new Date(currentSlotEnd),
      status: "Available" // Ensure all new slots are marked as Available
    });
    
    // Move to next slot
    currentSlotStart = new Date(currentSlotEnd);
  }
  
  return slots;
};

/**
 * Generate slots for a date range
 * @param {string} psychologistId - The psychologist ID
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date (inclusive)
 * @returns {Array} Array of slot objects for the date range
 */
export const generateSlotsForDateRange = (psychologistId, startDate, endDate) => {
  const slots = [];
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  // Set dates to midnight for comparison
  currentDate.setHours(0, 0, 0, 0);
  endDateObj.setHours(23, 59, 59, 999);
  
  // Generate slots for each day in the range
  while (currentDate <= endDateObj) {
    const dailySlots = generateDailySlots(psychologistId, new Date(currentDate));
    slots.push(...dailySlots);
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots;
};

/**
 * Filter out slots that are in the past
 * @param {Array} slots - Array of slot objects
 * @returns {Array} Filtered slots only containing present and future slots
 */
export const filterPastSlots = (slots) => {
  const now = new Date();
  
  return slots.filter(slot => {
    const slotStart = new Date(slot.startTime);
    return slotStart > now;
  });
};

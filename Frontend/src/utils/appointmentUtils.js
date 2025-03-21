/**
 * Utility functions for handling appointments
 */

/**
 * Find appointment ID for a schedule
 * @param {Object} schedule - The schedule object
 * @param {Array} appointments - Array of appointments
 * @returns {String|null} - Appointment ID or null if not found
 */
export const findAppointmentIdForSchedule = (schedule, appointments = []) => {
  if (!schedule || !appointments.length) return null;
  
  // If schedule already has appointmentId, return it
  if (schedule.appointmentId) return schedule.appointmentId;
  
  // Try to find matching appointment by time
  const matchingAppointment = appointments.find(appointment => {
    const scheduleDateStr = new Date(schedule.date || schedule.startTime).toDateString();
    const appointmentDateStr = new Date(appointment.scheduledTime?.date).toDateString();
    const scheduleStartTimeStr = new Date(schedule.startTime).toISOString();
    const appointmentStartTimeStr = new Date(appointment.scheduledTime?.startTime).toISOString();
    
    return (
      scheduleDateStr === appointmentDateStr &&
      scheduleStartTimeStr === appointmentStartTimeStr &&
      appointment.psychologistId === schedule.psychologistId
    );
  });
  
  return matchingAppointment?._id || null;
};

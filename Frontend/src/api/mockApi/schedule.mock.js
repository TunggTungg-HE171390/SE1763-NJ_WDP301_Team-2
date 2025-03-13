// Mock Data for Schedules
const mockSchedules = {
  "1": {
    id: 1,
    date: "2023-10-15",
    time: "10:00 AM",
    duration: 60,
    patientName: "Nguyen Van A",
    patientId: "P101",
    status: "Confirmed",
    type: "First Consultation",
    notes: "Initial assessment for anxiety and insomnia"
  },
  "2": {
    id: 2,
    date: "2023-10-16",
    time: "2:30 PM",
    duration: 60,
    patientName: "Tran Thi B",
    patientId: "P102",
    status: "Pending",
    type: "Follow-up",
    notes: "Follow-up session for depression symptoms"
  },
  "3": {
    id: 3,
    date: "2023-10-17",
    time: "9:15 AM",
    duration: 45,
    patientName: "Le Van C",
    patientId: "P103",
    status: "Cancelled",
    type: "Therapy",
    notes: "Cognitive behavioral therapy session",
    cancelReason: "Patient had an emergency"
  },
  "4": {
    id: 4,
    date: "2023-10-20",
    time: "11:00 AM",
    duration: 60,
    patientName: "Maria Garcia",
    patientId: "P104",
    status: "Confirmed",
    type: "First Consultation",
    notes: "Assessment for work-related stress"
  },
  "5": {
    id: 5,
    date: "2023-10-22",
    time: "3:00 PM",
    duration: 45,
    patientName: "David Brown",
    patientId: "P105",
    status: "Confirmed",
    type: "Follow-up",
    notes: "Review of medication effectiveness"
  },
  "6": {
    id: 6,
    date: "2023-10-23",
    time: "10:30 AM",
    duration: 60,
    patientName: "Sarah Wilson",
    patientId: "P106",
    status: "Rescheduled",
    type: "Therapy",
    notes: "Family therapy session",
    rescheduledFrom: "2023-10-18"
  },
  "7": {
    id: 7,
    date: "2023-10-25",
    time: "4:15 PM",
    duration: 60,
    patientName: "Michael Taylor",
    patientId: "P107",
    status: "Pending",
    type: "First Consultation",
    notes: "Assessment for social anxiety"
  }
};

// Get all schedules
export const getSchedules = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convert object to array
      const schedulesArray = Object.values(mockSchedules);
      resolve(schedulesArray);
    }, 800);
  });
};

// Get schedules by date
export const getSchedulesByDate = (date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter schedules by date
      const schedulesArray = Object.values(mockSchedules);
      const filteredSchedules = schedulesArray.filter(
        schedule => schedule.date === date
      );
      resolve(filteredSchedules);
    }, 800);
  });
};

// Get schedule by ID
export const getScheduleById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const schedule = mockSchedules[id];
      if (schedule) {
        resolve(schedule);
      } else {
        reject(new Error("Schedule not found"));
      }
    }, 800);
  });
};

// Create a new schedule
export const createSchedule = (scheduleData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Object.keys(mockSchedules).length + 1;
      const newSchedule = {
        id: newId,
        ...scheduleData
      };
      mockSchedules[newId] = newSchedule;
      resolve(newSchedule);
    }, 800);
  });
};

// Update a schedule
export const updateSchedule = (id, scheduleData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const schedule = mockSchedules[id];
      if (schedule) {
        mockSchedules[id] = { ...schedule, ...scheduleData };
        resolve(mockSchedules[id]);
      } else {
        reject(new Error("Schedule not found"));
      }
    }, 800);
  });
};

// Delete a schedule
export const deleteSchedule = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockSchedules[id]) {
        const deletedSchedule = mockSchedules[id];
        delete mockSchedules[id];
        resolve(deletedSchedule);
      } else {
        reject(new Error("Schedule not found"));
      }
    }, 800);
  });
};

export default {
  getSchedules,
  getSchedulesByDate,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};

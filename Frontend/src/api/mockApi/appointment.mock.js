// Mock data for testing
const mockAppointments = [
  {
    _id: "1",
    patientId: {
      _id: "p1",
      fullName: "John Smith",
      email: "john@example.com",
      phone: "1234567890"
    },
    psychologistId: "psy1",
    scheduledTime: {
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: new Date(Date.now() + 86400000 + 3600000), // Tomorrow, 1 hour later
      endTime: new Date(Date.now() + 86400000 + 7200000), // Tomorrow, 2 hours later
    },
    status: "Confirmed",
    notes: {
      patient: "I've been feeling anxious lately",
      psychologist: "Initial consultation scheduled"
    }
  },
  {
    _id: "2",
    patientId: {
      _id: "p2",
      fullName: "Mary Johnson",
      email: "mary@example.com",
      phone: "0987654321"
    },
    psychologistId: "psy1",
    scheduledTime: {
      date: new Date(Date.now() - 86400000), // Yesterday
      startTime: new Date(Date.now() - 86400000 + 3600000), // Yesterday, 1 hour later
      endTime: new Date(Date.now() - 86400000 + 7200000), // Yesterday, 2 hours later
    },
    status: "Completed",
    notes: {
      patient: "Follow-up for depression treatment",
      psychologist: "Patient showing improvement with current medication"
    }
  },
  {
    _id: "3",
    patientId: {
      _id: "p3",
      fullName: "Robert Williams",
      email: "robert@example.com",
      phone: "5551234567"
    },
    psychologistId: "psy1",
    scheduledTime: {
      date: new Date(Date.now() - 172800000), // 2 days ago
      startTime: new Date(Date.now() - 172800000 + 3600000), // 2 days ago, 1 hour later
      endTime: new Date(Date.now() - 172800000 + 7200000), // 2 days ago, 2 hours later
    },
    status: "Cancelled",
    notes: {
      patient: "Appointment for stress management",
      psychologist: "Patient cancelled due to schedule conflict"
    }
  }
];

export const getAllAppointments = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    data: mockAppointments
  };
};

export const getAppointmentsByDate = async (date) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter appointments by date
  const dateStr = new Date(date).toDateString();
  const filtered = mockAppointments.filter(appt => 
    new Date(appt.scheduledTime.date).toDateString() === dateStr
  );
  
  return {
    data: filtered
  };
};

export const getAppointmentById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const appointment = mockAppointments.find(appt => appt._id === id);
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  
  return {
    data: appointment
  };
};

export const updateAppointmentNotes = async (id, notes) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const appointmentIndex = mockAppointments.findIndex(appt => appt._id === id);
  if (appointmentIndex === -1) {
    throw new Error("Appointment not found");
  }
  
  // Update notes
  mockAppointments[appointmentIndex].notes.psychologist = notes;
  
  return {
    data: mockAppointments[appointmentIndex],
    message: "Notes updated successfully"
  };
};

export default {
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointmentNotes
};

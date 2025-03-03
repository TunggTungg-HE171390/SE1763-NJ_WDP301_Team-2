// Mock Data for Appointments
const mockAppointments = {
  "1": {
    id: 1,
    patientName: "Nguyen Van A",
    patientAge: 35,
    patientGender: "Nam",
    date: "2023-10-15",
    time: "10:00 AM",
    duration: 60,
    status: "Confirmed",
    reason: "Lo âu và khó ngủ",
    notes: "Bệnh nhân báo cáo tình trạng lo âu gia tăng trong các tình huống xã hội",
    medicalHistory: "Không có tiền sử điều trị sức khỏe tâm thần trước đây",
    contactNumber: "+84 912 345 678",
    email: "nguyenvana@example.com"
  },
  "2": {
    id: 2,
    patientName: "Tran Thi B",
    patientAge: 28,
    patientGender: "Nữ",
    date: "2023-10-16",
    time: "2:30 PM",
    duration: 60,
    status: "Pending",
    reason: "Triệu chứng trầm cảm",
    notes: "Cuộc hẹn tiếp theo sau buổi tư vấn ban đầu",
    medicalHistory: "Đang uống thuốc chống trầm cảm từ tháng 1",
    contactNumber: "+84 987 654 321",
    email: "tranthib@example.com"
  },
  "3": {
    id: 3,
    patientName: "Le Van C",
    patientAge: 42,
    patientGender: "Nam",
    date: "2023-10-17",
    time: "9:00 AM",
    duration: 45,
    status: "Cancelled",
    reason: "Căng thẳng liên quan đến công việc",
    notes: "Bệnh nhân gặp vấn đề về giấc ngủ, căng thẳng cao do áp lực công việc",
    medicalHistory: "Cao huyết áp, đã điều trị tâm lý trước đây vào năm 2020",
    cancelReason: "Bệnh nhân có việc đột xuất không thể tham dự",
    contactNumber: "+84 909 123 456",
    email: "levanc@example.com"
  },
  "4": {
    id: 4,
    patientName: "Pham Thi D",
    patientAge: 19,
    patientGender: "Nữ",
    date: "2023-10-17", // Same date as appointment 3
    time: "3:00 PM",
    duration: 60,
    status: "Rescheduled",
    reason: "Khó khăn trong học tập và các mối quan hệ",
    notes: "Sinh viên năm nhất đại học, gặp khó khăn trong việc thích nghi với môi trường mới",
    medicalHistory: "Không có tiền sử vấn đề tâm lý",
    rescheduleReason: "Trùng lịch thi",
    contactNumber: "+84 976 888 999",
    email: "phamthid@example.com"
  },
  "5": {
    id: 5,
    patientName: "Hoang Van E",
    patientAge: 45,
    patientGender: "Nam",
    date: "2023-10-18",
    time: "10:30 AM",
    duration: 60,
    status: "Confirmed",
    reason: "Vấn đề về quan hệ gia đình",
    notes: "Khó khăn trong mối quan hệ với con cái tuổi teen",
    medicalHistory: "Không có",
    contactNumber: "+84 912 345 222",
    email: "hoangvane@example.com"
  },
  "6": {
    id: 6,
    patientName: "Nguyen Thi F",
    patientAge: 32,
    patientGender: "Nữ",
    date: "2023-10-19",
    time: "1:00 PM",
    duration: 60,
    status: "Confirmed",
    reason: "Rối loạn lo âu",
    notes: "Lo lắng quá mức về công việc và tương lai",
    medicalHistory: "Đã từng điều trị lo âu năm 2021",
    contactNumber: "+84 987 123 456",
    email: "nguyenthif@example.com"
  }
};

// Get all appointments
export const getAllAppointments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Convert object to array
      const appointmentsArray = Object.values(mockAppointments);
      resolve(appointmentsArray);
    }, 800);
  });
};

// Get appointments by date
export const getAppointmentsByDate = (date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter appointments by date
      const appointmentsArray = Object.values(mockAppointments);
      const filteredAppointments = appointmentsArray.filter(
        appointment => appointment.date === date
      );
      resolve(filteredAppointments);
    }, 800);
  });
};

// Mock API functions
export const getAppointmentById = (id) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const appointment = mockAppointments[id];
      if (appointment) {
        resolve(appointment);
      } else {
        reject(new Error("Appointment not found"));
      }
    }, 800);
  });
};

export const updateAppointmentNotes = (id, notes) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const appointment = mockAppointments[id];
      if (appointment) {
        appointment.notes = notes;
        resolve(appointment);
      } else {
        reject(new Error("Appointment not found"));
      }
    }, 800);
  });
};

export const cancelAppointment = (id, reason) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const appointment = mockAppointments[id];
      if (appointment) {
        appointment.status = "Cancelled";
        appointment.cancelReason = reason || "";
        resolve(appointment);
      } else {
        reject(new Error("Appointment not found"));
      }
    }, 800);
  });
};

export const rescheduleAppointment = (id, date, time, reason) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const appointment = mockAppointments[id];
      if (appointment) {
        appointment.status = "Rescheduled";
        appointment.date = date;
        appointment.time = time;
        appointment.rescheduleReason = reason;
        resolve(appointment);
      } else {
        reject(new Error("Appointment not found"));
      }
    }, 800);
  });
};

export const confirmAppointment = (id) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const appointment = mockAppointments[id];
      if (appointment) {
        appointment.status = "Confirmed";
        resolve(appointment);
      } else {
        reject(new Error("Appointment not found"));
      }
    }, 800);
  });
};

export default {
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointmentNotes,
  cancelAppointment,
  rescheduleAppointment,
  confirmAppointment
};

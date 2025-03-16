// Mock data for schedule API testing

// Helper to generate dates relative to today
const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0]; // Returns in YYYY-MM-DD format
};

// Generate times throughout the day
const generateTimeSlots = () => [
  '08:00 AM', 
  '09:30 AM', 
  '10:00 AM', 
  '11:15 AM',
  '01:00 PM',
  '02:30 PM',
  '03:45 PM',
  '05:00 PM'
];

// Patient names for variety
const patientNames = [
  'Nguyễn Văn An', 
  'Trần Thị Bình', 
  'Lê Quang Cường', 
  'Phạm Minh Duy', 
  'Hoàng Thị Lan',
  'Vũ Đức Mạnh',
  'Đỗ Thị Ngọc',
  'Ngô Quốc Phong',
  'Bùi Thúy Quỳnh',
  'Đặng Trung Sơn',
  'Trịnh Hồng Thắm',
  'Lý Văn Uy',
  'Mai Thị Vân',
  'Đinh Xuân Yên'
];

// Status options
const statusOptions = ['confirmed', 'pending', 'cancelled', 'completed', 'rescheduled'];

// Generate a database of mock schedules
const generateMockSchedules = () => {
  let mockSchedules = [];
  let id = 1;
  
  // Past appointments (last 2 weeks)
  for (let i = -14; i < 0; i += 2) {
    const date = getRelativeDate(i);
    const times = generateTimeSlots().slice(0, 3); // Fewer past appointments
    
    times.forEach(time => {
      if (Math.random() > 0.3) { // 70% chance to create an appointment for this slot
        mockSchedules.push({
          id: id++,
          date,
          time,
          patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
          duration: 30 + Math.floor(Math.random() * 3) * 15, // 30, 45, or 60 minutes
          status: statusOptions[Math.floor(Math.random() * 3) + 2], // completed, cancelled, or rescheduled
          reason: getRandomReason(),
          notes: Math.random() > 0.5 ? getRandomNotes() : '',
          psychologistId: 1,
          patientId: Math.floor(Math.random() * 10) + 1
        });
      }
    });
  }
  
  // Current and future appointments (next 30 days)
  for (let i = 0; i < 30; i++) {
    const date = getRelativeDate(i);
    const times = generateTimeSlots();
    
    // Randomize which time slots have appointments
    times.forEach(time => {
      if (Math.random() > 0.6) { // 40% chance to create an appointment for this slot
        mockSchedules.push({
          id: id++,
          date,
          time,
          patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
          duration: 30 + Math.floor(Math.random() * 3) * 15, // 30, 45, or 60 minutes
          status: statusOptions[Math.floor(Math.random() * 2)], // confirmed or pending
          reason: getRandomReason(),
          notes: Math.random() > 0.7 ? getRandomNotes() : '',
          psychologistId: 1,
          patientId: Math.floor(Math.random() * 10) + 1
        });
      }
    });
  }
  
  return mockSchedules;
};

// Generate random reason for the appointment
function getRandomReason() {
  const reasons = [
    'Tư vấn sức khỏe tâm lý',
    'Trầm cảm',
    'Lo âu, stress',
    'Vấn đề gia đình',
    'Rối loạn giấc ngủ',
    'Vấn đề mối quan hệ',
    'Tư vấn nghề nghiệp',
    'Khám định kỳ',
    'Theo dõi điều trị',
    'Đánh giá tâm lý'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Generate random notes
function getRandomNotes() {
  const notes = [
    'Bệnh nhân cần theo dõi thêm',
    'Tiếp tục liệu trình điều trị hiện tại',
    'Cần đánh giá lại sau 2 tuần',
    'Xem xét điều chỉnh phương pháp trị liệu',
    'Bệnh nhân có tiến triển tích cực',
    'Cần trao đổi với gia đình bệnh nhân',
    'Giới thiệu tham gia nhóm hỗ trợ',
    'Cân nhắc tăng tần suất các buổi trị liệu'
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

// Generate the initial dataset
const mockSchedules = generateMockSchedules();

// Mock API implementation
const mockScheduleApi = {
  getSchedules: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSchedules]);
      }, 500); // Simulate network delay
    });
  },
  
  getScheduleById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const schedule = mockSchedules.find(s => s.id === parseInt(id));
        if (schedule) {
          resolve({...schedule});
        } else {
          reject(new Error(`Schedule with ID ${id} not found`));
        }
      }, 300);
    });
  },
  
  createSchedule: (scheduleData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSchedule = {
          id: mockSchedules.length > 0 ? Math.max(...mockSchedules.map(s => s.id)) + 1 : 1,
          ...scheduleData,
          status: scheduleData.status || 'pending'
        };
        mockSchedules.push(newSchedule);
        resolve({...newSchedule});
      }, 500);
    });
  },
  
  updateSchedule: (id, scheduleData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockSchedules.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
          mockSchedules[index] = { ...mockSchedules[index], ...scheduleData };
          resolve({...mockSchedules[index]});
        } else {
          reject(new Error(`Schedule with ID ${id} not found`));
        }
      }, 500);
    });
  },
  
  deleteSchedule: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockSchedules.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
          const deletedSchedule = mockSchedules[index];
          mockSchedules.splice(index, 1);
          resolve({...deletedSchedule, deleted: true});
        } else {
          reject(new Error(`Schedule with ID ${id} not found`));
        }
      }, 500);
    });
  }
};

export default mockScheduleApi;

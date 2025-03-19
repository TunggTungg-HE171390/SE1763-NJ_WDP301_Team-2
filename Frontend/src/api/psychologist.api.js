import apiClient from "./apiClient";

export const getPsychologistList = async () => {
    return await apiClient.get("psychologist/get-psychologist-list");
};

export const getSpecializationList = async () => {
    return await apiClient.get("psychologist/get-specialization-list");
};

// Update getPsychologist to correctly fetch individual records
export const getPsychologist = async (id) => {
    console.log(`Fetching psychologist data for ID: ${id}`);
    try {
        return await apiClient.get(`/users/psychologist/${id}`);
    } catch (error) {
        console.error(`Error fetching psychologist data: ${error.message}`);
        throw error;
    }
};

export const getScheduleListByDoctorId = async (id) => {
    return await apiClient.get(`psychologist/scheduleList/${id}`);
};

export const getScheduleById = async (id) => {
    return await apiClient.get(`psychologist/schedule/${id}`);
};

export const saveAppointment = async (formData) => {
    return apiClient.post("/psychologist/save-appointment", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type
        },
    });
};

export const getAppointmentById = async (id) => {
    return await apiClient.get(`/psychologist/appointment/${id}`);
};

// Update getAllPsychologists function to handle the response better
export const getAllPsychologists = async () => {
    try {
        console.log("Fetching all psychologists from database");
        
        // Force cache refresh by adding a timestamp parameter
        const timestamp = new Date().getTime();
        const response = await apiClient.get(`/psychologist/get-psychologist-list?_t=${timestamp}`);
        
        console.log("Raw Axios psychologist response:", response);
        
        // Log specific information about the data structure
        if (response && response.data) {
            console.log("Response data type:", typeof response.data);
            console.log("Is array:", Array.isArray(response.data));
            
            // Additional logging to better understand the structure
            if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                console.log("Object keys:", Object.keys(response.data));
                
                // Check for nested data structures
                if (response.data.data) {
                    console.log("Has nested data property:", typeof response.data.data);
                    console.log("Nested data is array:", Array.isArray(response.data.data));
                }
            }
        } else {
            console.log("Response does not contain data property");
        }
        
        return response;
    } catch (error) {
        console.error("Error fetching psychologists:", error.message);
        throw error;
    }
};

// New function to update psychologist status
export const updatePsychologistStatus = async (id, status) => {
    return await apiClient.patch(`/users/${id}/status`, { status });
};

// New function to get psychologist by ID (detailed info)
export const getPsychologistDetails = async (id) => {
    console.log(`Fetching detailed psychologist data for ID: ${id}`);
    try {
        return await apiClient.get(`/users/psychologist/${id}/details`);
    } catch (error) {
        console.error(`Error fetching detailed psychologist data: ${error.message}`);
        throw error;
    }
};

// Helper function to generate mock data for development
const getMockPsychologist = (id) => {
    return {
        _id: id,
        fullname: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        gender: 'Nam',
        dateOfBirth: '1985-03-15',
        address: '123 Đường Lê Lợi, Quận 1, TP. HCM',
        specialization: 'Tâm lý lâm sàng',
        experience: 8,
        education: [
            { degree: 'Tiến sĩ Tâm lý học', institution: 'Đại học Y Hà Nội', year: '2015' },
            { degree: 'Thạc sĩ Tâm lý học lâm sàng', institution: 'Đại học Khoa học Xã hội và Nhân văn', year: '2010' },
        ],
        certifications: [
            { name: 'Chứng chỉ hành nghề tâm lý trị liệu', issuedBy: 'Bộ Y tế', year: '2015' },
            { name: 'Chứng chỉ tham vấn tâm lý', issuedBy: 'Hiệp hội Tâm lý Việt Nam', year: '2016' },
        ],
        bio: 'Tiến sĩ Nguyễn Văn A có hơn 8 năm kinh nghiệm trong lĩnh vực tâm lý lâm sàng. Chuyên gia trong việc điều trị các vấn đề về lo âu, trầm cảm và rối loạn tâm lý ở người trưởng thành.',
        workingHours: [
            { day: 'Thứ 2 - Thứ 6', hours: '8:00 - 17:00' },
            { day: 'Thứ 7', hours: '8:00 - 12:00' },
        ],
        rating: 4.8,
        reviews: [
            { id: 1, user: 'Trần B', date: '2023-05-15', rating: 5, comment: 'Bác sĩ tư vấn rất tận tâm, giúp tôi vượt qua giai đoạn khó khăn.' },
            { id: 2, user: 'Lê C', date: '2023-04-22', rating: 4, comment: 'Môi trường tư vấn chuyên nghiệp, hiểu rõ vấn đề của tôi.' },
        ],
        status: 'active',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    };
};

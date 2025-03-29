import apiClient from "./apiClient";

export const getPsychologistList = async () => {
    return await apiClient.get("psychologist/get-psychologist-list");
};

export const getSpecializationList = async () => {
    return await apiClient.get("psychologist/get-specialization-list");
};

// Also check the implementation of getPsychologist
export const getPsychologist = async (id) => {
    try {
        console.log(`API call: Getting psychologist with ID: ${id}`);
        // Add explicit logging to show the URL being called
        const response = await apiClient.get(`/psychologist/${id}`);
        console.log("API response for getPsychologist:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in getPsychologist API call:", error);
        throw error;
    }
};

export const getScheduleListByDoctorIdForStaff = async (id) => {
    try {
        if (!id) {
            console.error("Invalid psychologist ID provided:", id);
            throw new Error("Psychologist ID is required");
        }

        console.log(`Getting schedule list for psychologist ID: ${id}`);

        // Fix the endpoint URL - remove any accidental prefixes
        const url = `/psychologist/scheduleList/${id}`;
        console.log(`Making API request to: ${url}`);

        const response = await apiClient.get(url);
        console.log(`Schedule API response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching schedule for psychologist ${id}:`, error);
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
    return await apiClient.post("/psychologist/save-appointment", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type
        },
    });
};

export const getAppointmentById = async (id) => {
    return await apiClient.get(`/psychologist/appointment/${id}`);
};

// Get all psychologists (for staff management)
export const getAllPsychologists = async () => {
    try {
        console.log("Fetching all psychologists from API");
        const response = await apiClient.get("/psychologist/get-psychologist-list");

        console.log("Raw API response:", response);

        if (!response || !response.data) {
            console.warn("Received empty response from psychologist API");
            return { success: false, data: [] };
        }

        // Return the raw response data to be processed by our data extractor
        return response.data;
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

// Update psychologist's medical experience
export const updatePsychologistExperience = async (id, data) => {
    console.log(`Updating experience for psychologist with ID: ${id}`, data);
    try {
        return await apiClient.put(`/psychologist/${id}/experience`, data);
    } catch (error) {
        console.error(`Error updating psychologist experience: ${error.message}`);
        throw error;
    }
};

// Update psychologist's work history
export const updatePsychologistWorkHistory = async (id, data) => {
    console.log(`Updating work history for psychologist with ID: ${id}`, data);
    try {
        return await apiClient.put(`/psychologist/${id}/work-history`, data);
    } catch (error) {
        console.error(`Error updating psychologist work history: ${error.message}`);
        throw error;
    }
};

// Update createAvailabilitySlots to handle both simple date range and explicit slots
export const createAvailabilitySlots = async (psychologistId, startDateOrSlots, endDate) => {
    // Check if the second parameter is an array (slots) or a string (startDate)
    const isSlotArray = Array.isArray(startDateOrSlots);

    console.log(
        isSlotArray
            ? `Creating ${startDateOrSlots.length} custom availability slots for psychologist ${psychologistId}`
            : `Creating availability slots for psychologist ${psychologistId} from ${startDateOrSlots} to ${endDate}`
    );

    try {
        if (isSlotArray) {
            // Case 1: Creating specific slots
            return await apiClient.post("/psychologist/availability/create-multiple", {
                psychologistId,
                slots: startDateOrSlots,
            });
        } else {
            // Case 2: Creating slots by date range
            return await apiClient.post("/psychologist/availability/create", {
                psychologistId,
                startDate: startDateOrSlots,
                endDate,
            });
        }
    } catch (error) {
        console.error(`Error creating availability slots: ${error.message}`);
        throw error;
    }
};

// New function to update availability slot status
export const updateSlotStatus = async (slotId, status, appointmentId = null) => {
    console.log(`Updating status for slot ${slotId} to ${status}`);
    try {
        return await apiClient.patch(`/availability/${slotId}/status`, {
            status,
            appointmentId,
        });
    } catch (error) {
        console.error(`Error updating slot status: ${error.message}`);
        throw error;
    }
};

// Create individual availability slot
export const createIndividualSlot = async (slot) => {
    try {
        return await apiClient.post("/psychologist/availability/create-slot", slot);
    } catch (error) {
        console.error("Error creating individual slot:", error);
        throw error;
    }
};

export const getPsychologistById = async (doctorId) => {
    try {
        console.log(`API call: Getting psychologist with ID: ${doctorId}`);
        const response = await apiClient.get(`/psychologist/${doctorId}`);
        console.log("API response for getPsychologistById:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in getPsychologistById API call:", error);
        throw error;
    }
};

// Helper function to generate mock data for development
const getMockPsychologist = (id) => {
    return {
        _id: id,
        fullname: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        gender: "Nam",
        dateOfBirth: "1985-03-15",
        address: "123 Đường Lê Lợi, Quận 1, TP. HCM",
        specialization: "Tâm lý lâm sàng",
        experience: 8,
        education: [
            { degree: "Tiến sĩ Tâm lý học", institution: "Đại học Y Hà Nội", year: "2015" },
            { degree: "Thạc sĩ Tâm lý học lâm sàng", institution: "Đại học Khoa học Xã hội và Nhân văn", year: "2010" },
        ],
        certifications: [
            { name: "Chứng chỉ hành nghề tâm lý trị liệu", issuedBy: "Bộ Y tế", year: "2015" },
            { name: "Chứng chỉ tham vấn tâm lý", issuedBy: "Hiệp hội Tâm lý Việt Nam", year: "2016" },
        ],
        bio: "Tiến sĩ Nguyễn Văn A có hơn 8 năm kinh nghiệm trong lĩnh vực tâm lý lâm sàng. Chuyên gia trong việc điều trị các vấn đề về lo âu, trầm cảm và rối loạn tâm lý ở người trưởng thành.",
        workingHours: [
            { day: "Thứ 2 - Thứ 6", hours: "8:00 - 17:00" },
            { day: "Thứ 7", hours: "8:00 - 12:00" },
        ],
        rating: 4.8,
        reviews: [
            {
                id: 1,
                user: "Trần B",
                date: "2023-05-15",
                rating: 5,
                comment: "Bác sĩ tư vấn rất tận tâm, giúp tôi vượt qua giai đoạn khó khăn.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                status: "active",
            },
            {
                id: 2,
                user: "Lê C",
                date: "2023-04-22",
                rating: 4,
                comment: "Môi trường tư vấn chuyên nghiệp, hiểu rõ vấn đề của tôi.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                status: "active",
            },
        ],
    };
};

const API = {
    getAppointmentById,
};

export default API;

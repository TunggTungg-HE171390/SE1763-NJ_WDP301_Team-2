/**
 * Utility functions to extract data from various API response formats
 */

/**
 * Extract data array from various response formats
 * @param {object} response - The API response object
 * @returns {array} - The extracted data array or empty array
 */
export const extractArrayData = (response) => {
  if (!response) return [];
  
  // Case 1: Response is already an array
  if (Array.isArray(response)) {
    return response;
  }
  
  // Case 2: Response.data is an array
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Case 3: Response.data.data is an array (common in many APIs)
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  // Case 4: Response is an object with potential array values
  if (typeof response === 'object') {
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      // Try to extract from object values
      const values = Object.values(response.data);
      if (values.length > 0 && Array.isArray(values[0])) {
        return values[0]; // First array found
      }
      
      if (values.length > 0 && typeof values[0] === 'object') {
        return values; // Return values as array of objects
      }
    }
  }
  
  // No valid data format found
  console.warn("Could not extract array data from response:", response);
  return [];
};

/**
 * Process raw psychologist data into a consistent format
 * @param {array} rawData - Raw psychologist data array
 * @returns {array} - Processed psychologist data with consistent properties
 */
export const processPsychologistData = (rawData = []) => {
  if (!Array.isArray(rawData)) {
    console.warn("Expected array for processPsychologistData but got:", typeof rawData);
    return [];
  }
  
  return rawData.map(psy => {
    if (!psy) return null;
    
    return {
      _id: psy._id || psy.id,
      fullname: psy.fullname || psy.fullName || psy.name || 'Không có tên',
      email: psy.email || '',
      phone: psy.phone || psy.phoneNumber || '',
      specialization: extractSpecialization(psy),
      experience: extractExperience(psy),
      rating: extractRating(psy),
      avatar: psy.avatar || psy.profileImg || psy.image || null,
      status: psy.status || 'Active'
    };
  }).filter(Boolean); // Remove any null entries
};

// Helper functions to extract nested properties
function extractSpecialization(psy) {
  if (psy.specialization) return psy.specialization;
  if (psy.psychologist?.psychologistProfile?.specialization) 
    return psy.psychologist.psychologistProfile.specialization;
  return 'Chuyên gia tâm lý';
}

function extractExperience(psy) {
  if (psy.experience) return psy.experience;
  if (psy.psychologist?.psychologistProfile?.experience) 
    return psy.psychologist.psychologistProfile.experience;
  return null;
}

function extractRating(psy) {
  if (psy.rating) return psy.rating;
  if (psy.psychologist?.psychologistProfile?.rating) 
    return psy.psychologist.psychologistProfile.rating;
  return null;
}

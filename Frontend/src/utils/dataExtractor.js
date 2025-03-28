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
  
  // Case 1: Response with success, count, and data array structure (match our current API)
  if (response.success && response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Case 2: Response with psychologists array
  if (response.psychologists && Array.isArray(response.psychologists)) {
    return response.psychologists;
  }
  
  // Case 3: Response is already an array
  if (Array.isArray(response)) {
    return response;
  }
  
  // Case 4: Response.data is an array
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Case 5: Response.data.data is an array (common in many APIs)
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
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
      _id: psy._id || psy.id || '',
      fullName: psy.fullName || psy.fullname || psy.name || 'Không có tên',
      email: psy.email || '',
      phone: psy.phone || psy.phoneNumber || '',
      profileImg: psy.profileImg || psy.avatar || psy.image || null,
      status: psy.status || 'Active',
      // Extract psychologist profile data
      specialization: psy.psychologist?.psychologistProfile?.specialization || '',
      professionalLevel: psy.psychologist?.psychologistProfile?.professionalLevel || '',
      educationalLevel: psy.psychologist?.psychologistProfile?.educationalLevel || '',
      rating: psy.psychologist?.psychologistProfile?.rating || 0,
      numberOfRatings: psy.psychologist?.psychologistProfile?.numberOfRatings || 0,
      experienceDetails: psy.psychologist?.psychologistProfile?.medicalExperience || [],
      workHistory: psy.psychologist?.psychologistProfile?.workHistory || []
    };
  }).filter(Boolean); // Remove any null entries
};

// Helper functions removed as they're no longer needed with the flatter structure

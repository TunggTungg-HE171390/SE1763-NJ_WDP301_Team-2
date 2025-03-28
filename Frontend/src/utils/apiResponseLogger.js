/**
 * Utility for diagnosing API responses
 */

/**
 * Deeply analyzes an API response and logs its structure
 * @param {any} response - The API response to analyze
 * @param {string} name - Identifier for this response in logs
 */
export const analyzeApiResponse = (response, name = "API Response") => {
  console.group(`Analysis of ${name}`);
  
  try {
    console.log("Raw value:", response);
    console.log("Type:", typeof response);
    
    if (response === null) {
      console.log("Response is null");
    } else if (Array.isArray(response)) {
      console.log("Is Array with length:", response.length);
      if (response.length > 0) {
        console.log("First item type:", typeof response[0]);
        if (typeof response[0] === 'object' && response[0] !== null) {
          console.log("First item keys:", Object.keys(response[0]));
        }
      }
    } else if (typeof response === 'object') {
      console.log("Object keys:", Object.keys(response));
      
      // Check for Axios response structure
      if (response.data !== undefined) {
        console.log("Has 'data' property - could be Axios response");
        analyzeApiResponse(response.data, `${name}.data`);
      }
      
      // Check for common REST API patterns
      if (response.success !== undefined) {
        console.log("Has 'success' flag:", response.success);
      }
      
      if (response.message) {
        console.log("Message:", response.message);
      }
      
      if (response.error) {
        console.log("Error:", response.error);
      }
    }
  } catch (error) {
    console.error("Error analyzing response:", error);
  }
  
  console.groupEnd();
};

/**
 * Analyze if a response is a 304 Not Modified response
 * @param {object} response - The API response to check
 * @returns {boolean} Whether the response is a 304
 */
export const is304Response = (response) => {
  return response && 
         response.status === 304 && 
         (!response.data || Object.keys(response.data).length === 0);
};

/**
 * Extract data from different types of responses including 304
 * @param {object} response - The API response
 * @param {string} cachedDataKey - Optional local storage key for cached data
 * @returns {any} The extracted data
 */
export const extractResponseData = (response, cachedDataKey) => {
  // Handle 304 Not Modified - use cached data if available
  if (is304Response(response)) {
    console.log("304 Not Modified detected - using cached data");
    
    if (cachedDataKey && localStorage.getItem(cachedDataKey)) {
      try {
        return JSON.parse(localStorage.getItem(cachedDataKey));
      } catch (e) {
        console.warn("Failed to parse cached data:", e);
      }
    }
    
    return []; // Return empty array if no cache is available
  }
  
  // Normal response handling
  if (response && response.data) {
    // If response.data is an array, return it
    if (Array.isArray(response.data)) {
      // Cache this data for future 304 responses if key provided
      if (cachedDataKey) {
        localStorage.setItem(cachedDataKey, JSON.stringify(response.data));
      }
      return response.data;
    }
    
    // If response.data has a data property that is an array, return it
    if (response.data.data && Array.isArray(response.data.data)) {
      if (cachedDataKey) {
        localStorage.setItem(cachedDataKey, JSON.stringify(response.data.data));
      }
      return response.data.data;
    }
    
    // If response.data has success and data properties
    if (response.data.success && response.data.data) {
      if (cachedDataKey) {
        localStorage.setItem(cachedDataKey, JSON.stringify(response.data.data));
      }
      return response.data.data;
    }
  }
  
  // Fallback
  return response;
};

// Usage in code:
// import { analyzeApiResponse } from '../utils/apiResponseLogger';
// analyzeApiResponse(response, "Psychologists Response");

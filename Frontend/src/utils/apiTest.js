/**
 * Utility to test API endpoints directly
 */

export const testApiEndpoint = async (url) => {
  console.log(`Testing API endpoint: ${url}`);
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("API test response:", data);
    return { success: true, data, status: response.status };
  } catch (error) {
    console.error("API test error:", error);
    return { success: false, error: error.message };
  }
};

export const testPsychologistsApi = () => {
  const apiUrl = "http://localhost:3000/api/psychologist/all";
  console.log(`Testing psychologist API at: ${apiUrl}`);
  return testApiEndpoint(apiUrl);
};

// Usage:
// Import this function and call it in your component's useEffect or a button click handler
// testPsychologistsApi().then(result => console.log("API test result:", result));

// Debug helper utility for API issues

export const testApiConnectivity = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { 
      method: 'GET',
      signal: controller.signal,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    const result = {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      cors: response.type
    };
    
    if (response.ok) {
      try {
        const data = await response.json();
        result.data = data;
      } catch (jsonError) {
        result.dataError = 'Could not parse JSON response';
      }
    }
    
    return result;
  } catch (error) {
    return {
      error: error.name,
      message: error.message,
      success: false
    };
  }
};

export const displayEnvironmentInfo = () => {
  const info = {
    apiUrl: import.meta.env.VITE_API_URL,
    mode: import.meta.env.MODE,
    baseUrl: window.location.origin,
    userAgent: navigator.userAgent,
    time: new Date().toISOString()
  };
  
  console.log("Environment Information:", info);
  return info;
};

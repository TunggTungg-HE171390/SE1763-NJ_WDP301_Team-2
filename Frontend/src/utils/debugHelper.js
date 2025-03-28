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

/**
 * Helper function to safely access nested properties in potentially inconsistent API responses
 * @param {object} obj - The object to extract data from
 * @param {string} path - The property path (e.g., "user.profile.name")
 * @param {any} defaultValue - Default value if path doesn't exist
 * @returns {any} The value at the path or defaultValue if not found
 */
export const getNestedValue = (obj, path, defaultValue = '') => {
  if (!obj || !path) return defaultValue;
  
  try {
    const parts = path.split('.');
    let result = obj;
    
    for (const part of parts) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[part];
    }
    
    return result === null || result === undefined ? defaultValue : result;
  } catch (error) {
    console.error(`Error accessing path ${path}:`, error);
    return defaultValue;
  }
};

/**
 * Log detailed object structure for debugging API responses
 * @param {object} obj - The object to analyze
 * @param {string} label - Label for the log
 * @param {number} maxDepth - Maximum depth to traverse
 */
export const debugObjectStructure = (obj, label = 'Object structure', maxDepth = 3) => {
  console.group(label);
  
  if (!obj) {
    console.log('Object is null or undefined');
    console.groupEnd();
    return;
  }
  
  try {
    // Log the raw object for reference
    console.log('Raw object:', obj);
    
    // Create a structure map
    const structureMap = {};
    
    const mapStructure = (value, path = '', depth = 0) => {
      if (depth > maxDepth) return '[Max Depth Reached]';
      
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      
      const type = typeof value;
      
      if (type !== 'object') return type;
      if (Array.isArray(value)) {
        if (value.length === 0) return 'array (empty)';
        
        structureMap[path] = `array (${value.length} items)`;
        
        // Map the first item as a sample
        if (value[0] !== null && typeof value[0] === 'object') {
          mapStructure(value[0], `${path}[0]`, depth + 1);
        } else {
          structureMap[`${path}[0]`] = typeof value[0];
        }
        return `array (${value.length} items)`;
      }
      
      // Handle object
      const keys = Object.keys(value);
      if (keys.length === 0) return 'object (empty)';
      
      structureMap[path] = `object (${keys.length} properties)`;
      
      // Map each property
      keys.forEach(key => {
        const propValue = value[key];
        const propPath = path ? `${path}.${key}` : key;
        
        if (propValue !== null && typeof propValue === 'object') {
          mapStructure(propValue, propPath, depth + 1);
        } else {
          structureMap[propPath] = typeof propValue;
        }
      });
      
      return `object (${keys.length} properties)`;
    };
    
    mapStructure(obj);
    
    // Log the structure map
    console.log('Structure map:');
    Object.entries(structureMap).forEach(([path, type]) => {
      console.log(`${path}: ${type}`);
    });
    
  } catch (error) {
    console.error('Error analyzing object structure:', error);
  }
  
  console.groupEnd();
};

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  // DON'T automatically set Content-Type for all requests
  const headers = {};
  
  // Only set Content-Type if it's NOT FormData and not already provided
  if (!(options.body instanceof FormData) && 
      !options.headers?.['Content-Type'] && 
      !options.headers?.['content-type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error('Authentication failed. Please login again.');
  }
  
  return response;
};

// Add this to src/utils/api.js
export const uploadFile = async (url, formData) => {
  const token = localStorage.getItem('authToken');
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // NO Content-Type header - let browser set it automatically
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });
  
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }
  
  return response;
};

// Helper to extract token from response and store it
export const handleAuthResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data || !data.token) {
    throw new Error('No token received from server');
  }
  
  localStorage.setItem('authToken', data.token);
  return data;
};
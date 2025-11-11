const environment = import.meta.env.VITE_APP_ENV;

//replace console.* for disable log on production
if (environment === 'PROD') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
}

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Debug: Log the API base URL
console.log('API Base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL?.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL, // ensure no trailing slash in base URL
  timeout: 30000, // increased timeout to 30 seconds for slow backend responses
});


// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a password change request - don't logout for wrong current password
      const isPasswordChange = error.config?.url?.includes('/actualizar_clave');
      
      if (!isPasswordChange) {
        // Token expired or invalid - clear session and redirect
        console.warn('API returned 401, token may be expired');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Use window.location.href for reliable redirect
        // This ensures the user is redirected even if the app state is corrupted
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

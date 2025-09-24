import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Debug: Log the API base URL
console.log('API Base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});


// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear session and redirect
      console.warn('API returned 401, token may be expired');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Use window.location.href for reliable redirect
      // This ensures the user is redirected even if the app state is corrupted
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

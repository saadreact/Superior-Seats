import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://superiorseats.ali-khalid.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (since Redux state might not be available in interceptors)
    const token = localStorage.getItem('persist:auth');
    if (token) {
      try {
        const authData = JSON.parse(token);
        const authState = JSON.parse(authData.auth || '{}');
        if (authState.token) {
          config.headers.Authorization = `Bearer ${authState.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem('persist:auth');
      // Redirect to login or refresh token logic can be added here
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api; 
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (since Redux state might not be available in interceptors)
    let token = localStorage.getItem('auth_token');
    
    // Fallback to Redux persist if auth_token not found
    if (!token) {
      const persistAuth = localStorage.getItem('persist:auth');
      if (persistAuth) {
        try {
          const authData = JSON.parse(persistAuth);
          const authState = JSON.parse(authData.auth || '{}');
          token = authState.token;
        } catch (error) {
          console.error('Error parsing auth token:', error);
        }
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      console.error('🚨 Axios Interceptor - 401 Unauthorized Error:', {
        url: error.config?.url,
        method: error.config?.method,
        currentPath: window.location.pathname,
        error: error.response?.data
      });
      
      // Only redirect if we're not already on the home page, login page, or shop pages
      const currentPath = window.location.pathname;
      const protectedPaths = ['/', '/login', '/signup', '/ShopGallery', '/shop-now'];
      
      if (!protectedPaths.includes(currentPath)) {
        console.log('🔄 Axios Interceptor - Redirecting to home page due to 401 error');
        // Clear auth data from localStorage
        localStorage.removeItem('persist:auth');
        localStorage.removeItem('auth_token');
        // Redirect to login or refresh token logic can be added here
        window.location.href = '/';
      } else {
        console.log('🔄 Axios Interceptor - On protected page, not redirecting:', currentPath);
        // Still clear auth data but don't redirect
        localStorage.removeItem('persist:auth');
        localStorage.removeItem('auth_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api; 
import axios, { AxiosInstance } from 'axios';

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Check both possible storage keys
    const directToken = localStorage.getItem('auth_token');
    if (directToken) return directToken;
    
    // Check Redux persist storage
    const persistAuth = localStorage.getItem('persist:auth');
    if (persistAuth) {
      try {
        const authData = JSON.parse(persistAuth);
        if (authData.token) {
          // authData.token is already a JSON string, so we need to parse it
          // But first, let's check if it's already a string or if it needs parsing
          let token = authData.token;
          if (typeof token === 'string' && token.startsWith('"') && token.endsWith('"')) {
            // It's a JSON string, parse it
            token = JSON.parse(token);
          }
          return token;
        }
      } catch (e) {
        // Error parsing persist auth
      }
    }
  }
  return null;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
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
  async (error) => {
    if (error.response?.status === 401) {
      // Clear tokens on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('persist:auth');
      }
    }
    return Promise.reject(error);
  }
);

// Vehicle Make API service class
class VehicleMakesApiService {
  // Get all vehicle makes with pagination and filtering
  async getVehicleMakes(params: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    is_active?: boolean;
  } = {}) {
    try {
      // Set default values for required params
      const defaultParams = {
        page: 1,
        per_page: 15,
        ...params
      };
      
      const queryString = new URLSearchParams(
        Object.entries(defaultParams).filter(([_, v]) => v != null) as string[][]
      ).toString();
      
      const response = await api.get(`/vehicle-makes?${queryString}`);
      
      // Handle the nested response structure: response.data.data.data
      if (response.data && response.data.data && response.data.data.data) {
        return {
          data: response.data.data.data,
          meta: response.data.data.meta || {}
        };
      } else if (response.data && response.data.data) {
        return {
          data: response.data.data,
          meta: response.data.meta || {}
        };
      } else if (response.data) {
        return { data: response.data, meta: response.data.meta || {} };
      }
      return { data: [], meta: {} };
    } catch (error: any) {
      console.error('Error fetching vehicle makes:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle makes');
    }
  }

  // Get single vehicle make by ID
  async getVehicleMake(id: number) {
    try {
      const response = await api.get(`/vehicle-makes/${id}`);
      
      // Handle the specific response structure: response.data.data.vehicle_make
      if (response.data && response.data.data && response.data.data.vehicle_make) {
        return response.data.data.vehicle_make;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      throw new Error('Invalid response structure');
    } catch (error: any) {
      console.error('Error fetching vehicle make:', error);
      if (error.response?.status === 404) {
        throw new Error('Vehicle make not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle make');
    }
  }

  // Create new vehicle make
  async createVehicleMake(data: {
    name: string;
    description?: string;
    is_active?: boolean;
  }) {
    try {
      const response = await api.post('/vehicle-makes', data);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error creating vehicle make:', error);
      
      // Handle 422 validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.message;
        if (validationErrors) {
          // If it's an object with field-specific errors, format them
          if (typeof validationErrors === 'object') {
            const errorMessages = Object.entries(validationErrors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            throw new Error(`Validation failed: ${errorMessages}`);
          } else {
            throw new Error(`Validation failed: ${validationErrors}`);
          }
        } else {
          throw new Error('Validation failed: Please check your input data and try again.');
        }
      }
      
      throw new Error(error.response?.data?.message || 'Failed to create vehicle make');
    }
  }

  // Update existing vehicle make
  async updateVehicleMake(id: number, data: {
    name?: string;
    description?: string;
    is_active?: boolean;
  }) {
    try {
      const response = await api.put(`/vehicle-makes/${id}`, data);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating vehicle make:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Vehicle make not found');
      }
      
      // Handle 422 validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.message;
        if (validationErrors) {
          // If it's an object with field-specific errors, format them
          if (typeof validationErrors === 'object') {
            const errorMessages = Object.entries(validationErrors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            throw new Error(`Validation failed: ${errorMessages}`);
          } else {
            throw new Error(`Validation failed: ${validationErrors}`);
          }
        } else {
          throw new Error('Validation failed: Please check your input data and try again.');
        }
      }
      
      throw new Error(error.response?.data?.message || 'Failed to update vehicle make');
    }
  }

  // Delete vehicle make
  async deleteVehicleMake(id: number) {
    try {
      const response = await api.delete(`/vehicle-makes/${id}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error deleting vehicle make:', error);
      if (error.response?.status === 404) {
        throw new Error('Vehicle make not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete vehicle make');
    }
  }
}

// Export singleton instance
export const vehicleMakesApiService = new VehicleMakesApiService();
export default vehicleMakesApiService;

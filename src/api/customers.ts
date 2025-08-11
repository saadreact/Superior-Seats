import axios from 'axios';
import { Customer } from '@/data/types';

// API Configuration
const API_BASE_URL = 'https://superiorseats.ali-khalid.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Response Types
export interface CustomerResponse {
  data: Customer[];
  message?: string;
  success: boolean;
}

export interface SingleCustomerResponse {
  data: Customer;
  message?: string;
  success: boolean;
}

// Customer API Functions
export const customerAPI = {
  // Get all customers
  getAllCustomers: async (): Promise<Customer[]> => {
    try {
      console.log('Fetching all customers from API...');
      const response = await apiClient.get<CustomerResponse>('/customers');
      console.log('API Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get single customer by ID
  getCustomerById: async (id: string): Promise<Customer> => {
    try {
      console.log(`Fetching customer with ID: ${id}`);
      const response = await apiClient.get<SingleCustomerResponse>(`/customers/${id}`);
      console.log('Customer API Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  // Create new customer (register)
  createCustomer: async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
    try {
      console.log('Creating new customer:', customerData);
      const response = await apiClient.post<SingleCustomerResponse>('/register', customerData);
      console.log('Create customer response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update existing customer
  updateCustomer: async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
    try {
      console.log(`Updating customer ${id}:`, customerData);
      const response = await apiClient.put<SingleCustomerResponse>(`/customers/${id}`, customerData);
      console.log('Update customer response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    try {
      console.log(`Deleting customer with ID: ${id}`);
      await apiClient.delete(`/customers/${id}`);
      console.log('Customer deleted successfully');
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  },
};

// Export the API client for other uses
export default apiClient;

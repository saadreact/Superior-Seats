import axios from 'axios';
import { Customer } from '@/data/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
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
      // Handle unauthorized access - don't redirect automatically
      // Let the component handle the error appropriately
      console.warn('Unauthorized access - token may be invalid or expired');
    }
    return Promise.reject(error);
  }
);

// US States List
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

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

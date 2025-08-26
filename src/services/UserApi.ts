import { apiService } from '@/utils/api';

// Types for user API responses
export interface User {
  id: number;
  email: string;
  username: string;
  role_id: number;
  role_type: string;
  email_verified_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  customer_type?: string;
  name?: string;
  role?: {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    name: string;
    email: string;
    phone: string;
    address?: string | null;
    company_name?: string | null;
    tax_id?: string | null;
    customer_type?: string;
    price_tier_id?: number | null;
    credit_limit?: string;
    outstanding_balance?: string;
    is_active: boolean;
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface UserApiResponse {
  status: 'success' | 'error';
  message: string;
  data: User;
  errors: any | null;
}

class UserApi {
  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    try {
      console.log('👤 UserApi - getCurrentUser called');
      
      const response = await apiService.getCurrentUser();
      console.log('✅ UserApi - getCurrentUser response:', response);
      
      return response;
    } catch (error) {
      console.error('❌ UserApi - getCurrentUser error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  /**
   * Check if user is a retail customer
   */
  isRetailCustomer(userData: User | null): boolean {
    if (!userData) {
      console.log('🔍 UserApi - No user data provided');
      return false;
    }
    
    const customerType = userData.customer_type || 
                        userData.role?.customer_type;
    
    console.log('🔍 UserApi - Customer type check:', {
      userData: userData,
      userDataCustomerType: userData.customer_type,
      roleCustomerType: userData.role?.customer_type,
      finalCustomerType: customerType,
      isRetail: customerType === 'retail'
    });
    
    return customerType === 'retail';
  }
}

// Export a singleton instance
const userApi = new UserApi();
export default userApi;

// Export the class for testing or custom instances
export { UserApi };

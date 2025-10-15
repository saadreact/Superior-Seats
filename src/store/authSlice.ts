import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/utils/api';

// Types
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
  // Optional fields that might exist
  name?: string;
  customer_type?: string;
  role?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    designation: string;
    permissions: string[];
    is_super_admin: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  roles?: Array<{
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
      model_type: string;
      model_id: number;
      role_id: number;
    };
  }>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  // 2FA related states
  requiresTwoFactor: boolean;
  twoFactorToken: string | null;
  pendingLoginEmail: string | null;
  // Email verification related states
  emailVerificationRequired: boolean;
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await apiService.login(credentials.email, credentials.password);
      return result;
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.status === 422) {
        // Validation errors - extract the message from the nested structure
        const errorData = error.response?.data?.errors;
        
        // First check if there's a direct message in errors.message
        if (errorData?.message) {
          return rejectWithValue(errorData.message);
        }
        
        // Otherwise, extract validation messages from errors.errors object
        if (errorData?.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          return rejectWithValue(validationErrors.join(', '));
        }
        
        // Fallback to regular validation errors structure
        if (errorData && typeof errorData === 'object') {
          const errorMessages = Object.values(errorData)
            .filter(val => typeof val === 'string' || Array.isArray(val))
            .flat();
          if (errorMessages.length > 0) {
            return rejectWithValue(errorMessages.join(', '));
          }
        }
      }
      
      if (error.response?.status === 401) {
        // Check if there's a nested error message
        const errorMessage = error.response?.data?.errors?.message || 
                           error.response?.data?.message || 
                           'Invalid email or password. Please try again.';
        return rejectWithValue(errorMessage);
      }
      
      if (error.response?.status === 429) {
        return rejectWithValue('Too many login attempts. Please try again later.');
      }
      
      if (error.response?.status >= 500) {
        return rejectWithValue('Server error. Please try again later.');
      }
      
      // Extract message from nested structure if available
      const errorMessage = error.response?.data?.errors?.message || 
                          error.response?.data?.message || 
                          'Login failed. Please check your credentials and try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    customer_type: string;
    address: string;
    city: string;
    state: string;
    company_name?: string;
  }, { rejectWithValue }) => {
    try {
      const result = await apiService.register(userData);
      return result;
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.status === 422) {
        // Validation errors - extract the message from the nested structure
        const errorData = error.response?.data?.errors;
        
        // First check if there's a direct message in errors.message
        if (errorData?.message) {
          return rejectWithValue(errorData.message);
        }
        
        // Otherwise, extract validation messages from errors.errors object
        if (errorData?.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          return rejectWithValue(validationErrors.join(', '));
        }
        
        // Fallback to regular validation errors structure
        if (errorData && typeof errorData === 'object') {
          const errorMessages = Object.values(errorData)
            .filter(val => typeof val === 'string' || Array.isArray(val))
            .flat();
          if (errorMessages.length > 0) {
            return rejectWithValue(errorMessages.join(', '));
          }
        }
      }
      
      if (error.response?.status === 409) {
        return rejectWithValue('User with this email or username already exists.');
      }
      
      if (error.response?.status >= 500) {
        return rejectWithValue('Server error. Please try again later.');
      }
      
      // Extract message from nested structure if available
      const errorMessage = error.response?.data?.errors?.message || 
                          error.response?.data?.message || 
                          'Registration failed. Please check your information and try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyTwoFactor = createAsyncThunk(
  'auth/verifyTwoFactor',
  async (data: { email: string; otp: string; twoFactorToken?: string }, { rejectWithValue }) => {
    try {
      const result = await apiService.verifyTwoFactor(data.email, data.otp, data.twoFactorToken);
      return result;
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.status === 422) {
        const errorData = error.response?.data?.errors;
        if (errorData?.message) {
          return rejectWithValue(errorData.message);
        }
        if (errorData?.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          return rejectWithValue(validationErrors.join(', '));
        }
        if (errorData && typeof errorData === 'object') {
          const errorMessages = Object.values(errorData)
            .filter(val => typeof val === 'string' || Array.isArray(val))
            .flat();
          if (errorMessages.length > 0) {
            return rejectWithValue(errorMessages.join(', '));
          }
        }
      }
      
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.errors?.message || 
                           error.response?.data?.message || 
                           'Invalid verification code. Please try again.';
        return rejectWithValue(errorMessage);
      }
      
      const errorMessage = error.response?.data?.errors?.message || 
                          error.response?.data?.message || 
                          '2FA verification failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      return true;
    } catch (error: any) {
      // Even if logout API fails, we should still clear local state
      // 401 errors are expected when token is expired
      if (error.response?.status === 401) {
        console.log('Logout with expired token - proceeding with local cleanup');
      } else {
        console.error('Logout API error:', error);
      }
      return true;
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  // 2FA related states
  requiresTwoFactor: false,
  twoFactorToken: null,
  pendingLoginEmail: null,
  // Email verification related states
  emailVerificationRequired: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.requiresTwoFactor = false;
      state.twoFactorToken = null;
      state.pendingLoginEmail = null;
      state.emailVerificationRequired = false;
    },
    clearTwoFactorState: (state) => {
      state.requiresTwoFactor = false;
      state.twoFactorToken = null;
      state.pendingLoginEmail = null;
      state.emailVerificationRequired = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.requiresTwoFactor = false;
        state.twoFactorToken = null;
        state.pendingLoginEmail = null;
        state.emailVerificationRequired = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Check if 2FA is required
        if (action.payload.requiresTwoFactor) {
          state.requiresTwoFactor = true;
          state.twoFactorToken = action.payload.twoFactorToken || null;
          state.pendingLoginEmail = action.payload.email || null;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.emailVerificationRequired = false;
        } else if (action.payload.emailVerificationRequired) {
          // Email verification required
          state.emailVerificationRequired = true;
          state.pendingLoginEmail = action.payload.email || null;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.requiresTwoFactor = false;
          state.twoFactorToken = null;
        } else {
          // Normal login success
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.requiresTwoFactor = false;
          state.twoFactorToken = null;
          state.pendingLoginEmail = null;
          state.emailVerificationRequired = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.requiresTwoFactor = false;
        state.twoFactorToken = null;
        state.pendingLoginEmail = null;
        state.emailVerificationRequired = false;
      });

    // 2FA Verification
    builder
      .addCase(verifyTwoFactor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactor.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.requiresTwoFactor = false;
        state.twoFactorToken = null;
        state.pendingLoginEmail = null;
        state.emailVerificationRequired = false;
        state.error = null;
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Keep 2FA state so user can try again
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Don't automatically authenticate user after registration
        // User needs to verify email and login manually
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Still logout even if API fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials, logout, clearTwoFactorState } = authSlice.actions;
export default authSlice.reducer; 
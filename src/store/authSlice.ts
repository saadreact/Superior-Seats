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
        // Validation errors
        const validationErrors = error.response?.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.values(validationErrors).flat();
          return rejectWithValue(errorMessages.join(', '));
        }
      }
      
      if (error.response?.status === 401) {
        return rejectWithValue('Invalid email or password. Please try again.');
      }
      
      if (error.response?.status === 429) {
        return rejectWithValue('Too many login attempts. Please try again later.');
      }
      
      if (error.response?.status >= 500) {
        return rejectWithValue('Server error. Please try again later.');
      }
      
      return rejectWithValue(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    customer_type: string;
  }, { rejectWithValue }) => {
    try {
      const result = await apiService.register(userData);
      return result;
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.status === 422) {
        // Validation errors
        const validationErrors = error.response?.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.values(validationErrors).flat();
          return rejectWithValue(errorMessages.join(', '));
        }
      }
      
      if (error.response?.status === 409) {
        return rejectWithValue('User with this email or username already exists.');
      }
      
      if (error.response?.status >= 500) {
        return rejectWithValue('Server error. Please try again later.');
      }
      
      return rejectWithValue(error.response?.data?.message || 'Registration failed. Please check your information and try again.');
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
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
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

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 
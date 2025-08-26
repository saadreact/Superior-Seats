import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Check both possible storage keys
    const directToken = localStorage.getItem('auth_token');
    console.log('Direct token from localStorage:', directToken);
    if (directToken) return directToken;
    
    // Check Redux persist storage
    const persistAuth = localStorage.getItem('persist:auth');
    console.log('Redux persist auth:', persistAuth);
    if (persistAuth) {
      try {
        const authData = JSON.parse(persistAuth);
        console.log('Parsed authData:', authData);
        if (authData.token) {
          // authData.token is already a JSON string, so we need to parse it
          // But first, let's check if it's already a string or if it needs parsing
          let token = authData.token;
          console.log('Raw token from authData:', token);
          if (typeof token === 'string' && token.startsWith('"') && token.endsWith('"')) {
            // It's a JSON string, parse it
            token = JSON.parse(token);
            console.log('Parsed token:', token);
          }
          return token;
        }
      } catch (e) {
        console.error('Error parsing persist auth:', e);
      }
    }
  }
  return null;
};


// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://superiorseats.ali-khalid.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('Request interceptor - URL:', config.url);
    console.log('Request interceptor - Token found:', !!token);
    console.log('Request interceptor - Token value:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request interceptor - Authorization header set:', config.headers.Authorization);
    } else {
      console.log('Request interceptor - No token available, skipping auth header');
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
    if (error.response?.status === 401) {
      // Clear tokens on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('persist:auth');
        console.log('401 error - tokens cleared from localStorage');
      }
      
      // Don't redirect on logout endpoint to avoid infinite loops
      if (!error.config?.url?.includes('/logout')) {
        // Optionally redirect to login page for other 401 errors
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service class
class ApiService {
  // Expose axios instance for direct use
  api = api;

  // Authentication
  async login(email: string, password: string) {
    const response = await api.post('/login', { email, password });
    
    // Handle different response structures
    let token, user;
    if (response.data.data) {
      // Nested structure: response.data.data
      token = response.data.data.token;
      user = response.data.data.user;
    } else if (response.data.token) {
      // Direct structure: response.data
      token = response.data.token;
      user = response.data.user;
    } else {
      throw new Error('Invalid response structure from login API');
    }
    
    // Store token in localStorage for immediate use
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('auth_token', token);
    }
    
    return {
      user,
      token
    };
  }

  async register(userData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    customer_type: string;
  }) {
    const response = await api.post('/register', userData);
    const { data } = response.data;
    
    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  }

  async logout() {
    try {
      await api.post('/logout');
      console.log('Logout successful');
    } catch (error: any) {
      // Handle 401 errors gracefully - this is expected when token is expired
      if (error.response?.status === 401) {
        console.log('Token expired or invalid during logout - this is normal');
      } else {
        console.error('Logout error:', error);
      }
    } finally {
      // Clear tokens regardless of API call success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('persist:auth');
        console.log('Local storage cleared');
      }
    }
  }

  isAuthenticated(): boolean {
    return getToken() !== null;
  }

  // Check if token is valid (not expired)
  isTokenValid(): boolean {
    const token = getToken();
    if (!token) return false;
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  // Force logout and clear all auth data
  forceLogout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('persist:auth');
      console.log('Force logout - all auth data cleared');
    }
  }

  // Helper method to map new API payment statuses to frontend expected statuses
  private mapPaymentStatus(apiStatus: string | undefined): string {
    switch (apiStatus) {
      case 'authorized':
      case 'captured':
      case 'completed':
        return 'paid';
      case 'pending':
      case 'processing':
        return 'pending';
      case 'failed':
      case 'declined':
        return 'failed';
      case 'refunded':
      case 'partially_refunded':
        return 'refunded';
      case 'partial':
        return 'partial';
      default:
        return 'pending';
    }
  }

  // Helper method to format address from new API structure
  private formatAddress(address: any): string {
    if (!address) return '';
    
    const parts = [];
    
    // Name line
    const name = `${address.firstName || ''} ${address.lastName || ''}`.trim();
    if (name) parts.push(name);
    
    // Company line
    if (address.company) parts.push(address.company);
    
    // Street address
    if (address.street) parts.push(address.street);
    
    // City, State ZIP
    const cityStateLine = [
      address.city,
      address.state,
      address.postalCode
    ].filter(Boolean).join(', ');
    if (cityStateLine) parts.push(cityStateLine);
    
    // Country
    if (address.country && address.country !== 'US') parts.push(address.country);
    
    return parts.join('\n');
  }

  // ========== ORDER MANAGEMENT APIs ==========

  // Get all orders with filtering and pagination
  async getOrders(params: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}) {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/orders${queryString ? `?${queryString}` : ''}`);
    // Return the full response data which contains data, meta, etc.
    return response.data;
  }



  // Get single order by ID
  async getOrder(id: number) {
    const response = await api.get(`/orders/${id}`);
    const rawData = response.data.data || response.data;
    
    // Check if this is the new API format with nested 'order' object
    if (rawData.order) {
      const newOrder = rawData.order;
      console.log('Raw new order data:', newOrder);
      
      // Transform new API format to old frontend format
      const transformedOrder = {
        id: id, // Use the ID from the request since it's not in response
        order_number: newOrder.orderId || `ORDER-${id}`,
        status: newOrder.status || 'unknown',
        payment_status: this.mapPaymentStatus(newOrder.paymentInfo?.status) || 'pending',
        payment_method: newOrder.paymentInfo?.method || 'unknown',
        total_amount: newOrder.cartSummary?.grandTotal || 0,
        discount_amount: newOrder.cartSummary?.discount || 0,
        tax_amount: newOrder.cartSummary?.tax || 0,
        // Construct addresses from the new format (both structured and formatted)
        shipping_address: newOrder.customerInfo?.shippingAddress || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        },
        billing_address: newOrder.customerInfo?.billingAddress || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        },
        // Add formatted versions for display
        shipping_address_formatted: this.formatAddress(newOrder.customerInfo?.shippingAddress),
        billing_address_formatted: this.formatAddress(newOrder.customerInfo?.billingAddress),
        notes: newOrder.notes || '',
        invoice_number: newOrder.invoiceNumber || '',
        created_at: newOrder.orderDate || new Date().toISOString(),
        updated_at: newOrder.orderDate || new Date().toISOString(),
        
        // Transform customer info - we'll need to find the customer by email later
        user_id: null, // Will be set by matching customer email
        user: {
          id: id, // Fallback ID
          name: `${newOrder.customerInfo?.firstName || ''} ${newOrder.customerInfo?.lastName || ''}`.trim() || 
                `${newOrder.customerInfo?.shippingAddress?.firstName || ''} ${newOrder.customerInfo?.shippingAddress?.lastName || ''}`.trim() || 
                'Unknown Customer',
          email: newOrder.customerInfo?.email || 'unknown@example.com',
          customer_type: 'retail', // Default to retail if not specified
          company_name: newOrder.customerInfo?.shippingAddress?.company || undefined
        },
        // Add separate email for easier matching
        customer_email: newOrder.customerInfo?.email,
        
        // Transform cart items to order items
        items: (newOrder.cartItems || []).map((cartItem: any, index: number) => ({
          id: index + 1, // Generate sequential IDs
          product_id: parseInt(cartItem.itemId) || 0,
          variation_id: 0, // Set to 0 since backend doesn't provide variationId in GET response
          quantity: cartItem.quantity || 0,
          unit_price: cartItem.unitPrice || 0,
          discount_amount: 0, // Not available per item in new format
          total: cartItem.totalPrice || 0,
          product: {
            name: cartItem.name || 'Unknown Product',
            category: 'Unknown Category' // Not available in new format
          },
          variation: {
            name: cartItem.name || 'Unknown Variation', // Use item name as variation name
            material_type: 'Unknown Material',
            color: 'Unknown Color'
          }
        })),
        
        // Vehicle configuration is not in the new format
        vehicle_configuration: undefined
      };
      
      console.log('Transformed order from new API format:', transformedOrder);
      return transformedOrder;
    }
    
    // Return as-is if it's already in the old format
    return rawData;
  }

  // Create new order
  async createOrder(data: {
    cartItems: Array<{
      itemId: string;
      productId: number;
      variationId?: number;
      name: string;
      quantity: number;
      unitPrice: number;
      discountAmount?: number;
      total: number;
      totalPrice: number;
    }>;
    customerInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      billingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
    paymentInfo: {
      method: string;
      amountPaid: number;
      currency: string;
    };
    cartSummary: {
      subTotal: number;
      tax: number;
      discount: number;
      grandTotal: number;
    };
    notes?: string;
    vehicleConfigurationId?: number;
  }) {
    // Pass the data directly to the API in the expected format
    console.log('createOrder received data:', data);
    
    // Handle both old and new data formats for backward compatibility
    let apiData = data;
    if ((data as any).items && !data.cartItems) {
      console.warn('Converting old format data to new format');
      // Convert old format to new format
      const oldData = data as any;
      apiData = {
        cartItems: (oldData.items || []).map((item: any) => ({
          itemId: String(item.product_id),
          productId: item.product_id,
          variationId: item.variation_id,
          name: 'Product Name',
          quantity: item.quantity,
          unitPrice: item.unit_price,
          discountAmount: item.discount_amount || 0,
          total: (item.quantity * item.unit_price) - (item.discount_amount || 0),
          totalPrice: (item.quantity * item.unit_price) - (item.discount_amount || 0)
        })),
        customerInfo: {
          firstName: 'Customer',
          lastName: 'Name',
          email: '',
          phone: '',
          shippingAddress: {
            street: oldData.shipping_address || '',
            city: '',
            state: '',
            postalCode: '',
            country: 'US'
          },
          billingAddress: {
            street: oldData.billing_address || '',
            city: '',
            state: '',
            postalCode: '',
            country: 'US'
          }
        },
        paymentInfo: {
          method: oldData.payment_method || 'cash',
          amountPaid: oldData.total_amount || 0,
          currency: 'USD'
        },
        cartSummary: {
          subTotal: (oldData.total_amount || 0) - (oldData.tax_amount || 0) + (oldData.discount_amount || 0),
          tax: oldData.tax_amount || 0,
          discount: oldData.discount_amount || 0,
          grandTotal: oldData.total_amount || 0
        },
        notes: oldData.notes || '',
        vehicleConfigurationId: oldData.vehicle_configuration_id
      };
    }
    
    console.log('Sending to API:', JSON.stringify(apiData, null, 2));
    try {
      const response = await api.post('/orders', apiData);
      console.log('Order creation API response:', response);
      console.log('Order creation response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data);
      console.error('API Error Status:', error.response?.status);
      console.error('API Error Headers:', error.response?.headers);
      if (error.response?.data?.errors) {
        console.error('Validation Errors Detail:', JSON.stringify(error.response.data.errors, null, 2));
      }
      throw error;
    }
  }

  // Update existing order
  async updateOrder(id: number, data: {
    user_id?: number;
    vehicle_configuration_id?: number;
    shipping_address?: any;
    billing_address?: any;
    notes?: string;
    status?: string;
    payment_method?: string;
    payment_status?: string;
    discount_amount?: number;
    tax_amount?: number;
    items?: Array<{
      id?: number;
      product_id: number;
      variation_id?: number;
      quantity: number;
      unit_price: number;
      discount_amount?: number;
    }>;
  }) {
    console.log('updateOrder received data (old format):', JSON.stringify(data, null, 2));
    
    // Transform old format to new API format
    const transformedData = {
      status: data.status || 'pending',
      cartItems: (data.items || []).map((item, index) => ({
        itemId: item.product_id.toString(),
        productId: item.product_id,
        variationId: item.variation_id || item.product_id,
        name: `Product ${item.product_id}`, // We don't have the name in old format
        variationName: `Variation ${item.variation_id || item.product_id}`,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        discountAmount: item.discount_amount || 0,
        total: (item.quantity * item.unit_price) - (item.discount_amount || 0),
        totalPrice: (item.quantity * item.unit_price) - (item.discount_amount || 0)
      })),
      customerInfo: {
        firstName: '', // We'll need to get this from customer lookup
        lastName: '',
        email: '', // We'll need to get this from customer lookup
        phone: '',
        shippingAddress: typeof data.shipping_address === 'string' ? {
          street: data.shipping_address,
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        } : (data.shipping_address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        }),
        billingAddress: typeof data.billing_address === 'string' ? {
          street: data.billing_address,
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        } : (data.billing_address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US'
        })
      },
      paymentInfo: {
        method: data.payment_method || 'cash',
        amountPaid: data.items ? 
          data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price) - (item.discount_amount || 0), 0) - (data.discount_amount || 0) + (data.tax_amount || 0) : 0,
        currency: 'USD'
      },
      cartSummary: {
        subTotal: data.items ? 
          data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price) - (item.discount_amount || 0), 0) : 0,
        tax: data.tax_amount || 0,
        discount: data.discount_amount || 0,
        grandTotal: data.items ? 
          data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price) - (item.discount_amount || 0), 0) - (data.discount_amount || 0) + (data.tax_amount || 0) : 0
      },
      notes: data.notes || ''
    };

    console.log('updateOrder sending data (new format):', JSON.stringify(transformedData, null, 2));
    const response = await api.put(`/orders/${id}`, transformedData);
    console.log('updateOrder response:', response.data);
    return response.data;
  }

  // Update order status only
  async updateOrderStatus(id: number, data: {
    status: string;
    notes?: string;
  }) {
    const response = await api.patch(`/orders/${id}/status`, data);
    return response.data;
  }

  // Update payment status
  async updatePaymentStatus(id: number, data: {
    payment_status: string;
    payment_method?: string;
    payment_reference?: string;
    notes?: string;
  }) {
    const response = await api.patch(`/orders/${id}/payment-status`, data);
    return response.data;
  }

  // Generate invoice for order
  async generateInvoice(id: number) {
    const response = await api.post(`/orders/${id}/generate-invoice`);
    return response.data;
  }

  // Download invoice PDF
  async downloadInvoice(id: number) {
    const response = await api.get(`/orders/${id}/invoice/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Delete order
  async deleteOrder(id: number) {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }

  // Export orders to CSV/Excel
  async exportOrders(params: {
    format?: 'csv' | 'excel';
    status?: string;
    date_from?: string;
    date_to?: string;
  } = {}) {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/orders/export${queryString ? `?${queryString}` : ''}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // ========== VEHICLE MANAGEMENT APIs ==========

  // Get all vehicle makes
  async getVehicleMakes(params: {
    search?: string;
    is_active?: boolean;
  } = {}) {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/vehicle-makes${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  // Get vehicle models by make
  async getVehicleModels(makeId?: number, params: {
    search?: string;
    is_active?: boolean;
  } = {}) {
    const queryParams: any = { ...params };
    if (makeId) queryParams.make_id = makeId;
    const queryString = new URLSearchParams(Object.entries(queryParams).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/vehicle-models${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  // Get vehicle trims by model
  async getVehicleTrims(modelId?: number, params: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  } = {}) {
    try {
      const queryParams: any = { ...params };
      if (modelId) queryParams.model_id = modelId;
      const queryString = new URLSearchParams(Object.entries(queryParams).filter(([_, v]) => v != null) as string[][]).toString();
      const response = await api.get(`/vehicle-trims${queryString ? `?${queryString}` : ''}`);
      
      // Handle the actual API response structure
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching vehicle trims:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch vehicle trims');
    }
  }

  // Get all vehicle configurations
  async getVehicleConfigurations(params: {
    make_id?: number;
    model_id?: number;
    trim_id?: number;
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  } = {}) {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/vehicle-configurations${queryString ? `?${queryString}` : ''}`);
    return response.data.data || response.data;
  }

  // Get single vehicle configuration
  async getVehicleConfiguration(id: number) {
    const response = await api.get(`/vehicle-configurations/${id}`);
    return response.data;
  }

  // Create vehicle configuration
  async createVehicleConfiguration(data: {
    user_id: number;
    vehicle_trim_id: number;
    seat_style_id: number;
    material_type_id: number;
    item_type_id: number;
    feature_option_id: number;
    color_option_id: number;
    quantity: number;
    name: string;
    description?: string;
    is_active?: boolean;
  }) {
    const response = await api.post('/vehicle-configurations', data);
    return response.data;
  }

  // Update vehicle configuration
  async updateVehicleConfiguration(id: number, data: {
    user_id?: number;
    vehicle_trim_id?: number;
    seat_style_id?: number;
    material_type_id?: number;
    item_type_id?: number;
    feature_option_id?: number;
    color_option_id?: number;
    quantity?: number;
    name?: string;
    description?: string;
    is_active?: boolean;
  }) {
    const response = await api.put(`/vehicle-configurations/${id}`, data);
    return response.data;
  }

  // Delete vehicle configuration
  async deleteVehicleConfiguration(id: number) {
    const response = await api.delete(`/vehicle-configurations/${id}`);
    return response.data;
  }

  // ========== PRODUCT MANAGEMENT APIs ==========

  // Get all products with filtering
  async getProducts(params: {
    category?: string;
    search?: string;
    is_active?: boolean;
    price_min?: number;
    price_max?: number;
    page?: number;
    per_page?: number;
  } = {}) {
    try {
      const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
      const response = await api.get(`/products${queryString ? `?${queryString}` : ''}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return { data: response.data, meta: response.data.meta || {} };
      }
      return { data: [], meta: {} };
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  // Get single product
  async getProduct(id: number) {
    try {
      const response = await api.get(`/products/${id}`);
      console.log('getProduct API response:', response);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      throw new Error('Invalid response structure');
    } catch (error: any) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  // Create product
  async createProduct(data: {
    name: string;
    description?: string;
    category_id?: number;
    vehicle_trim_id?: number;
    price?: number;
    stock?: number;
    is_active?: boolean;
    variation_ids?: number[];
    images?: {
      file: string;
      alt_text: string;
      caption: string;
      set_primary: boolean;
    }[];
  }) {
    try {
      // Convert base64 to File objects for FormData
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.category_id !== undefined) formData.append('category_id', data.category_id.toString());
      if (data.vehicle_trim_id !== undefined) formData.append('vehicle_trim_id', data.vehicle_trim_id.toString());
      if (data.price !== undefined) formData.append('price', data.price.toString());
      if (data.stock !== undefined) formData.append('stock', data.stock.toString());
      if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');
      if (data.variation_ids) {
        data.variation_ids.forEach(id => {
          formData.append('variation_ids[]', id.toString());
        });
      }
      
      // Convert base64 to File objects and add to FormData
      if (data.images && data.images.length > 0) {
        // Ensure only one image is marked as primary
        let primaryFound = false;
        const images = data.images; // Create a local reference
        
        console.log('Processing images for product creation:', images.length);
        
        for (let i = 0; i < images.length; i++) {
          const imageData = images[i];
          const base64Data = imageData.file;
          
          // Convert base64 to blob
          const byteString = atob(base64Data.split(',')[1]);
          const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let j = 0; j < byteString.length; j++) {
            ia[j] = byteString.charCodeAt(j);
          }
          const blob = new Blob([ab], { type: mimeString });
          
          // Create File object
          const file = new File([blob], `image_${i}.${mimeString.split('/')[1]}`, { type: mimeString });
          formData.append('images[]', file);
          
          // Ensure only the first primary image is marked as primary
          let isPrimary = false;
          if (imageData.set_primary && !primaryFound) {
            isPrimary = true;
            primaryFound = true;
            console.log(`Image ${i} marked as primary`);
          } else {
            console.log(`Image ${i} marked as non-primary (set_primary: ${imageData.set_primary}, primaryFound: ${primaryFound})`);
          }
          
          // Add image metadata to image_data array
          formData.append(`image_data[${i}][alt_text]`, imageData.alt_text || '');
          formData.append(`image_data[${i}][caption]`, imageData.caption || '');
          formData.append(`image_data[${i}][set_primary]`, isPrimary ? '1' : '0');
        }
        
        console.log('Final primary image count:', primaryFound ? 1 : 0);
      }
      
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
  
      if (
        error.response?.data?.message?.includes('Duplicate entry') ||
        error.response?.data?.message?.includes('unique_primary_per_product')
      ) {
        throw new Error(
          'Image upload failed: Each product can only have one primary image. Please ensure only one image is marked as primary.'
        );
      }
  
      if (error.response?.data?.message?.includes('Integrity constraint violation')) {
        throw new Error(
          'Database constraint violation. Please check your input data and try again.'
        );
      }
  
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  }
  

  // Update product
  async updateProduct(id: number, data: {
    name?: string;
    description?: string;
    category_id?: number;
    vehicle_trim_id?: number;
    price?: number;
    stock?: number;
    is_active?: boolean;
    variation_ids?: number[];
    images?: {
      file: string;       // base64 string
      alt_text: string;
      caption: string;
      set_primary: boolean;
    }[];
    existing_images?: string[];
    removed_images?: string[];
    primary_image_index?: number;
  }) {
    try {
      // Check if images contain base64 data (JSON format) or File objects (FormData format)
      const hasBase64Images = data.images && data.images.length > 0 && 
        typeof data.images[0].file === 'string' && data.images[0].file.startsWith('data:');
      
      if (hasBase64Images) {
        // Convert base64 to File objects for FormData
        const formData = new FormData();
        
        // Add text fields
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.category_id !== undefined) formData.append('category_id', data.category_id.toString());
        if (data.vehicle_trim_id !== undefined) formData.append('vehicle_trim_id', data.vehicle_trim_id.toString());
        if (data.price !== undefined) formData.append('price', data.price.toString());
        if (data.stock !== undefined) formData.append('stock', data.stock.toString());
        if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');
        if (data.variation_ids) {
          data.variation_ids.forEach(id => {
            formData.append('variation_ids[]', id.toString());
          });
        }
        
        // Add new fields for image management
        if (data.existing_images) {
          data.existing_images.forEach((imagePath: string) => {
            formData.append('existing_images[]', imagePath);
          });
        }
        
        if (data.removed_images) {
          data.removed_images.forEach((imagePath: string) => {
            formData.append('removed_images[]', imagePath);
          });
        }
        
        if (data.primary_image_index !== undefined) {
          formData.append('primary_image_index', data.primary_image_index.toString());
        }
        
        // Convert base64 to File objects and add to FormData
        // Ensure only one image is marked as primary
        let primaryFound = false;
        const images = data.images!; // We know it exists because of the check above
        
        console.log('Processing images for product update:', images.length);
        
        for (let i = 0; i < images.length; i++) {
          const imageData = images[i];
          const base64Data = imageData.file;
          
          // Convert base64 to blob
          const byteString = atob(base64Data.split(',')[1]);
          const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let j = 0; j < byteString.length; j++) {
            ia[j] = byteString.charCodeAt(j);
          }
          const blob = new Blob([ab], { type: mimeString });
          
          // Create File object
          const file = new File([blob], `image_${i}.${mimeString.split('/')[1]}`, { type: mimeString });
          formData.append('images[]', file);
          
          // Ensure only the first primary image is marked as primary
          let isPrimary = false;
          if (imageData.set_primary && !primaryFound) {
            isPrimary = true;
            primaryFound = true;
            console.log(`Image ${i} marked as primary for update`);
          } else {
            console.log(`Image ${i} marked as non-primary for update (set_primary: ${imageData.set_primary}, primaryFound: ${primaryFound})`);
          }
          
          // Add image metadata to image_data array
          formData.append(`image_data[${i}][alt_text]`, imageData.alt_text || '');
          formData.append(`image_data[${i}][caption]`, imageData.caption || '');
          formData.append(`image_data[${i}][set_primary]`, isPrimary ? '1' : '0');
        }
        
        console.log('Final primary image count for update:', primaryFound ? 1 : 0);
        
        const response = await api.post(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      } else {
        // Use JSON format (for when backend supports it)
        const jsonData: any = {};
        
        if (data.name) jsonData.name = data.name;
        if (data.description) jsonData.description = data.description;
        if (data.category_id !== undefined) jsonData.category_id = data.category_id;
        if (data.vehicle_trim_id !== undefined) jsonData.vehicle_trim_id = data.vehicle_trim_id;
        if (data.price !== undefined) jsonData.price = data.price;
        if (data.stock !== undefined) jsonData.stock = data.stock;
        if (data.is_active !== undefined) jsonData.is_active = data.is_active;
        if (data.variation_ids) jsonData.variation_ids = data.variation_ids;
        if (data.images && data.images.length > 0) jsonData.images = data.images;
        
        const response = await api.put(`/products/${id}`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Handle different response structures
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      
      // Handle specific database constraint violations
      if (error.response?.data?.message?.includes('Duplicate entry') || 
          error.response?.data?.message?.includes('unique_primary_per_product')) {
        throw new Error('Image upload failed: Each product can only have one primary image. Please ensure only one image is marked as primary.');
      }
      
      if (error.response?.data?.message?.includes('Integrity constraint violation')) {
        throw new Error('Database constraint violation. Please check your input data and try again.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  }

  // Delete product
  async deleteProduct(id: number) {
    try {
      const response = await api.delete(`/products/${id}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }

  // Get products by vehicle configuration
  async getProductsByVehicle(vehicleConfigId: number, params: {
    category?: string;
    is_active?: boolean;
  } = {}) {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/vehicle-configurations/${vehicleConfigId}/products${queryString ? `?${queryString}` : ''}`);
    return response.data.data || response.data;
  }

  // ========== VARIATION MANAGEMENT APIs ==========

  // Get all variations with filtering
  async getVariations(params: {
    search?: string;
    is_active?: boolean;
    price_min?: number;
    price_max?: number;
    page?: number;
    per_page?: number;
  } = {}) {
    try {
      const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
      const response = await api.get(`/variations${queryString ? `?${queryString}` : ''}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching variations:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch variations');
    }
  }

  // Get single variation
  async getVariation(id: number) {
    try {
      const response = await api.get(`/variations/${id}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      throw new Error('Invalid response structure');
    } catch (error: any) {
      console.error('Error fetching variation:', error);
      if (error.response?.status === 404) {
        throw new Error('Variation not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch variation');
    }
  }

  // Get variation options for forms
  async getVariationOptions() {
    try {
      const response = await api.get('/variations/options');
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return {};
    } catch (error: any) {
      console.error('Error fetching variation options:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch variation options');
    }
  }

  // Get variations by product
  async getVariationsByProduct(productId: number) {
    try {
      const response = await api.get(`/products/${productId}/variations`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching product variations:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product variations');
    }
  }

  // Create variation
  async createVariation(data: {
    name: string;
    price: number;
    stitch_pattern: string;
    arm_type: string;
    lumbar: string;
    recline_type: string;
    seat_type: string;
    material_type: string;
    heat_option: string;
    seat_item_type: string;
    color: string;
    is_active?: boolean;
    image?: string;  // base64 string
  }) {
    // Check if image is base64 data
    const hasBase64Image = data.image && typeof data.image === 'string' && data.image.startsWith('data:');
    
    if (hasBase64Image) {
      // Convert base64 to File object for FormData
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('stitch_pattern', data.stitch_pattern);
      formData.append('arm_type', data.arm_type);
      formData.append('lumbar', data.lumbar);
      formData.append('recline_type', data.recline_type);
      formData.append('seat_type', data.seat_type);
      formData.append('material_type', data.material_type);
      formData.append('heat_option', data.heat_option);
      formData.append('seat_item_type', data.seat_item_type);
      formData.append('color', data.color);
      
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
      }
      
      // Convert base64 to File object
      const base64Data = data.image;
      if (!base64Data) {
        throw new Error('Image data is required');
      }
      const byteString = atob(base64Data.split(',')[1]);
      const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let j = 0; j < byteString.length; j++) {
        ia[j] = byteString.charCodeAt(j);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `variation_image.${mimeString.split('/')[1]}`, { type: mimeString });
      formData.append('image', file);
      
      const response = await api.post('/variations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } else {
      // Use JSON format (for when backend supports it)
      const jsonData: any = {
        name: data.name,
        price: data.price,
        stitch_pattern: data.stitch_pattern,
        arm_type: data.arm_type,
        lumbar: data.lumbar,
        recline_type: data.recline_type,
        seat_type: data.seat_type,
        material_type: data.material_type,
        heat_option: data.heat_option,
        seat_item_type: data.seat_item_type,
        color: data.color,
      };
      
      if (data.is_active !== undefined) {
        jsonData.is_active = data.is_active;
      }
      
      if (data.image) {
        jsonData.image = data.image;
      }
      
      const response = await api.post('/variations', jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data || response.data;
    }
  }

  // Update variation
  async updateVariation(id: number, data: {
    name: string;
    price: number;
    stitch_pattern: string;
    arm_type: string;
    lumbar: string;
    recline_type: string;
    seat_type: string;
    material_type: string;
    heat_option: string;
    seat_item_type: string;
    color: string;
    is_active?: boolean;
    image?: string;  // base64 string
  }) {
    const jsonData: any = {
      name: data.name,
      price: data.price,
      stitch_pattern: data.stitch_pattern,
      arm_type: data.arm_type,
      lumbar: data.lumbar,
      recline_type: data.recline_type,
      seat_type: data.seat_type,
      material_type: data.material_type,
      heat_option: data.heat_option,
      seat_item_type: data.seat_item_type,
      color: data.color,
    };
    
    if (data.is_active !== undefined) {
      jsonData.is_active = data.is_active;
    }
    
    if (data.image) {
      jsonData.image = data.image;
    }
    
    const response = await api.put(`/variations/${id}`, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data || response.data;
  }

  // Delete variation
  async deleteVariation(id: number) {
    const response = await api.delete(`/variations/${id}`);
    return response.data.data || response.data;
  }

  // ========== PRICE TIERS MANAGEMENT APIs ==========

  // Get all price tiers
  async getPriceTiers(params: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  } = {}) {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/price-tiers${queryString ? `?${queryString}` : ''}`);
    return response.data.data || response.data;
  }

  // Get single price tier
  async getPriceTier(id: number) {
    const response = await api.get(`/price-tiers/${id}`);
    return response.data.data || response.data;
  }

  // Create price tier
  async createPriceTier(data: {
    name: string;
    display_name: string;
    description?: string;
    discount_off_retail_price: number;
    minimum_order_amount?: number;
    is_active: boolean;
  }) {
    const response = await api.post('/price-tiers', data);
    return response.data.data || response.data;
  }

  // Update price tier
  async updatePriceTier(id: number, data: {
    name?: string;
    display_name?: string;
    description?: string;
    discount_off_retail_price?: number;
    minimum_order_amount?: number;
    is_active?: boolean;
  }) {
    const response = await api.put(`/price-tiers/${id}`, data);
    return response.data.data || response.data;
  }

  // Delete price tier
  async deletePriceTier(id: number) {
    const response = await api.delete(`/price-tiers/${id}`);
    return response.data.data || response.data;
  }

  // ========== CUSTOMER MANAGEMENT APIs ==========

  // Get current user information
  async getCurrentUser() {
    try {
      const response = await api.get('/user');
      // Return the nested data field since the API response has a data wrapper
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user information');
    }
  }

  // Get price tiers options
  async getPriceTiersOptions() {
    try {
      const response = await api.get('/price-tiers/options');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching price tiers options:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch price tiers options');
    }
  }

  // Get all customers
  async getCustomers(params: {
    search?: string;
    customer_type?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  } = {}) {
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/customers${queryString ? `?${queryString}` : ''}`);
    // Return the full response.data which contains { data: [...], total, per_page, etc. }
    return response.data;
  }

  // Get single customer
  async getCustomer(id: number) {
    const response = await api.get(`/customers/${id}`);
    return response.data.data || response.data;
  }

  // Create customer
  async createCustomer(data: {
    name: string;
    email: string;
    username: string;
    password: string;
    customer_type: string;
    phone: string;
    address: string;
    company_name?: string;
    tax_id?: string;
    price_tier_id: number;
    credit_limit: number;
  }) {
    const response = await api.post('/register', data);
    return response.data.data || response.data;
  }

  // Update customer
  async updateCustomer(id: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    company_name?: string;
    address?: string;
    customer_type?: string;
    tax_id?: string;
    price_tier_id?: number;
    credit_limit?: number;
  }) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data.data || response.data;
  }

  // Delete customer
  async deleteCustomer(id: number) {
    const response = await api.delete(`/customers/${id}`);
    return response.data.data || response.data;
  }

  // ========== CATEGORY MANAGEMENT APIs ==========

  // Get all categories
  async getCategories(params: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  } = {}) {
    try {
      const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
      const response = await api.get(`/categories${queryString ? `?${queryString}` : ''}`);
      
      // Handle the actual API response structure
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Get single category
  async getCategory(slug: string) {
    try {
      const response = await api.get(`/categories/${slug}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      throw new Error('Invalid response structure');
    } catch (error: any) {
      console.error('Error fetching category:', error);
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }

  // Create category
  async createCategory(data: {
    name: string;
    description?: string;
    slug?: string;
    image_url?: string;
    is_active?: boolean;
    sort_order?: number;
  }) {
    try {
      const response = await api.post('/categories', data);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  }

  // Update category
  async updateCategory(slug: string, data: {
    name?: string;
    description?: string;
    slug?: string;
    image_url?: string;
    is_active?: boolean;
    sort_order?: number;
  }) {
    try {
      const response = await api.put(`/categories/${slug}`, data);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating category:', error);
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  }

  // Delete category
  async deleteCategory(slug: string) {
    try {
      const response = await api.delete(`/categories/${slug}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error deleting category:', error);
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }

  // ========== COLOR MANAGEMENT APIs ==========

  // Get all colors
  async getColors(params: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  } = {}) {
    try {
      const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
      const response = await api.get(`/colors${queryString ? `?${queryString}` : ''}`);
      
      // Handle the actual API response structure
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      console.error('Error fetching colors:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch colors');
    }
  }

  // Get single color
  async getColor(id: number) {
    try {
      const response = await api.get(`/colors/${id}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      throw new Error('Invalid response structure');
    } catch (error: any) {
      console.error('Error fetching color:', error);
      if (error.response?.status === 404) {
        throw new Error('Color not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch color');
    }
  }

  // Create color
  async createColor(data: {
    name: string;
    hex_code?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
  }) {
    try {
      const response = await api.post('/colors', data);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error creating color:', error);
      throw new Error(error.response?.data?.message || 'Failed to create color');
    }
  }

  // Update color
  async updateColor(id: number, data: {
    name?: string;
    hex_code?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
  }) {
    try {
      const response = await api.put(`/colors/${id}`, data);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating color:', error);
      if (error.response?.status === 404) {
        throw new Error('Color not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update color');
    }
  }

  // Delete color
  async deleteColor(id: number) {
    try {
      const response = await api.delete(`/colors/${id}`);
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error deleting color:', error);
      if (error.response?.status === 404) {
        throw new Error('Color not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete color');
    }
  }

  // ========== UTILITY METHODS ==========

  // Debug method
  debugAuthState(): void {
    if (typeof window !== 'undefined') {
      console.log('=== Auth Debug Info ===');
      console.log('Direct token:', localStorage.getItem('auth_token'));
      console.log('Redux auth:', localStorage.getItem('persist:auth'));
      console.log('Token from getToken():', getToken());
      console.log('Is authenticated:', this.isAuthenticated());
      console.log('=======================');
    }
  }

  // Test method to make an authenticated API call
  async testAuthenticatedCall() {
    try {
      const response = await api.get('/orders');
      console.log('Authenticated API call successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Authenticated API call failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
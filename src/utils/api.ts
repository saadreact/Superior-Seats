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
    
    // Extract token and user from the nested data structure
    const { token, user } = response.data.data;
    
    // Store token in localStorage for immediate use
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      console.log('Token stored in localStorage:', token);
      console.log('Token retrieved from getToken():', getToken());
      
      // Check if Redux persist has saved the token after a short delay
      setTimeout(() => {
        console.log('After 100ms - Token from getToken():', getToken());
      }, 100);
    }
    
    return {
      user,
      token
    };
  }

  async register(userData: {
    name: string;
    email: string;
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('persist:auth');
      }
    }
  }

  isAuthenticated(): boolean {
    return getToken() !== null;
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
  } = {}) {
    const queryParams: any = { ...params };
    if (modelId) queryParams.model_id = modelId;
    const queryString = new URLSearchParams(Object.entries(queryParams).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/vehicle-trims${queryString ? `?${queryString}` : ''}`);
    return response.data;
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
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/products${queryString ? `?${queryString}` : ''}`);
    return response.data.data || response.data;
  }

  // Get single product
  async getProduct(id: number) {
    const response = await api.get(`/products/${id}`);
    console.log('getProduct API response:', response);
    console.log('response.data:', response.data);
    console.log('response.data.data:', response.data.data);
    const result = response.data.data || response.data;
    console.log('getProduct returning:', result);
    return result;
  }

  // Create product
  async createProduct(data: {
    name: string;
    description?: string;
    category?: string;
    price?: number;
    stock?: number;
    is_active?: boolean;
    variation_ids?: number[];
    newImages?: File[];
  }) {
    const formData = new FormData();
    
    // Add all text fields
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');
    if (data.variation_ids) {
      data.variation_ids.forEach(id => {
        formData.append('variation_ids[]', id.toString());
      });
    }
    
    // Add multiple images if provided
    if (data.newImages && data.newImages.length > 0) {
      data.newImages.forEach((image, index) => {
        formData.append('images[]', image);
      });
    }
    
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  }

  // Update product
  async updateProduct(id: number, data: {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    stock?: number;
    is_active?: boolean;
    variation_ids?: number[];
    newImages?: File[];
  }) {
    // If there are new images, use POST with multipart/form-data
    if (data.newImages && data.newImages.length > 0) {
      const formData = new FormData();
      
      // Add all text fields that are provided
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      if (data.price !== undefined) formData.append('price', data.price.toString());
      if (data.stock !== undefined) formData.append('stock', data.stock.toString());
      if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');
      if (data.variation_ids) {
        data.variation_ids.forEach(id => {
          formData.append('variation_ids[]', id.toString());
        });
      }
      
      // Add multiple images
      data.newImages.forEach((image, index) => {
        formData.append('images[]', image);
      });
      
      const response = await api.post(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } else {
      // If no new images, use PUT with JSON
      const jsonData: any = {};
      
      if (data.name) jsonData.name = data.name;
      if (data.description) jsonData.description = data.description;
      if (data.category) jsonData.category = data.category;
      if (data.price !== undefined) jsonData.price = data.price;
      if (data.stock !== undefined) jsonData.stock = data.stock;
      if (data.is_active !== undefined) jsonData.is_active = data.is_active;
      if (data.variation_ids) jsonData.variation_ids = data.variation_ids;
      
      const response = await api.put(`/products/${id}`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data || response.data;
    }
  }

  // Delete product
  async deleteProduct(id: number) {
    const response = await api.delete(`/products/${id}`);
    return response.data.data || response.data;
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
    const queryString = new URLSearchParams(Object.entries(params).filter(([_, v]) => v != null) as string[][]).toString();
    const response = await api.get(`/variations${queryString ? `?${queryString}` : ''}`);
    return response.data.data || response.data;
  }

  // Get single variation
  async getVariation(id: number) {
    const response = await api.get(`/variations/${id}`);
    return response.data.data || response.data;
  }

  // Get variation options for forms
  async getVariationOptions() {
    const response = await api.get('/variations/options');
    return response.data.data || response.data;
  }

  // Get variations by product
  async getVariationsByProduct(productId: number) {
    const response = await api.get(`/products/${productId}/variations`);
    return response.data.data || response.data;
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
    image?: File;
  }) {
    const formData = new FormData();
    
    // Add all required fields
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
    
    // Add optional fields
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? '1' : '0');
    }
    
    // Add image if provided
    if (data.image) {
      formData.append('image', data.image);
    }
    
    const response = await api.post('/variations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
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
    image?: File;
  }) {
    // If there's an image, use POST with multipart/form-data
    if (data.image) {
      const formData = new FormData();
      
      // Add all required fields
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
      
      // Add optional fields
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
      }
      
      // Add image
      formData.append('image', data.image);
      
      const response = await api.post(`/variations/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } else {
      // If no image, use PUT with JSON
      const jsonData = {
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
        is_active: data.is_active,
      };
      
      const response = await api.put(`/variations/${id}`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data || response.data;
    }
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
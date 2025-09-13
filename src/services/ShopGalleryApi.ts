import api from '../utils/axios';

// Types for API responses
export interface ProductVariation {
  id: number;
  name: string;
  value: string;
  price_adjustment: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleTrim {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  vehicle_trim?: VehicleTrim;
  variations?: ProductVariation[];
  images?: string[] | any[];
  stock?: number;
  is_active?: boolean;
  show_on_special_shop?: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface PriceTier {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  discount_off_retail_price: string;
  minimum_order_amount?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  customers_count?: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  errors: any | null;
  meta?: {
    timestamp: string;
    request_id: string;
    pagination?: any;
  };
}

export interface ShopGalleryApiParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  vehicle_trim?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'created_at' | 'price' | 'name';
  order?: 'asc' | 'desc';
}

class ShopGalleryApi {
  private baseUrl = '/shop';

  /**
   * Get all products with optional filtering and pagination
   */
  async getProducts(params: ShopGalleryApiParams = {}): Promise<ApiResponse<Product[]>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        vehicle_trim,
        min_price,
        max_price,
        sort = 'created_at',
        order = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort: sort,
        order: order
      });

      // Add optional parameters if they exist
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (vehicle_trim) queryParams.append('vehicle_trim', vehicle_trim);
      if (min_price) queryParams.append('min_price', min_price.toString());
      if (max_price) queryParams.append('max_price', max_price.toString());

      console.log('🛍️ ShopGalleryApi - getProducts called with params:', params);
      console.log('🔗 Request URL:', `${this.baseUrl}/products?${queryParams.toString()}`);

      const response = await api.get<ApiResponse<Product[]>>(
        `${this.baseUrl}/products?${queryParams.toString()}`
      );

      console.log('✅ ShopGalleryApi - getProducts response:', response.data);
      console.log('📊 Products count:', response.data.data?.length || 0);

      return response.data;
    } catch (error) {
      console.error('❌ ShopGalleryApi - getProducts error:', error);
      throw error;
    }
  }

  /**
   * Get special products (products with show_on_special_shop: true)
   */
  async getSpecialProducts(params: ShopGalleryApiParams = {}): Promise<ApiResponse<Product[]>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        vehicle_trim,
        min_price,
        max_price,
        sort = 'created_at',
        order = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort: sort,
        order: order,
        show_on_special_shop: 'true' // Filter for special products only
      });

      // Add optional parameters if they exist
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (vehicle_trim) queryParams.append('vehicle_trim', vehicle_trim);
      if (min_price) queryParams.append('min_price', min_price.toString());
      if (max_price) queryParams.append('max_price', max_price.toString());

      console.log('🛍️ ShopGalleryApi - getSpecialProducts called with params:', params);
      console.log('🔗 Request URL:', `${this.baseUrl}/products?${queryParams.toString()}`);

      const response = await api.get<ApiResponse<Product[]>>(
        `${this.baseUrl}/products?${queryParams.toString()}`
      );

      console.log('✅ ShopGalleryApi - getSpecialProducts response:', response.data);
      console.log('📊 Special products count:', response.data.data?.length || 0);

      // If the API doesn't support server-side filtering, filter on client side
      if (response.data.data && response.data.data.length > 0) {
        const filteredProducts = response.data.data.filter(product => 
          product.show_on_special_shop === true
        );
        
        if (filteredProducts.length !== response.data.data.length) {
          console.log('🔍 ShopGalleryApi - Client-side filtering applied. Original count:', response.data.data.length, 'Filtered count:', filteredProducts.length);
          response.data.data = filteredProducts;
        }
      }

      return response.data;
    } catch (error) {
      console.error('❌ ShopGalleryApi - getSpecialProducts error:', error);
      
      // Fallback: try to get all products and filter client-side
      console.log('🔄 ShopGalleryApi - Attempting fallback with client-side filtering...');
      try {
        const fallbackResponse = await this.getProducts(params);
        if (fallbackResponse.data && fallbackResponse.data.length > 0) {
          const filteredProducts = fallbackResponse.data.filter(product => 
            product.show_on_special_shop === true
          );
          console.log('✅ ShopGalleryApi - Fallback successful. Filtered products:', filteredProducts.length);
          return {
            ...fallbackResponse,
            data: filteredProducts
          };
        }
      } catch (fallbackError) {
        console.error('❌ ShopGalleryApi - Fallback also failed:', fallbackError);
      }
      
      throw error;
    }
  }

  /**
   * Get a single product by ID with variations
   */
  async getProductById(id: number): Promise<Product> {
    try {
      console.log('🛍️ ShopGalleryApi - getProductById called with ID:', id);
      console.log('🔗 Request URL:', `${this.baseUrl}/products/${id}`);

      const response = await api.get<ApiResponse<Product>>(
        `${this.baseUrl}/products/${id}`
      );

      console.log('✅ ShopGalleryApi - getProductById response:', response.data);
      console.log('📦 Product details:', response.data.data);

      return response.data.data!;
    } catch (error) {
      console.error(`❌ ShopGalleryApi - getProductById error for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    try {
      console.log('👤 ShopGalleryApi - getCurrentUser called');
      
      const response = await api.get<ApiResponse<User>>('/user');
      console.log('✅ ShopGalleryApi - getCurrentUser response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('❌ ShopGalleryApi - getCurrentUser error:', error);
      throw error;
    }
  }

  /**
   * Get price tiers for wholesale pricing
   */
  async getPriceTiers(): Promise<ApiResponse<PriceTier[]>> {
    try {
      console.log('💰 ShopGalleryApi - getPriceTiers called');
      
      const response = await api.get<ApiResponse<PriceTier[]>>('/price-tiers/options');
      console.log('✅ ShopGalleryApi - getPriceTiers response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ ShopGalleryApi - getPriceTiers error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    // Check if auth token exists in localStorage
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
    
    return !!token;
  }

  /**
   * Check if user is a retail customer
   */
  isRetailCustomer(userData: User | null): boolean {
    if (!userData) {
      console.log('🔍 ShopGalleryApi - No user data provided');
      return false;
    }
    
    const customerType = userData.customer_type || 
                        userData.role?.customer_type;
    
    console.log('🔍 ShopGalleryApi - Customer type check:', {
      userData: userData,
      userDataCustomerType: userData.customer_type,
      roleCustomerType: userData.role?.customer_type,
      finalCustomerType: customerType,
      isRetail: customerType === 'retail'
    });
    
    return customerType === 'retail';
  }

  /**
   * Get wholesale discount percentage from price tiers
   */
  getWholesaleDiscount(priceTiers: PriceTier[], userData: User | null): number {
    if (priceTiers.length === 0) {
      console.log('💰 ShopGalleryApi - No price tiers available, using default 0% discount');
      return 0;
    }
    
    if (!userData || !userData.role?.price_tier_id) {
      console.log('💰 ShopGalleryApi - No user price tier ID, using default 0% discount');
      return 0;
    }
    
    // Find the user's specific price tier
    const userPriceTier = priceTiers.find(tier => 
      tier.id === userData.role!.price_tier_id && tier.is_active
    );
    
    if (!userPriceTier) {
      console.warn('⚠️ ShopGalleryApi - User price tier not found or inactive:', userData.role!.price_tier_id);
      return 0;
    }
    
    const discount = parseFloat(userPriceTier.discount_off_retail_price);
    console.log('💰 ShopGalleryApi - User discount found:', discount + '%');
    return discount;
  }

  /**
   * Get display price based on customer type
   */
  getDisplayPrice(price: string | number, isAuthenticated: boolean, userData: User | null, priceTiers: PriceTier[]): number {
    const numericPrice = parseFloat(price.toString());
    
    // For non-authenticated users and retail customers, show the same price
    if (!isAuthenticated || this.isRetailCustomer(userData)) {
      console.log('💰 ShopGalleryApi - Non-authenticated/Retail customer - showing standard price:', numericPrice);
      return numericPrice;
    } else {
      // For wholesale customers, apply discount
      const discountPercentage = this.getWholesaleDiscount(priceTiers, userData);
      const discountAmount = (numericPrice * discountPercentage) / 100;
      const discountedPrice = numericPrice - discountAmount;
      
      console.log('💰 ShopGalleryApi - Wholesale customer - applying discount:', {
        originalPrice: numericPrice,
        discountPercentage: discountPercentage + '%',
        discountAmount: discountAmount,
        finalPrice: discountedPrice
      });
      
      return discountedPrice;
    }
  }

  /**
   * Process product images to ensure they have full URLs
   */
  processProductImages(product: Product): string[] {
    try {
      let imagesArray: string[] = [];
      
      // Handle new API structure with images array containing objects
      if (Array.isArray(product.images)) {
        // Extract image_path from each image object
        imagesArray = product.images
          .filter((img: any) => img && img.image_path && typeof img.image_path === 'string')
          .map((img: any) => img.image_path);
      } else if (typeof product.images === 'string') {
        // Fallback for old API structure - parse the JSON string
        try {
          imagesArray = JSON.parse(product.images);
        } catch (parseError) {
          console.error('Error parsing images JSON:', parseError);
        }
      }
      
      // Return the images array with full URLs
      if (imagesArray && imagesArray.length > 0) {
        return imagesArray
          .filter((image: string) => image && typeof image === 'string' && image.trim() !== '')
          .map((image: string) => {
            // If the image already has a full URL, use it as is
            if (image.startsWith('http://') || image.startsWith('https://')) {
              return image;
            }
            // Otherwise, prepend the base URL
            return `https://superiorseats.ali-khalid.com${image}`;
          });
      }
    } catch (error) {
      console.error('Error processing images:', error);
    }
    
    return ['/placeholder-image.jpg'];
  }
}

// Export a singleton instance
const shopGalleryApi = new ShopGalleryApi();
export default shopGalleryApi;

// Export the class for testing or custom instances
export { ShopGalleryApi };

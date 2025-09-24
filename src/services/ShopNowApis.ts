import api from '../utils/axios';

// Base URL for the API - Use environment variable if available, fallback to hardcoded URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Debug logging for base URL
console.log('🔧 ShopNowApis - Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  BASE_URL: BASE_URL
});

// ============================================================================
// TYPES DEFINITIONS
// ============================================================================

// Category Types
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  status: string;
  message: string;
  data: Category[];
  errors: any;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

// Product Types
export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: number;
  product_id: number;
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
  vehicle_model_id: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  is_active: boolean;
  show_on_special_shop?: boolean;
  created_at: string;
  updated_at: string;
  vehicle_trim_id: number;
  category_id: number;
  category: Category;
  variations: ProductVariation[];
  vehicle_trim: VehicleTrim;
  images: ProductImage[];
  primary_image: ProductImage;
  price_tiers?: Array<{
    id: number;
    name: string;
    display_name: string;
    discount_off_retail_price: string;
    created_at: string;
    updated_at: string;
    pivot: {
      product_id: number;
      price_tier_id: number;
      price_adjustment: string;
      is_active: number;
      created_at: string;
      updated_at: string;
    };
  }>;
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: Product[];
  errors?: any;
  meta?: {
    timestamp: string;
    request_id: string;
    pagination?: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
      has_more_pages: boolean;
      links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
      };
    };
  };
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  customer_type: 'retail' | 'wholesale';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role_id?: number; // Add role_id directly on user
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

export interface UserResponse {
  status: string;
  message: string;
  data: User;
}

// Price Tier Types
export interface PriceTierPivot {
  heat_option_id: number;
  price_tier_id: number;
  price_adjustment: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface PriceTier {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  discount_off_retail_price: string; // ✅ Correct field name to match admin API
  minimum_order_amount?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  customers_count?: number;
  pivot?: PriceTierPivot; // Include pivot data for price adjustments
}

export interface PriceTiersResponse {
  status: string;
  message: string;
  data: PriceTier[];
}

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

// Using the working axios instance from utils/axios.ts
// This instance already has proper auth token handling and error handling

// ============================================================================
// SHOP NOW API CLASS
// ============================================================================

class ShopNowApis {
  // ============================================================================
  // CATEGORIES API METHODS
  // ============================================================================

  /**
   * Get all categories
   * @returns Promise<CategoriesResponse>
   */
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await api.get<CategoriesResponse>('/categories');
      return response.data;
    } catch (error) {
      console.warn('⚠️ ShopNowApis - Categories endpoint not available, using fallback:', error);
      // Return a fallback response instead of throwing
      return {
        status: 'success',
        message: 'Categories not available',
        data: [],
        errors: null,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: 'fallback'
        }
      };
    }
  }

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Promise<Category>
   */
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get<{ status: string; message: string; data: Category }>(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`❌ ShopNowApis - Error fetching category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get categories by slug
   * @param slug - Category slug
   * @returns Promise<Category[]>
   */
  async getCategoriesBySlug(slug: string): Promise<Category[]> {
    try {
      const response = await api.get<CategoriesResponse>(`/categories?slug=${slug}`);
      return response.data.data;
    } catch (error) {
      console.error(`❌ ShopNowApis - Error fetching categories by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get active categories only
   * @returns Promise<Category[]>
   */
  async getActiveCategories(): Promise<Category[]> {
    try {
      const response = await api.get<CategoriesResponse>('/categories?is_active=true');
      return response.data.data;
    } catch (error) {
      console.error('❌ ShopNowApis - Error fetching active categories:', error);
      
      throw error;
    }
  }

  // ============================================================================
  // PRODUCTS API METHODS
  // ============================================================================

  /**
   * Get all products with pagination and filtering
   * @param params - Pagination and filtering parameters
   * @returns Promise<ProductsResponse>
   */
  async getProducts(params: {
    page?: number;
    limit?: number;
    show_on_special_shop?: boolean;
    category_id?: number;
    userData?: User | null;
  } = {}): Promise<ProductsResponse> {
    try {
      // Extract customer ID (role_id) from userData parameter or localStorage fallback
      const customerId = (() => {
        // First try to get from userData parameter
        if (params.userData) {
          const roleId = params.userData.role?.id || params.userData.role_id;
          console.log('🔍 ShopNowApis - Using userData role_id:', roleId);
          console.log('🔍 ShopNowApis - userData structure:', {
            hasUserData: !!params.userData,
            hasRole: !!params.userData.role,
            roleId: roleId,
            roleIdType: typeof roleId,
            roleStructure: params.userData.role ? {
              id: params.userData.role.id,
              idType: typeof params.userData.role.id,
              name: params.userData.role.name
            } : null,
            directRoleId: params.userData.role_id,
            directRoleIdType: typeof params.userData.role_id
          });
          return typeof roleId === 'number' ? roleId : null;
        }
        
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem('persist:auth');
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          const userStr = parsed.user;
          const user = userStr ? JSON.parse(userStr) : null;
          
          // Try to get role_id from user.role.id first, then fallback to user.role_id
          const roleId = user?.role?.id || user?.role_id;
          console.log('🔍 ShopNowApis - Using localStorage role_id:', roleId);
          return typeof roleId === 'number' ? roleId : null;
        } catch { return null; }
      })();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // Add special shop filter - ensure it's properly passed as boolean
      if (params.show_on_special_shop !== undefined) {
        queryParams.append('show_on_special_shop', params.show_on_special_shop.toString());
      }
      
      // Add category filter - use category_id as per API specification
      if (params.category_id) {
        queryParams.append('category', params.category_id.toString());
      }
      
      // Build the path with customer ID - use /shop/products/{customer} pattern
      // For no user login, use the pattern: /shop/products/{customer?%7D=
      const basePath = customerId ? `/shop/products/${customerId}` : '/shop/products/{customer?%7D=';
      const queryString = queryParams.toString();
      const path = queryString ? `${basePath}?${queryString}` : basePath;
      
      console.log('🚀 ShopNowApis - Fetching products with params:', params, 'Path:', path);
      console.log('🌐 ShopNowApis - Full URL:', `${BASE_URL}${path}`);
      console.log('🔑 ShopNowApis - Auth token present:', !!localStorage.getItem('auth_token'));
      console.log('👤 ShopNowApis - Customer ID (role_id):', customerId);
      console.log('🔍 ShopNowApis - API Mode:', customerId ? 'Authenticated User' : 'No User Login');
      console.log('📋 ShopNowApis - User Data Summary:', {
        hasUserData: !!params.userData,
        roleId: params.userData?.role?.id || params.userData?.role_id,
        roleName: params.userData?.role?.name,
        customerType: params.userData?.customer_type
      });
      console.log('🔧 ShopNowApis - Query Parameters:', {
        page: params.page,
        limit: params.limit,
        show_on_special_shop: params.show_on_special_shop,
        category_id: params.category_id,
        queryString: queryString
      });
      
      const response = await api.get<ProductsResponse>(path);
      console.log('✅ ShopNowApis - Products response received:', response.data);
      
      // Debug: Log price tiers for first few products
      if (response.data.data && response.data.data.length > 0) {
        console.log('🔍 ShopNowApis - Price tiers analysis for first 3 products:');
        response.data.data.slice(0, 3).forEach((product, index) => {
          console.log(`Product ${index + 1} (${product.name}):`, {
            productId: product.id,
            basePrice: product.price,
            hasPriceTiers: !!product.price_tiers,
            priceTiersCount: product.price_tiers?.length || 0,
            priceTiers: product.price_tiers?.map(tier => ({
              id: tier.id,
              name: tier.name,
              discount: tier.discount_off_retail_price,
              priceAdjustment: tier.pivot?.price_adjustment
            })) || []
          });
        });
      }
      
      return response.data;
    } catch (error) {
      console.warn('⚠️ ShopNowApis - Products endpoint not available, using fallback:', error);
      // Return a fallback response instead of throwing
      return {
        status: 'success',
        message: 'Products not available',
        data: [],
        errors: null,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: 'fallback',
          pagination: {
            current_page: 1,
            from: 1,
            last_page: 1,
            per_page: 10,
            to: 0,
            total: 0,
            has_more_pages: false,
            links: {
              first: '',
              last: '',
              prev: null,
              next: null
            }
          }
        }
      };
    }
  }


  /**
   * Get products by category
   * @param categoryId - Category ID
   * @param userData - User data (optional)
   * @returns Promise<ProductsResponse>
   */
  async getProductsByCategory(categoryId: number, userData?: User | null): Promise<ProductsResponse> {
    try {
      // Extract customer ID (role_id) from userData parameter or localStorage fallback
      const customerId = (() => {
        // First try to get from userData parameter
        if (userData) {
          const roleId = userData.role?.id || userData.role_id;
          return typeof roleId === 'number' ? roleId : null;
        }
        
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem('persist:auth');
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          const userStr = parsed.user;
          const user = userStr ? JSON.parse(userStr) : null;
          
          // Try to get role_id from user.role.id first, then fallback to user.role_id
          const roleId = user?.role?.id || user?.role_id;
          return typeof roleId === 'number' ? roleId : null;
        } catch { return null; }
      })();
      
      const base = customerId ? `/shop/products/${customerId}` : '/shop/products/{customer?%7D=';
      const path = `${base}?category=${categoryId}`;
      const response = await api.get<ProductsResponse>(path);
      return response.data;
    } catch (error) {
      console.error(`❌ ShopNowApis - Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Get product by ID
   * @param id - Product ID
   * @returns Promise<Product>
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await api.get<{ status: string; message: string; data: Product }>(`/product/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`❌ ShopNowApis - Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // USER API METHODS
  // ============================================================================

  /**
   * Get current user
   * @returns Promise<User>
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<UserResponse>('/user');
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ ShopNowApis - User endpoint not available:', error);
      // Return null instead of throwing to indicate no user data
      return null as any;
    }
  }

  /**
   * Check if user is authenticated
   * @returns boolean
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
   * Check if user is retail customer
   * @param userData - User data
   * @returns boolean
   */
  isRetailCustomer(userData: User | null): boolean {
    // Simplified logic: if user is logged in and has price tiers, they get special pricing
    // This function is kept for backward compatibility but simplified
    return false; // Always return false to allow special pricing for logged-in users
  }

  // ============================================================================
  // PRICE TIERS API METHODS
  // ============================================================================

  /**
   * Get price tiers options
   * @returns Promise<PriceTiersResponse>
   */
  async getPriceTiers(): Promise<PriceTiersResponse> {
    try {
      const response = await api.get<PriceTiersResponse>('/price-tiers/options');
      console.log('✅ ShopNowApis - Price tiers options response:', response.data);
      return response.data;
    } catch (error) {
      console.warn('⚠️ ShopNowApis - Price tiers options endpoint not available, using fallback:', error);
      // Return a fallback response instead of throwing
      return {
        status: 'success',
        message: 'Price tiers not available',
        data: []
      };
    }
  }

  /**
   * Get wholesale discount percentage from price tiers
   * @param priceTiers - Array of price tiers
   * @param userData - User data containing price_tier_id
   * @returns number - Discount percentage
   */
  getWholesaleDiscount(priceTiers: PriceTier[], userData: User | null): number {
    if (priceTiers.length === 0) {
      console.log('💰 ShopNowApis - No price tiers available, using default 0% discount');
      return 0;
    }
    
    if (!userData || !userData.role?.price_tier_id) {
      console.log('💰 ShopNowApis - No user price tier ID, using default 0% discount');
      return 0;
    }
    
    // Find the user's specific price tier
    const userPriceTier = priceTiers.find(tier => 
      tier.id === userData.role!.price_tier_id && tier.is_active
    );
    
    if (!userPriceTier) {
      console.warn('⚠️ ShopNowApis - User price tier not found or inactive:', userData.role!.price_tier_id);
      return 0;
    }
    
    const discount = parseFloat(userPriceTier.discount_off_retail_price);
    console.log('💰 ShopNowApis - User discount found:', discount + '%');
    return discount;
  }

  /**
   * Get display price based on customer type
   * @param price - Original price
   * @param isAuthenticated - Whether user is authenticated
   * @param userData - User data
   * @param priceTiers - Price tiers
   * @returns number - Display price
   */
  getDisplayPrice(price: string | number, isAuthenticated: boolean, userData: User | null, priceTiers: PriceTier[]): number {
    const numericPrice = parseFloat(price.toString());
    
    // For non-authenticated users and retail customers, show the same price
    if (!isAuthenticated || this.isRetailCustomer(userData)) {
      console.log('💰 ShopNowApis - Non-authenticated/Retail customer - showing standard price:', numericPrice);
      return numericPrice;
    } else {
      // For wholesale customers, apply discount
      const discountPercentage = this.getWholesaleDiscount(priceTiers, userData);
      const discountAmount = (numericPrice * discountPercentage) / 100;
      const discountedPrice = numericPrice - discountAmount;
      
      console.log('💰 ShopNowApis - Wholesale customer - applying discount:', {
        originalPrice: numericPrice,
        discountPercentage: discountPercentage + '%',
        discountAmount: discountAmount,
        finalPrice: discountedPrice
      });
      
      return discountedPrice;
    }
  }

  /**
   * Get the best price tier for a product based on user's role
   * @param product - Product with price_tiers
   * @param userData - User data
   * @returns Object with price tier info or null
   */
  getBestPriceTierForProduct(product: Product, userData: User | null): {
    tier: any;
    originalPrice: number;
    discountPercentage: number;
    finalPrice: number;
    savings: number;
  } | null {
    console.log('🔍 ShopNowApis - Processing product:', {
      productId: product.id,
      productName: product.name,
      hasUserData: !!userData,
      hasPriceTiers: !!product.price_tiers,
      priceTiersLength: product.price_tiers?.length || 0,
      userData: userData,
      userRoleId: userData?.role?.id || userData?.role_id,
      userRoleIdType: typeof (userData?.role?.id || userData?.role_id)
    });

    // If no user is logged in, return null (show regular price)
    if (!userData) {
      console.log('🔍 ShopNowApis - No user logged in, showing regular price');
      return null;
    }
    
    // TEMPORARY DEBUG: Force price tier display for testing
    // Remove this after debugging
    if (product.price_tiers && product.price_tiers.length > 0) {
      console.log('🔍 ShopNowApis - DEBUG: Forcing price tier display for testing');
      const debugTier = product.price_tiers[0];
      const originalPrice = parseFloat(product.price);
      const discountPercentage = parseFloat(debugTier.discount_off_retail_price);
      const finalPrice = parseFloat(debugTier.pivot?.price_adjustment || '0');
      const savings = originalPrice - finalPrice;
      
      console.log('🔍 ShopNowApis - DEBUG: Forced price tier result:', {
        originalPrice,
        discountPercentage,
        finalPrice,
        savings,
        tierName: debugTier.name
      });
      
      return {
        tier: debugTier,
        originalPrice,
        discountPercentage,
        finalPrice,
        savings
      };
    }

    // If no price tiers available, return null (show regular price)
    if (!product.price_tiers || product.price_tiers.length === 0) {
      console.log('🔍 ShopNowApis - No price tiers for product:', product.id, product.name);
      return null;
    }

    const originalPrice = parseFloat(product.price);
    
    // Get user's role_id
    const userRoleId = userData.role?.id || userData.role_id;
    if (!userRoleId) {
      console.log('🔍 ShopNowApis - No user role ID found:', userData);
      return null;
    }

    console.log('🔍 ShopNowApis - Looking for price tier with role_id:', userRoleId, 'in product:', product.id);
    console.log('🔍 ShopNowApis - Available price tiers:', product.price_tiers.map(tier => ({
      id: tier.id,
      name: tier.name,
      discount: tier.discount_off_retail_price,
      hasPivot: !!tier.pivot,
      priceAdjustment: tier.pivot?.price_adjustment
    })));

    // Find price tier that matches user's role_id (ensure both are numbers for comparison)
    let matchingTier = product.price_tiers.find(tier => 
      Number(tier.id) === Number(userRoleId)
    );
    
    // Fallback: If no exact match, try to find any active price tier for this user
    if (!matchingTier && product.price_tiers.length > 0) {
      console.log('🔍 ShopNowApis - No exact role_id match, trying fallback matching...');
      // For now, let's use the first available price tier as a fallback
      // This can be enhanced later with more sophisticated matching logic
      matchingTier = product.price_tiers[0];
      console.log('🔍 ShopNowApis - Using fallback price tier:', matchingTier);
    }
    
    console.log('🔍 ShopNowApis - Matching tier search result:', {
      userRoleId,
      userRoleIdType: typeof userRoleId,
      matchingTier: matchingTier ? {
        id: matchingTier.id,
        idType: typeof matchingTier.id,
        name: matchingTier.name,
        hasPivot: !!matchingTier.pivot,
        priceAdjustment: matchingTier.pivot?.price_adjustment
      } : null,
      allTierIds: product.price_tiers.map(tier => ({ id: tier.id, idType: typeof tier.id }))
    });
    
    if (!matchingTier || !matchingTier.pivot) {
      console.log('🔍 ShopNowApis - No matching tier found for role_id:', userRoleId);
      return null;
    }

    const discountPercentage = parseFloat(matchingTier.discount_off_retail_price);
    const finalPrice = parseFloat(matchingTier.pivot.price_adjustment);
    const savings = originalPrice - finalPrice;

    console.log('✅ ShopNowApis - Price tier found:', {
      productId: product.id,
      productName: product.name,
      originalPrice,
      discountPercentage: `${discountPercentage}%`,
      finalPrice,
      savings,
      tierName: matchingTier.name
    });

    return {
      tier: matchingTier,
      originalPrice,
      discountPercentage,
      finalPrice,
      savings
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Process product images to get full URLs
   * @param product - Product object
   * @returns string[] - Array of image URLs
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

  /**
   * Map API categories to main categories
   * @param categories - Array of categories from API
   * @returns Object with mapped categories
   */
  mapCategoriesToMainCategories(categories: Category[]) {
    const mappedCategories = {
      seats: [] as Category[],
      'spare-parts': [] as Category[],
      accessories: [] as Category[],
    };

    categories.forEach(category => {
      const categoryName = category.name.toLowerCase();
      
      // Map to seats category
      if (categoryName.includes('seat') || 
          categoryName.includes('truck') ||
          categoryName.includes('motorhome') ||
          categoryName.includes('bus') ||
          categoryName.includes('van') ||
          categoryName.includes('car') ||
          categoryName.includes('racing') ||
          categoryName.includes('office') ||
          categoryName.includes('gaming') ||
          categoryName.includes('rv') ||
          categoryName.includes('limo') ||
          categoryName.includes('driver') ||
          categoryName.includes('passenger')) {
        mappedCategories.seats.push(category);
      }
      // Map to spare parts category
      else if (categoryName.includes('spare') || 
               categoryName.includes('part') ||
               categoryName.includes('belt') ||
               categoryName.includes('cushion') ||
               categoryName.includes('mechanism') ||
               categoryName.includes('frame')) {
        mappedCategories['spare-parts'].push(category);
      }
      // Map to accessories category
      else if (categoryName.includes('accessory') || 
               categoryName.includes('cover') ||
               categoryName.includes('heater') ||
               categoryName.includes('massage') ||
               categoryName.includes('addon')) {
        mappedCategories.accessories.push(category);
      }
    });

    return mappedCategories;
  }

  /**
   * Get category name safely (handle both string and object formats)
   * @param category - Category object or string
   * @returns string - Category name
   */
  getCategoryName(category: any): string {
    if (typeof category === 'string') {
      return category;
    } else if (category && typeof category === 'object' && 'name' in category) {
      return (category as any).name;
    }
    return '';
  }

  /**
   * Check if a product matches a specific category
   * @param productCategory - Product's category
   * @param targetCategory - Target category to match
   * @returns boolean
   */
  matchesCategory(productCategory: any, targetCategory: string): boolean {
    const categoryName = this.getCategoryName(productCategory).toLowerCase();
    const targetLower = targetCategory.toLowerCase();

    switch (targetLower) {
      case 'seats':
        return categoryName.includes('seat') || 
               categoryName.includes('truck') ||
               categoryName.includes('motorhome') ||
               categoryName.includes('bus') ||
               categoryName.includes('van') ||
               categoryName.includes('car') ||
               categoryName.includes('racing') ||
               categoryName.includes('office') ||
               categoryName.includes('gaming') ||
               categoryName.includes('rv') ||
               categoryName.includes('limo') ||
               categoryName.includes('driver') ||
               categoryName.includes('passenger');
      
      case 'spare-parts':
        return categoryName.includes('spare') || 
               categoryName.includes('part') ||
               categoryName.includes('belt') ||
               categoryName.includes('cushion') ||
               categoryName.includes('mechanism') ||
               categoryName.includes('frame');
      
      case 'accessories':
        return categoryName.includes('accessory') || 
               categoryName.includes('cover') ||
               categoryName.includes('heater') ||
               categoryName.includes('massage') ||
               categoryName.includes('addon');
      
      default:
        return categoryName.includes(targetLower);
    }
  }

  /**
   * Get products count by category
   * @param categories - Array of categories
   * @returns Object with category counts
   */
  getCategoryProductCounts(categories: Category[]) {
    const counts: { [key: string]: number } = {};
    
    categories.forEach(category => {
      const mappedCategory = this.mapCategoriesToMainCategories([category]);
      
      if (mappedCategory.seats.length > 0) {
        counts.seats = (counts.seats || 0) + category.products_count;
      }
      if (mappedCategory['spare-parts'].length > 0) {
        counts['spare-parts'] = (counts['spare-parts'] || 0) + category.products_count;
      }
      if (mappedCategory.accessories.length > 0) {
        counts.accessories = (counts.accessories || 0) + category.products_count;
      }
    });
    
    return counts;
  }
}

// Export singleton instance
const shopNowApis = new ShopNowApis();
export default shopNowApis;

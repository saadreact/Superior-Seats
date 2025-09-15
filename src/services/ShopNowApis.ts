import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://superiorseats.ali-khalid.com/api';

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
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: Product[];
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

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error but don't make it too verbose
    if (error.response?.status === 404) {
      console.warn('⚠️ API endpoint not found:', error.config?.url);
    } else if (error.response?.status >= 500) {
      console.warn('⚠️ Server error:', error.response?.status, error.config?.url);
    } else {
      console.warn('⚠️ API request failed:', error.message || 'Unknown error');
    }
    return Promise.reject(error);
  }
);

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
      const response = await apiClient.get<CategoriesResponse>('/shop/categories');
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
      const response = await apiClient.get<{ status: string; message: string; data: Category }>(`/shop/categories/${id}`);
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
      const response = await apiClient.get<CategoriesResponse>(`/shop/categories?slug=${slug}`);
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
      const response = await apiClient.get<CategoriesResponse>('/shop/categories?is_active=true');
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
   * Get all products
   * @returns Promise<ProductsResponse>
   */
  async getProducts(): Promise<ProductsResponse> {
    try {
      const response = await apiClient.get<ProductsResponse>('/shop/products');
      return response.data;
    } catch (error) {
      console.warn('⚠️ ShopNowApis - Products endpoint not available, using fallback:', error);
      // Return a fallback response instead of throwing
      return {
        status: 'success',
        message: 'Products not available',
        data: []
      };
    }
  }

  /**
   * Get special products (show_on_special_shop: true)
   * @returns Promise<ProductsResponse>
   */
  async getSpecialProducts(): Promise<ProductsResponse> {
    try {
      const response = await apiClient.get<ProductsResponse>('/shop/products?show_on_special_shop=true');
      return response.data;
    } catch (error) {
      console.warn('⚠️ ShopNowApis - Special products endpoint not available, using fallback:', error);
      // Return a fallback response instead of throwing
      return {
        status: 'success',
        message: 'Special products not available',
        data: []
      };
    }
  }

  /**
   * Get products by category
   * @param categoryId - Category ID
   * @returns Promise<ProductsResponse>
   */
  async getProductsByCategory(categoryId: number): Promise<ProductsResponse> {
    try {
      const response = await apiClient.get<ProductsResponse>(`/shop/products?category_id=${categoryId}`);
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
      const response = await apiClient.get<{ status: string; message: string; data: Product }>(`/shop/products/${id}`);
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
      const response = await apiClient.get<UserResponse>('/user');
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
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Check if user is retail customer
   * @param userData - User data
   * @returns boolean
   */
  isRetailCustomer(userData: User | null): boolean {
    if (!userData) return true; // Default to retail if no user data
    
    // Check both user.customer_type and user.role.customer_type
    const customerType = userData.customer_type || userData.role?.customer_type;
    return customerType === 'retail';
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
      const response = await apiClient.get<PriceTiersResponse>('/price-tiers/options');
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
   * Get wholesale discount percentage for a specific user
   * @param priceTiers - Array of price tiers
   * @param userData - User data containing price_tier_id
   * @returns number - Discount percentage
   */
  getWholesaleDiscount(priceTiers: PriceTier[], userData: User | null): number {
    if (!priceTiers || priceTiers.length === 0) {
      console.warn('⚠️ ShopNowApis - No price tiers available');
      return 0;
    }
    
    if (!userData) {
      console.warn('⚠️ ShopNowApis - User data not available');
      return 0;
    }
    
    // Get customer type from user data
    const customerType = userData.customer_type || userData.role?.customer_type;
    
    if (!customerType) {
      console.warn('⚠️ ShopNowApis - No customer type found');
      return 0;
    }
    
    // Map customer types to price tier names
    let targetTierName = '';
    switch (customerType.toLowerCase()) {
      case 'retail':
        targetTierName = 'retail_price';
        break;
      case 'wholesale':
        targetTierName = 'Wholesale_price';
        break;
      case 'special':
        targetTierName = 'Special Customer';
        break;
      default:
        console.warn('⚠️ ShopNowApis - Unknown customer type:', customerType);
        return 0;
    }
    
    // Find the matching price tier
    const userPriceTier = priceTiers.find(tier => 
      tier.name === targetTierName || tier.display_name === targetTierName
    );
    
    if (!userPriceTier) {
      console.warn('⚠️ ShopNowApis - Price tier not found for customer type:', {
        customerType,
        targetTierName,
        availableTiers: priceTiers.map(t => ({ id: t.id, name: t.name, display_name: t.display_name }))
      });
      return 0;
    }
    
    // Parse and return the discount percentage
    const discountPercentage = parseFloat(userPriceTier.discount_off_retail_price);
    
    if (isNaN(discountPercentage)) {
      console.warn('⚠️ ShopNowApis - Invalid discount percentage:', userPriceTier.discount_off_retail_price);
      return 0;
    }
    
    console.log('✅ ShopNowApis - Customer type discount applied:', {
      customerType,
      priceTierId: userPriceTier.id,
      priceTierName: userPriceTier.name,
      priceTierDisplayName: userPriceTier.display_name,
      discountOffRetailPrice: userPriceTier.discount_off_retail_price,
      calculatedDiscount: discountPercentage,
      unit: '%'
    });
    
    return discountPercentage;
  }

  /**
   * Get display price based on customer type and user's specific price tier
   * @param price - Original price
   * @param isAuthenticated - Whether user is authenticated
   * @param userData - User data
   * @param priceTiers - Price tiers
   * @returns number - Display price
   */
  getDisplayPrice(price: string | number, isAuthenticated: boolean, userData: User | null, priceTiers: PriceTier[]): number {
    const originalPrice = parseFloat(price.toString());
    
    // If user is not authenticated or is a retail customer, return original price
    if (!isAuthenticated || this.isRetailCustomer(userData)) {
      console.log('💰 ShopNowApis - Retail pricing:', {
        originalPrice,
        reason: !isAuthenticated ? 'Not authenticated' : 'Retail customer'
      });
      return originalPrice;
    }
    
    // Get discount percentage for wholesale customer
    const discountPercentage = this.getWholesaleDiscount(priceTiers, userData);
    
    if (discountPercentage <= 0) {
      console.log('💰 ShopNowApis - No discount applied:', {
        originalPrice,
        discountPercentage,
        reason: 'No valid discount found'
      });
      return originalPrice;
    }
    
    // Calculate discounted price: originalPrice * (1 - discountPercentage/100)
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);
    
    console.log('💰 ShopNowApis - Wholesale price calculation:', {
      originalPrice,
      discountPercentage: `${discountPercentage}%`,
      discountAmount: originalPrice * (discountPercentage / 100),
      discountedPrice,
      userPriceTierId: userData?.role?.price_tier_id,
      userCustomerType: userData?.customer_type
    });
    
    return Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
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
    if (!product.images || product.images.length === 0) {
      return ['/placeholder-image.jpg'];
    }

    return product.images
      .filter(img => img.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => {
        if (img.image_path.startsWith('http')) {
          return img.image_path;
        }
        return `${BASE_URL.replace('/api', '')}${img.image_path}`;
      });
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

import api from '../utils/axios';

// Base URL for the API - Use environment variable if available, fallback to hardcoded URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  is_customize_3d_product?: boolean;
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
    customerId?: number | null;
  } = {}): Promise<ProductsResponse> {
    try {
      // Use customerId directly from params (comes from Redux/localStorage)
      const customerId = params.customerId || null;
      
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
      // For no user login, use the pattern: /shop/products (without customer ID)
      const basePath = customerId ? `/shop/products/${customerId}` : '/shop/products';
      const queryString = queryParams.toString();
      const path = queryString ? `${basePath}?${queryString}` : basePath;
      
      const response = await api.get<ProductsResponse>(path);
      
      return response.data;
    } catch (error) {
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
   * @param customerId - Customer ID (role_id) from Redux/localStorage (optional)
   * @returns Promise<ProductsResponse>
   */
  async getProductsByCategory(categoryId: number, customerId?: number | null): Promise<ProductsResponse> {
    try {
      const base = customerId ? `/shop/products/${customerId}` : '/shop/products';
      const path = `${base}?category=${categoryId}`;
      const response = await api.get<ProductsResponse>(path);
      return response.data;
    } catch (error) {
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
          // Silently handle parsing errors
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
      return response.data;
    } catch (error) {
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
      return 0;
    }
    
    if (!userData || !userData.role?.price_tier_id) {
      return 0;
    }
    
    // Find the user's specific price tier (treat missing is_active as active)
    const userPriceTier = priceTiers.find(tier => 
      tier.id === userData.role!.price_tier_id && (tier.is_active !== false)
    );
    
    if (!userPriceTier) {
      return 0;
    }
    
    const discount = parseFloat(userPriceTier.discount_off_retail_price);
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
      return numericPrice;
    } else {
      // For wholesale customers, apply discount
      const discountPercentage = this.getWholesaleDiscount(priceTiers, userData);
      const discountAmount = (numericPrice * discountPercentage) / 100;
      const discountedPrice = numericPrice - discountAmount;
      
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
    // If no user is logged in, return null (show regular price)
    if (!userData) {
      return null;
    }
    
    // TEMPORARY DEBUG: Force price tier display for testing
    // Remove this after debugging
    if (product.price_tiers && product.price_tiers.length > 0) {
      const debugTier = product.price_tiers[0];
      const originalPrice = parseFloat(product.price);
      const discountPercentage = parseFloat(debugTier.discount_off_retail_price);
      const finalPrice = parseFloat(debugTier.pivot?.price_adjustment || '0');
      const savings = originalPrice - finalPrice;
      
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
      return null;
    }

    const originalPrice = parseFloat(product.price);
    
    // Get user's role_id
    const userRoleId = userData.role?.id || userData.role_id;
    if (!userRoleId) {
      return null;
    }

    // Find price tier that matches user's role_id (ensure both are numbers for comparison)
    let matchingTier = product.price_tiers.find(tier => 
      Number(tier.id) === Number(userRoleId)
    );
    
    // Fallback: If no exact match, try to find any active price tier for this user
    if (!matchingTier && product.price_tiers.length > 0) {
      // For now, let's use the first available price tier as a fallback
      // This can be enhanced later with more sophisticated matching logic
      matchingTier = product.price_tiers[0];
    }
    
    if (!matchingTier || !matchingTier.pivot) {
      return null;
    }

    const discountPercentage = parseFloat(matchingTier.discount_off_retail_price);
    const finalPrice = parseFloat(matchingTier.pivot.price_adjustment);
    const savings = originalPrice - finalPrice;

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
          // Silently handle parsing errors
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
            return `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${image}`;
          });
      }
    } catch (error) {
      // Silently handle processing errors
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

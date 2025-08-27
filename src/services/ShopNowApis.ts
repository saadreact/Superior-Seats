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
}

export interface UserResponse {
  status: string;
  message: string;
  data: User;
}

// Price Tier Types
export interface PriceTier {
  id: number;
  name: string;
  discount_percentage: number;
  minimum_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
    return userData.customer_type === 'retail';
  }

  // ============================================================================
  // PRICE TIERS API METHODS
  // ============================================================================

  /**
   * Get price tiers
   * @returns Promise<PriceTiersResponse>
   */
  async getPriceTiers(): Promise<PriceTiersResponse> {
    try {
      const response = await apiClient.get<PriceTiersResponse>('/shop/price-tiers');
      return response.data;
    } catch (error) {
      console.warn('⚠️ ShopNowApis - Price tiers endpoint not available, using fallback:', error);
      // Return a fallback response instead of throwing
      return {
        status: 'success',
        message: 'Price tiers not available',
        data: []
      };
    }
  }

  /**
   * Get wholesale discount percentage
   * @param priceTiers - Array of price tiers
   * @returns number - Discount percentage
   */
  getWholesaleDiscount(priceTiers: PriceTier[]): number {
    if (!priceTiers || priceTiers.length === 0) return 0;
    
    // Get the highest discount percentage from active tiers
    const activeTiers = priceTiers.filter(tier => tier.is_active);
    if (activeTiers.length === 0) return 0;
    
    return Math.max(...activeTiers.map(tier => tier.discount_percentage));
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
    const originalPrice = parseFloat(price.toString());
    
    if (!isAuthenticated || this.isRetailCustomer(userData)) {
      return originalPrice;
    }
    
    const discountPercentage = this.getWholesaleDiscount(priceTiers);
    return originalPrice * (1 - discountPercentage / 100);
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

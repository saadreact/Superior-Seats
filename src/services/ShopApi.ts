import api from '../utils/axios';

// Types for the API response
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  vehicle_trim?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  // Add more product fields as needed based on your API response
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  has_more_pages: boolean;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  errors: any | null;
  meta: {
    timestamp: string;
    request_id: string;
    pagination?: PaginationMeta;
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface ShopApiParams {
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

class ShopApi {
  private baseUrl = '/shop';

  /**
   * Get products with optional filtering and pagination
   */
  async getProducts(params: ShopApiParams = {}): Promise<ApiResponse<Product[]>> {
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

      console.log('🛍️ ShopApi - getProducts called with params:', params);
      console.log('🔗 Request URL:', `${this.baseUrl}/products?${queryParams.toString()}`);

      const response = await api.get<ApiResponse<Product[]>>(
        `${this.baseUrl}/products?${queryParams.toString()}`
      );

      console.log('✅ ShopApi - getProducts response:', response.data);
      console.log('📊 Products count:', response.data.data?.length || 0);
      console.log('📄 Pagination:', response.data.meta?.pagination);

      return response.data;
    } catch (error) {
      console.error('❌ ShopApi - getProducts error:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    try {
      console.log('🛍️ ShopApi - getProduct called with ID:', id);
      console.log('🔗 Request URL:', `${this.baseUrl}/products/${id}`);

      const response = await api.get<ApiResponse<Product>>(
        `${this.baseUrl}/products/${id}`
      );

      console.log('✅ ShopApi - getProduct response:', response.data);
      console.log('📦 Product details:', response.data.data);

      return response.data;
    } catch (error) {
      console.error(`❌ ShopApi - getProduct error for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: string,
    params: Omit<ShopApiParams, 'category'> = {}
  ): Promise<ApiResponse<Product[]>> {
    console.log('🛍️ ShopApi - getProductsByCategory called with category:', category, 'and params:', params);
    return this.getProducts({ ...params, category });
  }

  /**
   * Search products by name or description
   */
  async searchProducts(
    searchTerm: string,
    params: Omit<ShopApiParams, 'search'> = {}
  ): Promise<ApiResponse<Product[]>> {
    console.log('🛍️ ShopApi - searchProducts called with search term:', searchTerm, 'and params:', params);
    return this.getProducts({ ...params, search: searchTerm });
  }

  /**
   * Get products within a price range
   */
  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    params: Omit<ShopApiParams, 'min_price' | 'max_price'> = {}
  ): Promise<ApiResponse<Product[]>> {
    console.log('🛍️ ShopApi - getProductsByPriceRange called with minPrice:', minPrice, 'maxPrice:', maxPrice, 'and params:', params);
    return this.getProducts({ ...params, min_price: minPrice, max_price: maxPrice });
  }

  /**
   * Get products by vehicle trim
   */
  async getProductsByVehicleTrim(
    vehicleTrim: string,
    params: Omit<ShopApiParams, 'vehicle_trim'> = {}
  ): Promise<ApiResponse<Product[]>> {
    console.log('🛍️ ShopApi - getProductsByVehicleTrim called with vehicleTrim:', vehicleTrim, 'and params:', params);
    return this.getProducts({ ...params, vehicle_trim: vehicleTrim });
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      console.log('🛍️ ShopApi - getCategories called');
      console.log('🔗 Request URL:', `${this.baseUrl}/categories`);

      const response = await api.get<ApiResponse<string[]>>(
        `${this.baseUrl}/categories`
      );

      console.log('✅ ShopApi - getCategories response:', response.data);
      console.log('📂 Categories count:', response.data.data?.length || 0);
      console.log('📂 Categories list:', response.data.data);

      return response.data;
    } catch (error) {
      console.error('❌ ShopApi - getCategories error:', error);
      throw error;
    }
  }

  /**
   * Get all vehicle trims
   */
  async getVehicleTrims(): Promise<ApiResponse<string[]>> {
    try {
      console.log('🛍️ ShopApi - getVehicleTrims called');
      console.log('🔗 Request URL:', `${this.baseUrl}/vehicle-trims`);

      const response = await api.get<ApiResponse<string[]>>(
        `${this.baseUrl}/vehicle-trims`
      );

      console.log('✅ ShopApi - getVehicleTrims response:', response.data);
      console.log('🚗 Vehicle trims count:', response.data.data?.length || 0);
      console.log('🚗 Vehicle trims list:', response.data.data);

      return response.data;
    } catch (error) {
      console.error('❌ ShopApi - getVehicleTrims error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const shopApi = new ShopApi();
export default shopApi;

// Export the class for testing or custom instances
export { ShopApi };

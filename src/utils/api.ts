import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Check both possible storage keys
    const directToken = localStorage.getItem('auth_token');
    if (directToken) return directToken;
    
    // Check Redux persist storage
    const persistAuth = localStorage.getItem('persist:auth');
    if (persistAuth) {
      try {
        const authData = JSON.parse(persistAuth);
        if (authData.token) {
          const tokenData = JSON.parse(authData.token);
          return tokenData;
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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const { data } = response.data;
    
    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
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

  // Variations API
  async getVariations(params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/variations?${queryString}`);
    return response.data.data || response.data;
  }

  async getVariation(id: number) {
    const response = await api.get(`/variations/${id}`);
    return response.data.data || response.data;
  }

  // Helper function to build FormData for variations
  private buildVariationFormData(data: {
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
  }): FormData {
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
    
    return formData;
  }

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
    const formData = this.buildVariationFormData(data);
    
    const response = await api.post('/variations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  }

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
      const formData = this.buildVariationFormData(data);
      
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

  async deleteVariation(id: number) {
    const response = await api.delete(`/variations/${id}`);
    return response.data.data || response.data;
  }

  // Helper function to map stitch pattern names to local image URLs
  private mapStitchPatternToImageUrl(patternName: string): string {
    const patternMap: Record<string, string> = {
      'Block Illusion': '/stitch-patterns/block-illusion.jpg',
      'Double Diamond': '/stitch-patterns/double-daimond.jpg', // Note: typo in filename
      'Small Diamond': '/stitch-patterns/small-diamond.jpg',
      'Stretched Hexagon': '/stitch-patterns/stretched-hexagon.jpg',
      'Star Diamond': '/stitch-patterns/star-diamond.jpg',
      'Horizontal Hexagon': '/stitch-patterns/horizontal-hexagon.jpg',
      'Vertical Hexagon': '/stitch-patterns/vertical-hexagon.jpg',
      'Oval': '/stitch-patterns/Oval.jpg',
    };
    
    return patternMap[patternName] || '/stitch-patterns/block-illusion.jpg'; // fallback
  }

  // Helper function to transform stitch patterns to use local images
  private transformStitchPatterns(patterns: any[]): any[] {
    return patterns.map(pattern => ({
      ...pattern,
      image_url: this.mapStitchPatternToImageUrl(pattern.name)
    }));
  }

  async getVariationOptions() {
    const response = await api.get('/variations/options');
    
    // Debug: Log the original stitch patterns from API
    console.log('Original stitch patterns from API:', response.data.data?.stitch_patterns || response.data.stitch_patterns);
    
    // Transform stitch patterns to use local images
    if (response.data.data?.stitch_patterns || response.data.stitch_patterns) {
      const stitchPatterns = response.data.data?.stitch_patterns || response.data.stitch_patterns;
      const transformedPatterns = this.transformStitchPatterns(stitchPatterns);
      console.log('Transformed stitch patterns with local images:', transformedPatterns);
      
      return {
        ...response.data.data || response.data,
        stitch_patterns: transformedPatterns
      };
    }
    
    return response.data.data || response.data;
  }

  // Products API
  async getProducts(params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryString}`);
    return response.data.data || response.data;
  }

  async getProduct(id: number) {
    const response = await api.get(`/products/${id}`);
    return response.data.data || response.data;
  }

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

  async deleteProduct(id: number) {
    const response = await api.delete(`/products/${id}`);
    return response.data.data || response.data;
  }

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
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 
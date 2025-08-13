// API service for fetching products from the external API

export interface Product {
  id: number;
  name: string;
  title?: string; 
  category: string;
  subCategory?: string;
  mainCategory?: string;
  images: string[]; 
  image?: string; 
  description: string;
  price: string;
  stock?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  variations?: any[];
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://superiorseats.ali-khalid.com/api';

// Utility function to process image URLs
export const processImageUrl = (imageUrl: string): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return '';
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL starting with /images/, prepend the base URL
  if (imageUrl.startsWith('/images/')) {
    return `https://superiorseats.ali-khalid.com${imageUrl}`;
  }
  
  // If it's a relative URL, prepend the API base URL
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
  }
  
  // If it's just a filename, prepend the API base URL with images path
  return `${API_BASE_URL.replace('/api', '')}/images/${imageUrl}`;
};

export const apiService = {

  // Fetch products with pagination and filters
  async getProducts(params: ProductsParams = {}, token?: string): Promise<ProductsResponse> {
    const { page = 1, limit = 10, search = '', category = '' } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add optional search parameter if provided
    if (search && search.trim() !== '') {
      queryParams.append('search', search.trim());
    }

    if (category && category.trim() !== '') {
      queryParams.append('category', category.trim());
    }

    const url = `${API_BASE_URL}/products?${queryParams.toString()}`;
    
    console.log('🔍 Fetching products from:', url);
    console.log('🔍 Parameters:', { page, limit, search, category });
    console.log('🔍 Using token:', token ? 'Yes' : 'No');
    
    // Retry mechanism with exponential backoff
    const maxRetries = 2;
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          mode: 'cors',
          // Add a reasonable timeout for the fetch request
          signal: AbortSignal.timeout(10000), // 10 second timeout (reduced from 15s)
        });

              console.log('🔍 Response status:', response.status);
        console.log('🔍 Response ok:', response.ok);

        if (!response.ok) {
          let errorText = '';
          try {
            errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
          } catch (textError) {
            console.error('❌ Could not read error response text:', textError);
            errorText = 'Unable to read error response';
          }
          
          const errorResponse = {
            success: false,
            data: [],
            total: 0,
            page: page,
            limit: limit,
            totalPages: 0,
            error: `HTTP error! status: ${response.status} ${response.statusText} - ${errorText}`
          };
          
          // If this is the last attempt, return the error
          if (attempt === maxRetries) {
            return errorResponse;
          }
          
          // Otherwise, throw to trigger retry
          throw new Error(errorResponse.error);
        }

        const data = await response.json();
        console.log('✅ API Response data:', data);
        console.log('✅ Number of products from API:', data.data?.length || 0);
        
        // Process the products to match our expected format
        const processedProducts = (data.data || []).map((product: any) => ({
          id: product.id,
          name: product.name,
          title: product.name, // Map name to title for backward compatibility
          category: product.category,
          subCategory: product.subCategory || '',
          mainCategory: product.mainCategory || '',
          images: product.images || [],
          image: product.images?.[0] || '', // Use first image for backward compatibility
          description: product.description,
          price: product.price,
          stock: product.stock,
          is_active: product.is_active,
          created_at: product.created_at,
          updated_at: product.updated_at,
          variations: product.variations || [],
        }));
        
        return {
          success: true,
          data: processedProducts,
          total: data.total || 0,
          page: data.current_page || page,
          limit: data.per_page || limit,
          totalPages: data.last_page || Math.ceil((data.total || 0) / limit),
        };
        
      } catch (error: any) {
        console.error(`❌ API Error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
        lastError = error;
        
        // If this is the last attempt, return the error
        if (attempt === maxRetries) {
          // Handle specific error types
          let errorMessage = 'Network error';
          
          if (error.name === 'AbortError') {
            errorMessage = 'Request timeout - please check your connection and try again';
          } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Network connection failed - please check your internet connection';
          } else {
            errorMessage = error.message || 'Failed to fetch products';
          }
          
          return {
            success: false,
            data: [],
            total: 0,
            page: page,
            limit: limit,
            totalPages: 0,
            error: errorMessage
          };
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // This should never be reached, but just in case
    return {
      success: false,
      data: [],
      total: 0,
      page: page,
      limit: limit,
      totalPages: 0,
      error: 'All retry attempts failed'
    };
  },

  // Get categories for filtering
  async getCategories(token?: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error: any) {
      console.error('❌ Categories API Error:', error);
      return [];
    }
  },

  // Get a single product by ID
  async getProduct(id: number, token?: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        mode: 'cors',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.product || null;
    } catch (error: any) {
      console.error('❌ Product API Error:', error);
      return null;
    }
  },


};

export default apiService;

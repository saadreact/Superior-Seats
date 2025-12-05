// src/services/materialApi.ts
// API Service for 3D Seat Customization

// Get API base URL from environment variable
// Get API base URL from environment variable and normalize it
const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  // Remove trailing slash
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  // Remove trailing /api if present (to avoid double /api/api)
  if (url.endsWith('/api')) {
    url = url.slice(0, -4);
  }
  return url;
};

const API_BASE_URL = getBaseUrl();

// ===========================
// TypeScript Interfaces
// ===========================

export interface PriceTier {
  tier_id: number;
  tier_name: string;
  price: string;
}

export interface MaterialVendor {
  name: string | null;
  email: string | null;
  website: string | null;
}

export interface MaterialColor {
  id: number;
  name: string;
  hex_code: string;
  image: string | null; // Full URL from Laravel (Storage::url)
  price?: number; // Direct price from API
  description?: string;
  collection_name: string | null;
  price_tiers: PriceTier[];
}

export interface MaterialType {
  id: number;
  name: string;
  shader_id: string;
  description: string;
  image: string | null;
  vendor: MaterialVendor;
  colors: MaterialColor[];
}

export interface ProductBasic {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  is_active: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  vehicle_trim: {
    id: number;
    name: string;
    model: {
      id: number;
      name: string;
    } | null;
    make: {
      id: number;
      name: string;
    } | null;
  } | null;
  images: Array<{
    id: number;
    path: string;
    url: string;
    is_primary: boolean;
    is_active: boolean;
  }>;
}

export interface ModelConfig {
  model_file_url: string;
  customizable_meshes: string[];
}

export interface VariationOption {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price_adjustment: string;
  is_active: boolean;
}

export interface StitchColor {
  id: number;
  name: string;
  hex_code: string;
  image: string | null;
}

export interface StitchPattern extends VariationOption {
  static_pattern_id?: string | null; // Maps to static file path (e.g., "1-2" for /assets/patterns/1/02.jpg)
  stitch_colors: StitchColor[];
}

export interface CustomizeOptions {
  seat_types: VariationOption[];
  seat_styles: VariationOption[];
  relaxors: VariationOption[];
  arm_types: VariationOption[];
  lumbar_types: VariationOption[];
  recline_types: VariationOption[];
  heat_options: VariationOption[];
  item_types: VariationOption[];
  stitch_patterns: StitchPattern[];
}

export interface Product3DConfig {
  product: ProductBasic;
  model_config: ModelConfig;
  materials: MaterialType[];
  customize_options: CustomizeOptions;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errors: any | null;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

// ===========================
// API Methods
// ===========================

// Cache for API responses to prevent duplicate calls
const configCache = new Map<string, { data: Product3DConfig; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const pendingRequests = new Map<string, Promise<Product3DConfig>>();

export const materialApi = {
  /**
   * Get complete 3D configuration for a product
   * Endpoint: GET /api/shop/products/{id}/3d-config
   * Returns: Product info, GLB model URL, materials with colors, and customization options
   */
  async getProduct3DConfig(productId: number | string): Promise<Product3DConfig> {
    const cacheKey = String(productId);
    
    // Check cache first
    const cached = configCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`✅ Using cached 3D config for product ID: ${productId}`);
      return cached.data;
    }

    // Check if there's already a pending request for this product
    if (pendingRequests.has(cacheKey)) {
      console.log(`⏳ Reusing pending request for product ID: ${productId}`);
      return pendingRequests.get(cacheKey)!;
    }

    // Create new request
    const requestPromise = (async () => {
      try {
        console.log(`🔄 Fetching 3D config for product ID: ${productId}`);

        const response = await fetch(
          `${API_BASE_URL}/api/shop/products/${productId}/3d-config`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const apiResponse: ApiResponse<Product3DConfig> = await response.json();

        if (apiResponse.status !== 'success') {
          throw new Error(apiResponse.message || 'Failed to fetch 3D config');
        }

        // Cache the result
        configCache.set(cacheKey, {
          data: apiResponse.data,
          timestamp: Date.now()
        });

        console.log('✅ 3D config loaded successfully:', {
          productId: apiResponse.data.product.id,
          productName: apiResponse.data.product.name,
          materialsCount: apiResponse.data.materials.length,
          modelUrl: apiResponse.data.model_config.model_file_url,
          customizableOptions: {
            seat_types: apiResponse.data.customize_options.seat_types?.length || 0,
            seat_styles: apiResponse.data.customize_options.seat_styles?.length || 0,
            relaxors: apiResponse.data.customize_options.relaxors?.length || 0,
            arm_types: apiResponse.data.customize_options.arm_types?.length || 0,
            lumbar_types: apiResponse.data.customize_options.lumbar_types?.length || 0,
            recline_types: apiResponse.data.customize_options.recline_types?.length || 0,
            heat_options: apiResponse.data.customize_options.heat_options?.length || 0,
            item_types: apiResponse.data.customize_options.item_types?.length || 0,
            stitch_patterns: apiResponse.data.customize_options.stitch_patterns?.length || 0,
          },
        });

        return apiResponse.data;
      } catch (error: any) {
        console.error(`❌ Error fetching 3D config for product ${productId}:`, error);
        throw error;
      } finally {
        // Remove from pending requests
        pendingRequests.delete(cacheKey);
      }
    })();

    // Store pending request
    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  },

  /**
   * Get all active material types (fallback/standalone endpoint)
   * Endpoint: GET /api/shop/material-types
   */
  async getMaterialTypes(): Promise<MaterialType[]> {
    try {
      console.log('🔄 Fetching material types...');

      const response = await fetch(`${API_BASE_URL}/api/shop/material-types`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch material types: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Material types loaded:', data.data?.length || 0);

      return data.data || [];
    } catch (error) {
      console.error('❌ Error fetching material types:', error);
      throw error;
    }
  },

  /**
   * Get colors for a specific material type (fallback/standalone endpoint)
   * Endpoint: GET /api/shop/material-types/{id}/colors
   */
  async getMaterialColors(materialTypeId: number): Promise<MaterialColor[]> {
    try {
      console.log(`🔄 Fetching colors for material type ${materialTypeId}...`);

      const response = await fetch(
        `${API_BASE_URL}/api/shop/material-types/${materialTypeId}/colors`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch colors: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(`✅ Colors loaded for material ${materialTypeId}:`, data.data?.length || 0);

      return data.data || [];
    } catch (error) {
      console.error(`❌ Error fetching colors for material ${materialTypeId}:`, error);
      throw error;
    }
  },
};

// ===========================
// Helper Functions
// ===========================

/**
 * Calculate total price based on selections
 */
export function calculateTotalPrice(
  basePrice: string,
  selectedColor: MaterialColor | null,
  selectedOptions: {
    seat_type?: VariationOption;
    seat_style?: VariationOption;
    arm_type?: VariationOption;
    lumbar_type?: VariationOption;
    recline_type?: VariationOption;
    heat_option?: VariationOption;
    item_type?: VariationOption;
    stitch_pattern?: StitchPattern;
  },
  priceTierId: number = 1 // Default to retail tier
): number {
  let total = parseFloat(basePrice);

  // Add color price adjustment from selected tier
  if (selectedColor && selectedColor.price_tiers.length > 0) {
    const tier = selectedColor.price_tiers.find(t => t.tier_id === priceTierId);
    if (tier) {
      total += parseFloat(tier.price);
    }
  }

  // Add all variation option price adjustments
  Object.values(selectedOptions).forEach(option => {
    if (option && option.price_adjustment) {
      total += parseFloat(option.price_adjustment);
    }
  });

  return total;
}

/**
 * Format price for display
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numPrice);
}

/**
 * Check if product has any customization options
 */
export function hasCustomizationOptions(config: Product3DConfig): boolean {
  const opts = config.customize_options;
  return (
    opts.seat_types.length > 0 ||
    opts.seat_styles.length > 0 ||
    opts.arm_types.length > 0 ||
    opts.lumbar_types.length > 0 ||
    opts.recline_types.length > 0 ||
    opts.heat_options.length > 0 ||
    opts.item_types.length > 0 ||
    opts.stitch_patterns.length > 0
  );
}

export default materialApi;

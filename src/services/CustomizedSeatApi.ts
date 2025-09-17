import axios from 'axios';

const API_BASE_URL = 'https://superiorseats.ali-khalid.com/api';

export interface Vendor {
  id: number;
  name: string;
  code: string;
  description: string;
  website: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Color {
  id: number;
  name: string;
  hex_code: string;
  description: string;
  is_active: boolean;
  color_vendor_id: number | null;
  vendor: Vendor | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface VehicleModel {
  id: number;
  name: string;
  description: string;
  vehicle_make_id: number;
  is_active: boolean;
  trims_count: number;
  created_at: string;
  updated_at: string;
}

export interface VehicleTrim {
  id: number;
  name: string;
  description: string;
  vehicle_model_id: number;
  vehicle_make_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ColorsApiResponse {
  status: string;
  message: string;
  data: Color[];
  errors: any;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

export interface VehicleModelsApiResponse {
  status: string;
  message: string;
  data: VehicleModel[];
  errors: any;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

export interface VehicleTrimsApiResponse {
  status: string;
  message: string;
  data: VehicleTrim[];
  errors: any;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

export interface ProductVariation {
  id: number;
  name: string;
  value: string;
  price_adjustment: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Additional interfaces for variation data
export interface Color {
  id: number;
  name: string;
  hex_code: string;
  description: string;
  is_active: boolean;
  color_vendor_id: number | null;
  color_category_id: number | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface MaterialType {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  cost?: string | null;
  price?: string | null;
  is_active: boolean;
  created_by?: number | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface HeatOption {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  cost?: string | null;
  price?: string | null;
  is_active: boolean | null;
  created_by?: number | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface LumbarType {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  cost?: string | null;
  price?: string | null;
  is_active: boolean | null;
  created_by?: number | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface ReclineType {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  cost?: string | null;
  price?: string | null;
  is_active: boolean | null;
  created_by?: number | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface SeatStitchPattern {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  cost?: string | null;
  price?: string | null;
  is_active: boolean | null;
  created_by?: number | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface ArmType {
  id: number;
  name: string;
  description: string;
  image?: string;
  image_url?: string;
  cost?: string | null;
  price?: string | null;
  is_active: boolean | null;
  created_by?: number | null;
  price_tiers: any[];
  created_at: string;
  updated_at: string;
}

export interface SeatType {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeatStyle {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemType {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceTier {
  id: number;
  name: string;
  description: string | null;
  price_adjustment: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    color_id?: number;
    price_tier_id: number;
    price_adjustment: string;
    is_active: number;
    created_at: string;
    updated_at: string;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  is_active: boolean;
  show_on_special_shop: boolean;
  created_at: string;
  updated_at: string;
  vehicle_trim_id: number;
  category_id: number;
  category: Category;
  variations: ProductVariation[];
  vehicle_trim: VehicleTrim;
  product_images: ProductImage[];
  primary_image: ProductImage;
  active_images: ProductImage[];
  colors: Color[];
  material_types: MaterialType[];
  heat_options: HeatOption[];
  lumbar_types: LumbarType[];
  recline_types: ReclineType[];
  seat_stitch_patterns: SeatStitchPattern[];
  arm_types: ArmType[];
  seat_types: SeatType[];
  seat_styles: SeatStyle[];
  item_types: ItemType[];
}

export interface ProductApiResponse {
  status: string;
  message: string;
  data: Product;
  errors: any;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

export const CustomizedSeatApi = {
  // Get colors with optional search and vendor_id parameters
  getColors: async (search?: string, vendor_id?: number): Promise<Color[]> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (vendor_id) params.append('vendor_id', vendor_id.toString());

      const response = await axios.get<ColorsApiResponse>(
        `${API_BASE_URL}/shop/colors?${params.toString()}`
      );

      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch colors');
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  },

  // Get all colors (default call)
  getAllColors: async (): Promise<Color[]> => {
    return CustomizedSeatApi.getColors();
  },

  // Search colors by name
  searchColors: async (searchTerm: string): Promise<Color[]> => {
    return CustomizedSeatApi.getColors(searchTerm);
  },

  // Get colors by vendor
  getColorsByVendor: async (vendorId: number): Promise<Color[]> => {
    return CustomizedSeatApi.getColors(undefined, vendorId);
  },

  // Get vehicle models with optional vehicle_make_id parameter
  getVehicleModels: async (vehicle_make_id?: number): Promise<VehicleModel[]> => {
    try {
      const params = new URLSearchParams();
      if (vehicle_make_id) params.append('vehicle_make_id', vehicle_make_id.toString());

      const response = await axios.get<VehicleModelsApiResponse>(
        `${API_BASE_URL}/shop/vehicle-models?${params.toString()}`
      );

      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch vehicle models');
      }
    } catch (error) {
      console.error('Error fetching vehicle models:', error);
      throw error;
    }
  },

  // Get all vehicle models (default call)
  getAllVehicleModels: async (): Promise<VehicleModel[]> =>{
    return CustomizedSeatApi.getVehicleModels();
  },

  // Get vehicle models by make
  getVehicleModelsByMake: async (makeId: number): Promise<VehicleModel[]> => {
    return CustomizedSeatApi.getVehicleModels(makeId);
  },

  // Get vehicle trims with optional vehicle_model_id and vehicle_make_id parameters
  getVehicleTrims: async (vehicle_model_id?: number, vehicle_make_id?: number): Promise<VehicleTrim[]> => {
    try {
      const params = new URLSearchParams();
      if (vehicle_model_id) params.append('vehicle_model_id', vehicle_model_id.toString());
      if (vehicle_make_id) params.append('vehicle_make_id', vehicle_make_id.toString());

      const response = await axios.get<VehicleTrimsApiResponse>(
        `${API_BASE_URL}/shop/vehicle-trims?${params.toString()}`
      );

      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch vehicle trims');
      }
    } catch (error) {
      console.error('Error fetching vehicle trims:', error);
      throw error;
    }
  },

  // Get all vehicle trims (default call)
  getAllVehicleTrims: async (): Promise<VehicleTrim[]> => {
    return CustomizedSeatApi.getVehicleTrims();
  },

  // Get vehicle trims by model
  getVehicleTrimsByModel: async (modelId: number): Promise<VehicleTrim[]> => {
    return CustomizedSeatApi.getVehicleTrims(modelId);
  },

  // Get vehicle trims by model and make
  getVehicleTrimsByModelAndMake: async (modelId: number, makeId: number): Promise<VehicleTrim[]> => {
    return CustomizedSeatApi.getVehicleTrims(modelId, makeId);
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    try {
      console.log('🔄 CustomizedSeatApi - Fetching product details for ID:', id);
      
      const response = await axios.get<ProductApiResponse>(
        `${API_BASE_URL}/shop/product/${id}`
      );

      if (response.data.status === 'success') {
        console.log('✅ CustomizedSeatApi - Product details fetched successfully:', response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch product details');
      }
    } catch (error) {
      console.error('❌ CustomizedSeatApi - Error fetching product details:', error);
      throw error;
    }
  }
};

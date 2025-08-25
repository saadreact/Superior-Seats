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
  getAllVehicleModels: async (): Promise<VehicleModel[]> => {
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
  }
};

import api from "../utils/axios";

// ============================================================================
// TYPES DEFINITIONS
// ============================================================================

// Base API Response Structure
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  meta?: {
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    timestamp?: string;
    request_id?: string;
  };
}

// Product Image Interface
export interface ProductImage {
  id?: number;
  product_id?: number;
  image_path: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  set_primary: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Product Variation Interface
export interface ProductVariation {
  id: number;
  name: string;
  stitch_pattern?: string;
  arm_type: string;
  lumbar: string;
  recline_type: string;
  seat_type: string;
  material_type: string;
  heat_option: string;
  seat_item_type: string;
  color: string;
  price?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pivot?: {
    product_id: number;
    variation_id: number;
  };
}

// Category Interface
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Main Product Interface
export interface Product {
  id: number;
  name: string;
  description: string;
  category: Category | null;
  price: string;
  stock: number;
  images?: string[];
  is_active: boolean;
  is_customize_3d_product?: boolean;
  show_on_special_shop?: boolean;
  created_at: string;
  updated_at: string;
  vehicle_trim_id?: number | null;
  category_id?: number | null;
  vehicle_trim?: any | null;
  primary_image?: ProductImage;
  variations?: ProductVariation[];
  
  // 3D Customization fields (response)
  model_file_path?: string; // Path to GLB file
  customizable_meshes?: string[]; // Array of mesh names
  material_types?: Array<{ // Material types available for this product
    id: number;
    name: string;
    image?: string;
    shader_id?: string;
  }>;
}

// Products Response Interface
export interface ProductsResponse {
  current_page: number;
  data: Product[];
  first_page_url: string;
  last_page: number;
  per_page: number;
  total: number;
}

// Variation Option Interface (for dropdowns)
export interface VariationOption {
  id: number;
  name: string;
  price?: number;
  cost?: number;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Product Creation/Update Data Interface (matching Swagger API)
export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  is_active: boolean;
  is_customize_3d_product?: boolean;
  show_on_special_shop?: boolean;
  category_id?: number;
  vehicle_trim_id?: number;
  images?: File[];
  image_data?: Array<{
    alt_text: string;
    caption: string;
    set_primary: boolean;
  }>;

  variation_ids?: number[];
  seat_type_ids?: number[];
  arm_type_ids?: number[];
  lumbar_type_ids?: number[];
  recline_type_ids?: number[];
  heat_option_ids?: number[];
  material_type_ids?: number[];
  seat_stitch_pattern_ids?: number[]; // Updated field name
  seat_style_ids?: number[]; // New field from Swagger
  item_type_ids?: number[]; // Updated field name
  color_ids?: number[];
  
  // Price tiers fields
  price_tier_ids?: number[]; // Alternative format: Simple array of price tier IDs
  price_tiers?: Array<{
    id: number;
    price_adjustment: number;
    is_active: boolean;
  }>;
  
  // 3D Customization fields
  model_file?: File; // GLB 3D model file
  customizable_meshes?: string[]; // Array of mesh names that can be customized
}

// Product Update Data Interface (extends ProductData with optional fields)
export interface ProductUpdateData extends Partial<ProductData> {
  primary_image_index?: number;
  image_data?: Array<{
    alt_text: string;
    caption: string;
    set_primary: boolean;
  }>;
  current_model_file_path?: string; // Current GLB file path when no new file is selected
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// ============================================================================
// PRODUCT API CLASS
// ============================================================================

class ProductApi {
  private baseUrl: string | undefined;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // ============================================================================
  // PRODUCT CRUD OPERATIONS
  // ============================================================================

  /**
   * Get all products with filtering and pagination
   */
  async getProducts(
    params: {
      category?: string;
      search?: string;
      is_active?: boolean;
      price_min?: number;
      price_max?: number;
      page?: number;
      per_page?: number;
    } = {}
  ): Promise<ProductsResponse> {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v != null) as string[][]
      ).toString();

      const response = await api.get(
        `/products${queryString ? `?${queryString}` : ""}`
      );

      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return {
          data: response.data,
          current_page: 1,
          first_page_url: "",
          last_page: 1,
          per_page: response.data.length,
          total: response.data.length,
        };
      }
      return {
        data: [],
        current_page: 1,
        first_page_url: "",
        last_page: 1,
        per_page: 0,
        total: 0,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);

      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      throw new Error("Invalid response structure");
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }

  /**
   * Create new product with variations and images (matching Swagger API format)
   */
  async createProduct(data: ProductData): Promise<Product> {
    try {
      const formData = new FormData();

      // Add basic product fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("is_active", data.is_active ? "1" : "0");
      if (data.is_customize_3d_product !== undefined) {
        formData.append("is_customize_3d_product", data.is_customize_3d_product ? "1" : "0");
      }
      if (data.show_on_special_shop !== undefined) {
        formData.append("show_on_special_shop", data.show_on_special_shop ? "1" : "0");
      }

      if (data.category_id) {
        formData.append("category_id", data.category_id.toString());
      }
      if (data.vehicle_trim_id) {
        formData.append("vehicle_trim_id", data.vehicle_trim_id.toString());
      }

      // Add variation IDs as arrays (API expects arrays, not comma-separated strings)
      if (data.variation_ids && data.variation_ids.length > 0) {
        data.variation_ids.forEach((id: number) => {
          formData.append("variation_ids[]", id.toString());
        });
      }
      if (data.seat_type_ids && data.seat_type_ids.length > 0) {
        data.seat_type_ids.forEach((id: number) => {
          formData.append("seat_type_ids[]", id.toString());
        });
      }
      if (data.arm_type_ids && data.arm_type_ids.length > 0) {
        data.arm_type_ids.forEach((id: number) => {
          formData.append("arm_type_ids[]", id.toString());
        });
      }
      if (data.lumbar_type_ids && data.lumbar_type_ids.length > 0) {
        data.lumbar_type_ids.forEach((id: number) => {
          formData.append("lumbar_type_ids[]", id.toString());
        });
      }
      if (data.recline_type_ids && data.recline_type_ids.length > 0) {
        data.recline_type_ids.forEach((id: number) => {
          formData.append("recline_type_ids[]", id.toString());
        });
      }
      if (data.heat_option_ids && data.heat_option_ids.length > 0) {
        data.heat_option_ids.forEach((id: number) => {
          formData.append("heat_option_ids[]", id.toString());
        });
      }
      if (data.material_type_ids && data.material_type_ids.length > 0) {
        data.material_type_ids.forEach((id: number) => {
          formData.append("material_type_ids[]", id.toString());
        });
      }
      if (
        data.seat_stitch_pattern_ids &&
        data.seat_stitch_pattern_ids.length > 0
      ) {
        data.seat_stitch_pattern_ids.forEach((id: number) => {
          formData.append("seat_stitch_pattern_ids[]", id.toString());
        });
      }
      if (data.seat_style_ids && data.seat_style_ids.length > 0) {
        data.seat_style_ids.forEach((id: number) => {
          formData.append("seat_style_ids[]", id.toString());
        });
      }
      if (data.item_type_ids && data.item_type_ids.length > 0) {
        data.item_type_ids.forEach((id: number) => {
          formData.append("item_type_ids[]", id.toString());
        });
      }
      if (data.color_ids && data.color_ids.length > 0) {
        data.color_ids.forEach((id: number) => {
          formData.append("color_ids[]", id.toString());
        });
      }

      // Handle price tiers - backend supports both formats
      if (data.price_tiers && data.price_tiers.length > 0) {
        // Preferred format: Array of price tiers with their price adjustments
        data.price_tiers.forEach((tier, index) => {
          formData.append(`price_tiers[${index}][id]`, tier.id.toString());
          formData.append(`price_tiers[${index}][price_adjustment]`, tier.price_adjustment.toString());
          formData.append(`price_tiers[${index}][is_active]`, tier.is_active ? "1" : "0");
        });
      } else if (data.price_tier_ids && data.price_tier_ids.length > 0) {
        // Alternative format: Simple array of price tier IDs (for backward compatibility)
        data.price_tier_ids.forEach((id) => {
          formData.append("price_tier_ids[]", id.toString());
        });
      }

      // Handle images according to backend API specification
      if (data.images && data.images.length > 0) {
        
        // Send images as array of files (backend expects array<string> for image files)
        data.images.forEach((file, index) => {
          
          // Backend expects images as array of files
          formData.append('images[]', file);
        });
        
        // Add image metadata using nested object notation (matching backend expectation)
        if (data.image_data && data.image_data.length > 0) {
          data.image_data.forEach((imageMeta, index) => {
            formData.append(`image_data[${index}].alt_text`, imageMeta.alt_text || "");
            formData.append(`image_data[${index}].caption`, imageMeta.caption || "");
            formData.append(`image_data[${index}].set_primary`, imageMeta.set_primary ? "1" : "0");
          });
        } else {
          // Default image metadata if not provided
          data.images.forEach((_, index) => {
            formData.append(`image_data[${index}].alt_text`, `Product image ${index + 1}`);
            formData.append(`image_data[${index}].caption`, `Product image ${index + 1}`);
            formData.append(`image_data[${index}].set_primary`, index === 0 ? "1" : "0");
          });
        }
      } else {
        
      }

      // Handle 3D customization fields
      if (data.model_file) {
        formData.append('model_file', data.model_file);
        console.log('✅ Added model_file to FormData:', data.model_file.name, data.model_file.size);
      }
      
      if (data.customizable_meshes && data.customizable_meshes.length > 0) {
        data.customizable_meshes.forEach((mesh, index) => {
          formData.append(`customizable_meshes[${index}]`, mesh);
        });
        console.log('✅ Added customizable_meshes to FormData:', data.customizable_meshes);
      }

      // Debug: Log FormData contents
      console.log('\n=== FORMDATA CONTENTS ===');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`[FILE] ${key}:`, value.name, `(${(value.size / 1024).toFixed(2)} KB)`);
        } else {
          console.log(`[FIELD] ${key}:`, value);
        }
      }
      console.log('=========================\n');
      
      // Debug: Check if 3D files are in FormData
      const modelFile = Array.from(formData.entries()).find(([key]) => key === 'model_file');
      if (modelFile) {
        console.log('3D Model file found in FormData');
      } else if (data.is_customize_3d_product) {
        console.warn('3D customization enabled but no model_file in FormData!');
      }

      const response = await api.post("/products", formData, {
        headers: {
          // Completely remove Content-Type to let browser set multipart boundary
          "Content-Type": undefined,
        },
        // Ensure FormData is not transformed
        transformRequest: [(data) => {
          if (data instanceof FormData) {
            return data;
          }
          return data;
        }],
        // Add timeout and other options
        timeout: 30000, // 30 seconds timeout for file uploads
      });

      console.log('\n=== API RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
      // Check for 3D fields in response
      const productData = response.data?.data || response.data;
      if (productData) {
        console.log('\n3D Fields in response:');
        console.log('- is_customize_3d_product:', productData.is_customize_3d_product);
        console.log('- model_file_path:', productData.model_file_path);
        console.log('- customizable_meshes:', productData.customizable_meshes);
        console.log('- material_types:', productData.material_types?.length || 0, 'types');
      }
      console.log('====================\n');

      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {

      if (
        error.response?.data?.message?.includes("Duplicate entry") ||
        error.response?.data?.message?.includes("unique_primary_per_product")
      ) {
        throw new Error(
          "Image upload failed: Each product can only have one primary image. Please ensure only one image is marked as primary."
        );
      }

      if (
        error.response?.data?.message?.includes(
          "Integrity constraint violation"
        )
      ) {
        throw new Error(
          "Database constraint violation. Please check your input data and try again."
        );
      }

      throw new Error(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }

  /**
   * Update existing product (matching Swagger API format)
   */
  async updateProduct(id: number, data: ProductUpdateData): Promise<Product> {
    try {
      const formData = new FormData();

      // Add basic product fields
      if (data.name !== undefined) formData.append("name", data.name);
      if (data.description !== undefined)
        formData.append("description", data.description);
      if (data.price !== undefined)
        formData.append("price", data.price.toString());
      if (data.stock !== undefined)
        formData.append("stock", data.stock.toString());
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active ? "1" : "0");
      if (data.is_customize_3d_product !== undefined)
        formData.append("is_customize_3d_product", data.is_customize_3d_product ? "1" : "0");
      if (data.show_on_special_shop !== undefined) {
        formData.append("show_on_special_shop", data.show_on_special_shop ? "1" : "0");
      }

      if (data.category_id !== undefined) {
        formData.append("category_id", data.category_id.toString());
      }
      if (data.vehicle_trim_id !== undefined) {
        formData.append("vehicle_trim_id", data.vehicle_trim_id.toString());
      }

      // Add variation IDs as arrays (API expects arrays, not comma-separated strings)
      if (data.variation_ids && data.variation_ids.length > 0) {
        data.variation_ids.forEach((id: number) => {
          formData.append("variation_ids[]", id.toString());
        });
      }
      if (data.seat_type_ids && data.seat_type_ids.length > 0) {
        data.seat_type_ids.forEach((id: number) => {
          formData.append("seat_type_ids[]", id.toString());
        });
      }
      if (data.arm_type_ids && data.arm_type_ids.length > 0) {
        data.arm_type_ids.forEach((id: number) => {
          formData.append("arm_type_ids[]", id.toString());
        });
      }
      if (data.lumbar_type_ids && data.lumbar_type_ids.length > 0) {
        data.lumbar_type_ids.forEach((id: number) => {
          formData.append("lumbar_type_ids[]", id.toString());
        });
      }
      if (data.recline_type_ids && data.recline_type_ids.length > 0) {
        data.recline_type_ids.forEach((id: number) => {
          formData.append("recline_type_ids[]", id.toString());
        });
      }
      if (data.heat_option_ids && data.heat_option_ids.length > 0) {
        data.heat_option_ids.forEach((id: number) => {
          formData.append("heat_option_ids[]", id.toString());
        });
      }
      if (data.material_type_ids && data.material_type_ids.length > 0) {
        data.material_type_ids.forEach((id: number) => {
          formData.append("material_type_ids[]", id.toString());
        });
      }
      if (
        data.seat_stitch_pattern_ids &&
        data.seat_stitch_pattern_ids.length > 0
      ) {
        data.seat_stitch_pattern_ids.forEach((id: number) => {
          formData.append("seat_stitch_pattern_ids[]", id.toString());
        });
      }
      if (data.seat_style_ids && data.seat_style_ids.length > 0) {
        data.seat_style_ids.forEach((id: number) => {
          formData.append("seat_style_ids[]", id.toString());
        });
      }
      if (data.item_type_ids && data.item_type_ids.length > 0) {
        data.item_type_ids.forEach((id: number) => {
          formData.append("item_type_ids[]", id.toString());
        });
      }
      if (data.color_ids && data.color_ids.length > 0) {
        data.color_ids.forEach((id: number) => {
          formData.append("color_ids[]", id.toString());
        });
      }

      // Handle price tiers - backend supports both formats
      if (data.price_tiers && data.price_tiers.length > 0) {
        // Preferred format: Array of price tiers with their price adjustments
        data.price_tiers.forEach((tier, index) => {
          formData.append(`price_tiers[${index}][id]`, tier.id.toString());
          formData.append(`price_tiers[${index}][price_adjustment]`, tier.price_adjustment.toString());
          formData.append(`price_tiers[${index}][is_active]`, tier.is_active ? "1" : "0");
        });
      } else if (data.price_tier_ids && data.price_tier_ids.length > 0) {
        // Alternative format: Simple array of price tier IDs (for backward compatibility)
        data.price_tier_ids.forEach((id) => {
          formData.append("price_tier_ids[]", id.toString());
        });
      }

      // Combine existing images and new images into a single image_data array
      let allImageData: Array<{
        image_path?: string;
        alt_text: string;
        caption: string;
        set_primary: boolean;
        isNewImage?: boolean;
      }> = [];

      // Add existing images first
      if ((data as any).existing_images && Array.isArray((data as any).existing_images)) {
        (data as any).existing_images.forEach((imageUrl: string, index: number) => {
          allImageData.push({
            image_path: imageUrl,
            alt_text: `Product image ${index + 1}`,
            caption: `Product image ${index + 1}`,
            set_primary: index === 0,
            isNewImage: false
          });
        });
        
      }

      // Add new images metadata
      if (data.image_data && Array.isArray(data.image_data)) {
        data.image_data.forEach((imageMeta, index) => {
          allImageData.push({
            alt_text: imageMeta.alt_text || `Product image ${allImageData.length + 1}`,
            caption: imageMeta.caption || `Product image ${allImageData.length + 1}`,
            set_primary: imageMeta.set_primary,
            isNewImage: true
          });
        });
        
      }

      // Add all image_data to FormData
      allImageData.forEach((imageData, index) => {
        if (imageData.image_path) {
          formData.append(`image_data[${index}].image_path`, imageData.image_path);
        }
        formData.append(`image_data[${index}].alt_text`, imageData.alt_text);
        formData.append(`image_data[${index}].caption`, imageData.caption);
        formData.append(`image_data[${index}].set_primary`, imageData.set_primary ? "1" : "0");
        
      });


      // Handle new images according to backend API specification
      if (data.images && data.images.length > 0) {
        data.images.forEach((file, index) => {
          if (file instanceof File) {
            
            
            // Backend expects images as array of files
            formData.append('images[]', file);
            
            
          }
        });
      } else {
        
      }

      // Handle 3D customization fields - SAME AS CREATE
      if (data.model_file) {
        formData.append('model_file', data.model_file);
        console.log('✅ Added model_file to FormData (UPDATE):', data.model_file.name, data.model_file.size);
      } else if (data.current_model_file_path) {
        // Send current model file path when no new file is selected (similar to current_image for images)
        formData.append('current_model_file_path', data.current_model_file_path);
        console.log('✅ Added current_model_file_path to FormData (UPDATE):', data.current_model_file_path);
      }
      
      if (data.customizable_meshes && data.customizable_meshes.length > 0) {
        data.customizable_meshes.forEach((mesh, index) => {
          formData.append(`customizable_meshes[${index}]`, mesh);
        });
        console.log('✅ Added customizable_meshes to FormData (UPDATE):', data.customizable_meshes);
      }

      // Use POST with _method: PUT for FormData (Laravel convention)
      formData.append("_method", "PUT");

      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          
        } else {
          
        }
      }

      const response = await api.post(`/products/${id}`, formData, {
        headers: {
          // Explicitly remove Content-Type to let browser set multipart boundary
          "Content-Type": undefined,
        },
        // Override the default axios configuration for this request
        transformRequest: [(data) => {
          // If data is FormData, return it as-is without transformation
          if (data instanceof FormData) {
            return data;
          }
          return data;
        }],
      });

      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error: any) {

      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }

      if (
        error.response?.data?.message?.includes("Duplicate entry") ||
        error.response?.data?.message?.includes("unique_primary_per_product")
      ) {
        throw new Error(
          "Image upload failed: Each product can only have one primary image. Please ensure only one image is marked as primary."
        );
      }

      if (
        error.response?.data?.message?.includes(
          "Integrity constraint violation"
        )
      ) {
        throw new Error(
          "Database constraint violation. Please check your input data and try again."
        );
      }

      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }

  // ============================================================================
  // VARIATION DATA FETCHING METHODS
  // ============================================================================

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get("/categories");
      return response.data?.data || response.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }

  /**
   * Get seat types
   */
  async getSeatTypes(params?: Record<string, any>): Promise<VariationOption[]> {
    try {
      const response = await api.get("/seat-types", { params });

      // Handle multiple possible response structures
      let data = response.data;

      // If response has nested data structure
      if (data?.data?.data) {
        data = data.data.data;
      } else if (data?.data) {
        data = data.data;
      }

      // Ensure we have an array
      if (!Array.isArray(data)) {
        return [];
      }
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch seat types"
      );
    }
  }

  /**
   * Get arm types
   */
  async getArmTypes(params?: Record<string, any>): Promise<VariationOption[]> {
    try {
      const response = await api.get("/arm-types", { params });

      // Handle multiple possible response structures
      let data = response.data;

      // If response has nested data structure
      if (data?.data?.data) {
        data = data.data.data;
      } else if (data?.data) {
        data = data.data;
      }

      // Ensure we have an array
      if (!Array.isArray(data)) {
        return [];
      }
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch arm types"
      );
    }
  }

  /**
   * Get lumbar types
   */
  async getLumbarTypes(): Promise<VariationOption[]> {
    try {
      const response = await api.get("/lumbar-types");
      return (
        response.data?.data?.data || response.data?.data || response.data || []
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch lumbar types"
      );
    }
  }

  /**
   * Get recline types
   */
  async getReclineTypes(): Promise<VariationOption[]> {
    try {
      const response = await api.get("/recline-types");
      return (
        response.data?.data?.data || response.data?.data || response.data || []
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recline types"
      );
    }
  }

  /**
   * Get heat options
   */
  async getHeatOptions(): Promise<VariationOption[]> {
    try {
      const response = await api.get("/heat-options");
      return (
        response.data?.data?.data || response.data?.data || response.data || []
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch heat options"
      );
    }
  }

  /**
   * Get material types
   */
  async getMaterialTypes(): Promise<VariationOption[]> {
    try {
      const response = await api.get("/material-types");
      return (
        response.data?.data?.data || response.data?.data || response.data || []
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch material types"
      );
    }
  }

  /**
   * Get stitch patterns
   */
  async getStitchPatterns(): Promise<VariationOption[]> {
    try {
      const response = await api.get("/seat-stitch-patterns");
      return (
        response.data?.data?.data || response.data?.data || response.data || []
      );
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch stitch patterns"
      );
    }
  }

  /**
   * Get seat styles (new field from Swagger)
   */
  async getSeatStyles(
    params?: Record<string, any>
  ): Promise<VariationOption[]> {
    try {
      const response = await api.get("/seat-styles", { params });

      // Handle multiple possible response structures (matching the working seat styles page)
      let data = response.data;

      // Check for triple nested structure first
      if (data?.data?.data) {
        data = data.data.data;
      } else if (data?.data) {
        data = data.data;
      }

      // Ensure we have an array
      if (!Array.isArray(data)) {
        return [];
      }
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch seat styles"
      );
    }
  }

  /**
   * Get item types (updated field name)
   */
  async getItemTypes(params?: Record<string, any>): Promise<VariationOption[]> {
    try {
      const response = await api.get("/item-types", { params });

      // Handle multiple possible response structures
      let data = response.data;

      // If response has nested data structure
      if (data?.data?.data) {
        data = data.data.data;
      } else if (data?.data) {
        data = data.data;
      }

      // Ensure we have an array
      if (!Array.isArray(data)) {
        return [];
      }
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch item types"
      );
    }
  }

  /**
   * Get colors
   */
  async getColors(): Promise<VariationOption[]> {
    try {
      const response = await api.get("/colors");
      return response.data?.data || response.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch colors"
      );
    }
  }

  /**
   * Get price tiers
   */
  async getPriceTiers(): Promise<any[]> {
    try {
      const response = await api.get("/price-tiers");
      return response.data?.data || response.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch price tiers"
      );
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Map variation names to IDs
   */
  mapVariationNamesToIds(
    selectedNames: string[],
    availableOptions: VariationOption[]
  ): number[] {
    return selectedNames
      .map((name) => {
        const option = availableOptions.find((opt) => opt.name === name);
        return option?.id;
      })
      .filter((id): id is number => id !== undefined);
  }

  /**
   * Get product image URL
   */
  getProductImageUrl(product: Product): string | null {
    // Handle both images array and primary_image object from API response
    if (product.primary_image?.image_path) {
      return `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${product.primary_image.image_path}`;
    }

    if (product.images && product.images.length > 0) {
      return `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${product.images[0]}`;
    }

    return null; // No fallback image
  }

  /**
   * Validate product data before submission
   */
  validateProductData(data: ProductData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push("Product name is required");
    }

    if (!data.description?.trim()) {
      errors.push("Product description is required");
    }

    if (data.price <= 0) {
      errors.push("Product price must be greater than 0");
    }

    if (data.stock < 0) {
      errors.push("Stock cannot be negative");
    }

    // Validate that at least one variation is selected for each required field
    const requiredVariationFields = [
      { field: "seat_type_ids", name: "Seat Type" },
      { field: "arm_type_ids", name: "Arm Type" },
      { field: "lumbar_type_ids", name: "Lumbar Type" },
      { field: "recline_type_ids", name: "Recline Type" },
      { field: "heat_option_ids", name: "Heat Option" },
      { field: "material_type_ids", name: "Material Type" },
      { field: "seat_stitch_pattern_ids", name: "Stitch Pattern" },
      { field: "seat_style_ids", name: "Seat Style" },
      { field: "item_type_ids", name: "Item Type" },
      { field: "color_ids", name: "Color" },
    ];

    requiredVariationFields.forEach(({ field, name }) => {
      const fieldValue = data[field as keyof ProductData] as
        | number[]
        | undefined;
      if (!fieldValue || fieldValue.length === 0) {
        errors.push(`At least one ${name} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ============================================================================
  // VEHICLE-RELATED METHODS
  // ============================================================================

  /**
   * Get all vehicle makes
   */
  async getVehicleMakes(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicle-makes`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get vehicle models by make ID
   */
  async getVehicleModels(makeId: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicle-makes/${makeId}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get vehicle trims by model ID
   */
  async getVehicleTrims(modelId: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicle-models/${modelId}/trims`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get vehicle trim by ID
   */
  async getVehicleTrimById(trimId: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/vehicle-trims/${trimId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      throw error;
    }
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const productApi = new ProductApi();
export default productApi;


import api from '../utils/axios';

// Material Types API Service
class MaterialTypesService {
  // Get material types
  async getMaterialTypes(params?: Record<string, any>) {
    try {
      const response = await api.get('/material-types', { params });
      
      // Handle different response structures similar to Products API
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return { data: response.data, meta: response.data.meta || {} };
      }
      return { data: [], meta: {} };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch material types');
    }
  }

  // Get single material type
  async getMaterialType(id: number) {
    try {
      const response = await api.get(`/material-types/${id}`);
      return response.data?.data?.material_type || response.data?.material_type || response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Material type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch material type');
    }
  }

  // Create material type
  async createMaterialType(data: {
    name: string;
    description?: string;
    image?: File | null;
    cost: number;
    price: number;
    is_active?: boolean;
    price_tier_ids: number[];
    price_adjustments?: Record<string, number>;
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('cost', data.cost.toString());
        formData.append('price', data.price.toString());
        if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
        
        // Append single image (not as array) - material types have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Append price adjustments
        if (data.price_adjustments) {
          Object.entries(data.price_adjustments).forEach(([tierId, adjustment]) => {
            formData.append(`price_adjustments[${tierId}]`, adjustment.toString());
          });
        }

        const response = await api.post('/material-types', formData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
            'Content-Type': undefined, // Explicitly remove Content-Type to let browser set it
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      } else {
        // Fallback to JSON if no image
        const jsonData = {
          name: data.name,
          description: data.description,
          cost: data.cost,
          price: data.price,
          is_active: data.is_active,
          price_tier_ids: data.price_tier_ids,
          price_adjustments: data.price_adjustments
        };
        const response = await api.post('/material-types', jsonData);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create material type');
    }
  }

  // Update material type
  async updateMaterialType(id: number, data: {
    name?: string;
    description?: string;
    image?: File | null;
    cost?: number;
    price?: number;
    is_active?: boolean;
    price_tier_ids?: number[];
    price_adjustments?: Record<string, number>;
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.cost !== undefined) formData.append('cost', data.cost.toString());
        if (data.price !== undefined) formData.append('price', data.price.toString());
        if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
        
        // Append single image (not as array) - material types have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Append price adjustments
        if (data.price_adjustments) {
          Object.entries(data.price_adjustments).forEach(([tierId, adjustment]) => {
            formData.append(`price_adjustments[${tierId}]`, adjustment.toString());
          });
        }

        // Use POST with _method: PUT for FormData (Laravel convention)
        formData.append('_method', 'PUT');
        
        const response = await api.post(`/material-types/${id}`, formData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
            'Content-Type': undefined, // Explicitly remove Content-Type to let browser set it
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      } else {
        // Use FormData even without image to ensure proper handling
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.cost !== undefined) formData.append('cost', data.cost.toString());
        if (data.price !== undefined) formData.append('price', data.price.toString());
        if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Append price adjustments
        if (data.price_adjustments) {
          Object.entries(data.price_adjustments).forEach(([tierId, adjustment]) => {
            formData.append(`price_adjustments[${tierId}]`, adjustment.toString());
          });
        }

        // Use POST with _method: PUT for FormData (Laravel convention)
        formData.append('_method', 'PUT');
        
        const response = await api.post(`/material-types/${id}`, formData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
            'Content-Type': undefined, // Explicitly remove Content-Type to let browser set it
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Material type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update material type');
    }
  }

  // Delete material type
  async deleteMaterialType(id: number) {
    try {
      const response = await api.delete(`/material-types/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Material type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete material type');
    }
  }

  // Get price tiers (used by material type forms)
  async getPriceTiers(params?: Record<string, any>) {
    try {
      const response = await api.get('/price-tiers', { params });
      return response.data?.data || response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch price tiers');
    }
  }
}

// Export singleton instance
export const materialTypesService = new MaterialTypesService();
export default materialTypesService;
